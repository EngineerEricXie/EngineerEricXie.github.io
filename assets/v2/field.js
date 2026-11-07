/*
 * field.js — background "lattice under load"
 *
 * A 2-D mass–spring lattice integrated in real time:
 *   • Verlet integration with a weak anchor to the rest configuration
 *   • Position-based (Gauss–Seidel) relaxation of edge-length constraints
 *   • The pointer acts as a point load / gravity well; pressing deepens the well
 *   • Edge colour encodes engineering strain |ℓ − ℓ₀| / ℓ₀
 *
 * Deliberately cheap: a few hundred nodes, ~1.5k edges, 2-D canvas only,
 * capped DPR, paused when hidden, coarser on narrow screens, static when
 * the user prefers reduced motion.
 */
(function () {
  'use strict';

  var canvas = document.getElementById('field');
  if (!canvas) return;
  var ctx = canvas.getContext('2d', { alpha: true });
  if (!ctx) return;

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var W = 0, H = 0, dpr = 1, spacing = 46, cols = 0, rows = 0, n = 0;
  var X, Y, PX, PY, OX, OY, PIN;          // node state (typed arrays)
  var EA, EB, EL, ne = 0;                 // edges: endpoints + rest length
  var inkRGB = '26,25,23', clayRGB = '217,119,87';

  var mouse = { x: -1e5, y: -1e5, vx: 0, vy: 0, down: false, active: false, lx: 0, ly: 0 };
  var running = !reduceMotion, raf = 0, last = 0, t = 0, needsStaticDraw = true;
  var lastInput = -1e9, virt = { x: 0, y: 0, px: 0, py: 0, on: false };   // autonomous load when idle / on touch screens

  // ---------- palette from CSS custom properties ----------
  function readPalette() {
    var cs = getComputedStyle(document.documentElement);
    var ink = cs.getPropertyValue('--field-ink').trim();
    var clay = cs.getPropertyValue('--field-clay').trim();
    if (ink) inkRGB = ink;
    if (clay) clayRGB = clay;
  }

  // ---------- lattice construction ----------
  function build() {
    W = window.innerWidth;
    H = window.innerHeight;
    dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    canvas.style.width = W + 'px';
    canvas.style.height = H + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    spacing = W < 768 ? 56 : (W < 1200 ? 48 : 46);
    cols = Math.ceil(W / spacing) + 3;
    rows = Math.ceil(H / spacing) + 3;
    n = cols * rows;

    X = new Float32Array(n); Y = new Float32Array(n);
    PX = new Float32Array(n); PY = new Float32Array(n);
    OX = new Float32Array(n); OY = new Float32Array(n);
    PIN = new Uint8Array(n);

    var ox0 = (W - (cols - 1) * spacing) / 2;
    var oy0 = (H - (rows - 1) * spacing) / 2;
    for (var r = 0; r < rows; r++) {
      for (var c = 0; c < cols; c++) {
        var i = r * cols + c;
        var x = ox0 + c * spacing, y = oy0 + r * spacing;
        X[i] = PX[i] = OX[i] = x;
        Y[i] = PY[i] = OY[i] = y;
        PIN[i] = (r === 0 || c === 0 || r === rows - 1 || c === cols - 1) ? 1 : 0;
      }
    }

    var maxE = (cols - 1) * rows + (rows - 1) * cols;
    EA = new Int32Array(maxE); EB = new Int32Array(maxE); EL = new Float32Array(maxE);
    ne = 0;
    for (r = 0; r < rows; r++) {
      for (c = 0; c < cols; c++) {
        i = r * cols + c;
        if (c < cols - 1) { EA[ne] = i; EB[ne] = i + 1; EL[ne] = spacing; ne++; }
        if (r < rows - 1) { EA[ne] = i; EB[ne] = i + cols; EL[ne] = spacing; ne++; }
      }
    }
    needsStaticDraw = true;
  }

  // ---------- physics ----------
  function step(dt) {
    t += dt;
    var damp = 0.90;            // velocity retained per frame
    var anchor = 0.030;         // pull toward rest position
    var R = mouse.down ? 320 : 210;
    var R2 = R * R;
    var strength = mouse.down ? 1.35 : 0.42;
    var ambient = 0.055;
    var act = mouse.active;
    var mx = mouse.x, my = mouse.y, mvx = mouse.vx, mvy = mouse.vy;

    // No pointer for a while (or a touch screen): a virtual point load wanders
    // along a Lissajous path so the lattice is never still.
    virt.on = (t - lastInput) > 4;
    if (virt.on) {
      virt.px = virt.x; virt.py = virt.y;
      virt.x = W * (0.5 + 0.40 * Math.sin(t * 0.21 + 0.4));
      virt.y = H * (0.5 + 0.38 * Math.sin(t * 0.146 + 1.9));
      mx = virt.x; my = virt.y;
      mvx = (virt.x - virt.px) * 0.6; mvy = (virt.y - virt.py) * 0.6;
      act = true; R = Math.min(250, W * 0.42); R2 = R * R; strength = W < 768 ? 0.55 : 0.75;
    }

    for (var i = 0; i < n; i++) {
      if (PIN[i]) continue;
      var x = X[i], y = Y[i];
      var vx = (x - PX[i]) * damp, vy = (y - PY[i]) * damp;
      PX[i] = x; PY[i] = y;

      var fx = (OX[i] - x) * anchor, fy = (OY[i] - y) * anchor;

      if (ambient) {
        // a slow travelling wave so the lattice is alive even when idle
        var ph = OX[i] * 0.011 + OY[i] * 0.007 - t * 0.85;
        fx += Math.cos(ph) * ambient;
        fy += Math.sin(ph * 0.73 + 1.3) * ambient;
      }

      if (act) {
        var dx = mx - x, dy = my - y, d2 = dx * dx + dy * dy;
        if (d2 < R2) {
          var d = Math.sqrt(d2) + 1e-3;
          var w = 1 - d / R; w *= w;                         // smooth falloff
          var m = strength * w * Math.min(d, 48) / 48;       // vanishes at the centre → no jitter
          fx += dx / d * m; fy += dy / d * m;
          fx += mvx * w * 0.06; fy += mvy * w * 0.06;        // wake from pointer motion
        }
      }

      X[i] = x + vx + fx;
      Y[i] = y + vy + fy;
    }

    // edge-length constraints (2 Gauss–Seidel sweeps)
    for (var it = 0; it < 2; it++) {
      for (var e = 0; e < ne; e++) {
        var a = EA[e], b = EB[e];
        var ex = X[b] - X[a], ey = Y[b] - Y[a];
        var len = Math.sqrt(ex * ex + ey * ey) + 1e-6;
        var diff = (len - EL[e]) / len * 0.5 * 0.9;          // 0.9 = constraint stiffness
        var cx = ex * diff, cy = ey * diff;
        var pa = PIN[a], pb = PIN[b];
        if (!pa && !pb) { X[a] += cx; Y[a] += cy; X[b] -= cx; Y[b] -= cy; }
        else if (!pa) { X[a] += 2 * cx; Y[a] += 2 * cy; }
        else if (!pb) { X[b] -= 2 * cx; Y[b] -= 2 * cy; }
      }
    }

    mouse.vx *= 0.82; mouse.vy *= 0.82;
  }

  // ---------- rendering ----------
  var BUCKETS = 7;
  var paths = [];
  for (var k = 0; k < BUCKETS; k++) paths.push(null);

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // edges, batched by strain bucket
    for (var k = 0; k < BUCKETS; k++) paths[k] = new Path2D();
    var inv = 1 / 0.30;                                     // strain that saturates the colour scale
    for (var e = 0; e < ne; e++) {
      var a = EA[e], b = EB[e];
      var ex = X[b] - X[a], ey = Y[b] - Y[a];
      var len = Math.sqrt(ex * ex + ey * ey);
      var s = Math.abs(len - EL[e]) / EL[e] * inv;
      if (s > 1) s = 1;
      var kb = (s * (BUCKETS - 1)) | 0;
      var p = paths[kb];
      p.moveTo(X[a], Y[a]);
      p.lineTo(X[b], Y[b]);
    }
    for (k = 0; k < BUCKETS; k++) {
      var f = k / (BUCKETS - 1);
      var alpha = 0.085 + f * 0.62;
      var rgb = f < 0.18 ? inkRGB : clayRGB;
      ctx.strokeStyle = 'rgba(' + rgb + ',' + alpha.toFixed(3) + ')';
      ctx.lineWidth = 0.8 + f * 0.9;
      ctx.stroke(paths[k]);
    }

    // nodes
    ctx.fillStyle = 'rgba(' + inkRGB + ',0.16)';
    for (var i = 0; i < n; i++) {
      if (PIN[i]) continue;
      ctx.fillRect(X[i] - 1, Y[i] - 1, 2, 2);
    }

    // a faint marker for the wandering virtual load
    if (virt.on) {
      ctx.strokeStyle = 'rgba(' + clayRGB + ',0.22)';
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.arc(virt.x, virt.y, 22 + Math.sin(t * 2) * 2, 0, Math.PI * 2); ctx.stroke();
      ctx.fillStyle = 'rgba(' + clayRGB + ',0.55)';
      ctx.beginPath(); ctx.arc(virt.x, virt.y, 2.2, 0, Math.PI * 2); ctx.fill();
    }

    // potential-well contours while pressing
    if (mouse.down && mouse.active) {
      ctx.strokeStyle = 'rgba(' + clayRGB + ',0.35)';
      ctx.lineWidth = 1;
      for (var r = 1; r <= 3; r++) {
        var rad = 28 * r + Math.sin(t * 3 + r) * 3;
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, rad, 0, Math.PI * 2);
        ctx.stroke();
      }
    }
  }

  // ---------- loop ----------
  function frame(ts) {
    if (!running) { raf = 0; return; }
    var dt = last ? Math.min((ts - last) / 1000, 0.05) : 1 / 60;
    last = ts;
    step(dt);
    draw();
    raf = requestAnimationFrame(frame);
  }
  function start() {
    if (raf || !running) return;
    last = 0;
    raf = requestAnimationFrame(frame);
  }
  function stop() {
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
  }

  // ---------- events ----------
  var resizeTimer = 0;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () { build(); if (!running) draw(); }, 120);
  });

  if (!reduceMotion) {
    window.addEventListener('pointermove', function (e) {
      if (mouse.active) {
        mouse.vx = mouse.vx * 0.5 + (e.clientX - mouse.lx) * 0.5;
        mouse.vy = mouse.vy * 0.5 + (e.clientY - mouse.ly) * 0.5;
      }
      mouse.lx = e.clientX; mouse.ly = e.clientY;
      mouse.x = e.clientX; mouse.y = e.clientY;
      mouse.active = true; lastInput = t;
    }, { passive: true });
    window.addEventListener('pointerdown', function (e) {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      mouse.down = true; mouse.x = e.clientX; mouse.y = e.clientY; mouse.active = true; lastInput = t;
    }, { passive: true });
    window.addEventListener('pointerup', function () { mouse.down = false; }, { passive: true });
    window.addEventListener('pointercancel', function () { mouse.down = false; }, { passive: true });
    document.addEventListener('pointerleave', function () { mouse.active = false; mouse.down = false; });
    window.addEventListener('blur', function () { mouse.active = false; mouse.down = false; });

    document.addEventListener('visibilitychange', function () {
      if (document.hidden) stop(); else start();
    });
  }

  // theme changes → re-read palette
  var mo = new MutationObserver(function () { readPalette(); if (!running) draw(); });
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  var mq = window.matchMedia('(prefers-color-scheme: dark)');
  if (mq.addEventListener) mq.addEventListener('change', function () { readPalette(); if (!running) draw(); });

  // public toggle for the footer button
  window.latticeField = {
    toggle: function () {
      running = !running;
      if (running) start(); else stop();
      return running;
    },
    isRunning: function () { return running; },
    bench: function (frames) {
      frames = frames || 120;
      var t0 = performance.now();
      for (var i = 0; i < frames; i++) { step(1 / 60); draw(); }
      return { msPerFrame: (performance.now() - t0) / frames, nodes: n, edges: ne, spacing: spacing };
    }
  };

  // ---------- go ----------
  readPalette();
  build();
  draw();
  if (running) start();
})();
