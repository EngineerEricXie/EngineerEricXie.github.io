---
permalink: /
title: ""
excerpt: ""
author_profile: true
redirect_from:
  - /about/
  - /about.html
---

<span class='anchor' id='about-me'></span>

I am **Tsung-Yeh Hsieh**, a Ph.D. student in **[Mechanical Engineering](https://www.meche.engineering.cmu.edu/) at [Carnegie Mellon University](https://www.cmu.edu/)**, working in the **[Computational Bio-Modeling Lab](https://www.meche.engineering.cmu.edu/faculty/zhang-computational-bio-modeling-lab.html)** advised by **[Prof. Jessica Zhang](https://www.andrew.cmu.edu/user/jessicaz/)**.

I build AI systems for physical and biological problems, with a focus on graph neural networks, Neural ODEs, transformers, physics-informed learning, AI agents, and GPU-accelerated simulation. Before joining CMU, I received my M.S. and B.S. degrees from **National Tsing Hua University**.

# 🤖 Current Research

1. **Machine Learning for Physical Systems** — Graph neural networks, Neural ODEs, transformers, PINNs, and surrogate models for learning complex dynamics.
2. **AI Agents for Scientific Computing** — Agents that automate simulation setup, execution, validation, analysis, and iteration.
3. **Scalable Scientific Computing** — GPU and parallel simulation tools that provide training data and physical foundations for AI-for-science systems.

# ⚡ Featured Engineering Project

## [GPU-Accelerated IGA for Flow and Transport](https://github.com/EngineerEricXie/TubularFlowIGA)

Built a validated C++/CUDA simulation pipeline for flow and transport in complex branching geometries. The system provides scalable, physics-grounded data generation for scientific machine learning and digital-twin applications.

**Impact:** reported benchmarks show **up to 16.6× faster computation**, **77.5% lower memory use**, and a **2.02× GPU speedup**.

[Repository](https://github.com/EngineerEricXie/TubularFlowIGA) · [Benchmark details](https://github.com/EngineerEricXie/TubularFlowIGA/blob/main/docs/BENCHMARKS.md)

# 🔥 News
- *2026.07*: &nbsp;Co-authored a bioRxiv preprint on predicting macroscopic axon topology from microscopic growth kinematics in cortical neurospheres.
- *2025.09*: &nbsp;Passed the Ph.D. qualifying exam at Carnegie Mellon University.
- *2025.07*: &nbsp;Presented autoencoder-based surrogate modeling work at the 18th U.S. National Congress on Computational Mechanics in Chicago and received a Travel Award.
- *2024.08*: &nbsp;Started Ph.D. study in Mechanical Engineering at Carnegie Mellon University.
- *2024.05*: &nbsp;Presented shock wave modeling work at the Engineering Mechanics Institute Conference and Probabilistic Mechanics & Reliability Conference in Chicago.
- *2023.10*: &nbsp;Received Third Place in the Student Paper Competition at the NCFD Conference, Taiwan.
- *2023.08*: &nbsp;Presented advection-dominated flow modeling work at the 28th National Computational Fluid Dynamics Conference in Taipei, Taiwan.
- *2023.07*: &nbsp;Presented numerically enhanced PINN work at the 17th U.S. National Congress on Computational Mechanics in Albuquerque, New Mexico.

# 📝 Publications

<div class='paper-box'><div class='paper-box-image'><div><div class="badge">bioRxiv 2026</div><img src='images/publications/axon-topology.png' alt="Experimental validation of simulated cortical neurosphere axon topology" width="100%"></div></div>
<div class='paper-box-text' markdown="1">

**Predicting Macroscopic Axon Topology from Microscopic Kinematics: An Interactive Tracking and Random Walk Pipeline for Substrate-Dependent Cortical Neurospheres**

C. Kim, M. Kim, H. Cao, **T.Y. Hsieh**, Y.J. Zhang, T. Cohen-Karni, V. Webster-Wood

*bioRxiv*, 2026

- Linked single-axon growth dynamics to network-scale topology; the generative model reproduced both microscopic behavior and macroscopic axonal density.
- [[Preprint]](https://www.biorxiv.org/content/10.64898/2026.07.30.741748v1) · [[DOI]](https://doi.org/10.64898/2026.07.30.741748)
</div>
</div>

<div class='paper-box'><div class='paper-box-image'><div><div class="badge">SIAM News 2026</div><img src='images/publications/siam-news.png' alt="Digital twins of neurons publication thumbnail" width="100%"></div></div>
<div class='paper-box-text' markdown="1">

**Decoding the Neural Enigma: Digital Twins of Neurons Revolutionize Brain Research**

**T.Y. Hsieh**, A. Aldirany, J. Zhang

*SIAM News*, 2026

- Discussed digital twins of neurons and their role in computational brain research.
- [[Article]](https://www.siam.org/publications/siam-news/articles/decoding-the-neural-enigma-digital-twins-of-neurons-revolutionize-brain-research/)
</div>
</div>

<div class='paper-box'><div class='paper-box-image'><div><div class="badge">CMAME 2025</div><img src='images/publications/galds.png' alt="GALDS graph-autoencoder surrogate model thumbnail" width="100%"></div></div>
<div class='paper-box-text' markdown="1">

**GALDS: A Graph-Autoencoder-Based Latent Dynamics Surrogate Model to Predict Neurite Material Transport**

**T.Y. Hsieh**, Y.J. Zhang

*Computer Methods in Applied Mechanics and Engineering*, 2025

- Achieved approximately **3% mean relative error** and **<8% maximum relative error** on unseen geometries and abnormal transport cases.
- Delivered **10× faster inference** with **20× less training data**, **10× fewer trainable parameters**, and **6× faster training** than the prior surrogate approach.
- [[Paper]](https://doi.org/10.1016/j.cma.2025.118409)
</div>
</div>

<div class='paper-box'><div class='paper-box-image'><div><div class="badge">Engineering with Computers 2024</div><img src='images/publications/pinn-wbc.png' alt="PINN weak boundary conditions publication thumbnail" width="100%"></div></div>
<div class='paper-box-text' markdown="1">

**A Multiscale Stabilized Physics-Informed Neural Networks with Weakly Imposed Boundary Conditions Transfer Learning Method for Modeling Advection-Dominated Flow**

**T.Y. Hsieh**, T.H. Huang

*Engineering with Computers*, 2024

- Developed a stabilized PINN formulation for advection-dominated flow problems with weak boundary-condition enforcement and transfer learning.
- [[Paper]](https://link.springer.com/article/10.1007/s00366-024-01981-5)
</div>
</div>

<div class='paper-box'><div class='paper-box-image'><div><div class="badge">JMRT 2024</div><img src='images/publications/nn-fem.png' alt="Neural-network-enhanced FEM TPMS publication thumbnail" width="100%"></div></div>
<div class='paper-box-text' markdown="1">

**An Efficient Parameterized Neural Network Enhanced Multiscale Finite Element Modeling for Triply Periodic Minimal Surface Meta-Structures and its Applications for Femur**

Y.Z. Chen, C.H. Wang, **T.Y. Hsieh**, C.C. Tung, P.Y. Chen, T.H. Huang

*Journal of Materials Research and Technology*, 2024

- Contributed to neural-network-enhanced multiscale finite element modeling for TPMS meta-structures and biomedical applications.
- [[Paper]](https://www.sciencedirect.com/science/article/pii/S2238785424010639)
</div>
</div>

Full and automatically updated publication metrics are available on [Google Scholar](https://scholar.google.com.tw/citations?user=Wu0GDnwAAAAJ&hl=zh-TW).

## Conference Papers and Presentations
- **A Multi-Dimensional Framework for Efficient Material Transport Simulation in Complex Neurite Network Using Autoencoder-Based Surrogate Models**, **T.Y. Hsieh**, Y.J. Zhang. 18th U.S. National Congress on Computational Mechanics, Chicago, Illinois, Jul. 2025.
- **A Space-Time Modularized Neural Network Approach for Shock Wave Modeling**, **T.Y. Hsieh**, Y.M. Tsai, T.H. Huang. Oral presentation, Engineering Mechanics Institute Conference and Probabilistic Mechanics & Reliability Conference, Chicago, Illinois, May 2024.
- **Shock Wave Modeling with Enhanced Physics-Informed Neural Networks**, **T.Y. Hsieh**, Y.M. Tsai, T.H. Huang. Oral presentation, Conference on Theoretical and Applied Mechanics, Yunlin, Taiwan, Nov. 2023.
- **An Enhanced Physics Informed Neural Networks for Shock Wave Modeling**, **T.Y. Hsieh**, Y.M. Tsai, T.H. Huang. Oral presentation, Association of Computational Mechanics Taiwan Annual Meeting, Keelung, Taiwan, Oct. 2023.
- **Application of Artificial Neural Network Formulation for Advection Dominated Fluid Flow Problems**, **T.Y. Hsieh**, T.H. Huang, Y.M. Tsai. Presented by Y.M. Tsai on behalf of T.Y. Hsieh, 28th National Computational Fluid Dynamics Conference, Taipei, Taiwan, Aug. 2023.
- **Numerically Enhanced Physics Informed Neural Network for Fluid Flow Problems**, **T.Y. Hsieh**, T.H. Huang. Presented by T.H. Huang on behalf of T.Y. Hsieh, 17th U.S. National Congress on Computational Mechanics, Albuquerque, New Mexico, Jul. 2023.
- **Artificial Neural Network Methods for Advection Diffusion Problems**, **T.Y. Hsieh**, T.H. Huang. Oral presentation, Conference on Theoretical and Applied Mechanics, Kaohsiung, Taiwan, Nov. 2022.
- **A Neural Network Enhanced Finite Element Method for TPMS Based Mechanical Metamaterials Simulation**, Y.Z. Chen, **T.Y. Hsieh**, T.H. Huang, C.C. Tung, P.Y. Chen. Oral presentation, WCCM/APCOM, Yokohama, Japan, Jul.-Aug. 2022.
- **Deep Energy Method: A Neural Network Based Meshfree Solver for Hyperelastic Material**, **T.Y. Hsieh**, T.H. Huang. Oral presentation, Conference on Theoretical and Applied Mechanics, virtual format, Nov. 2021.

# 🎖 Honors and Awards
- *2025.07*: Travel Award, 18th U.S. National Congress on Computational Mechanics, Chicago, Illinois.
- *2023.10*: Third Place Award, Student Paper Competition, NCFD Conference, Taiwan.
- *2022.12*: Top Quarter Award, AI Cup Competition, Ministry of Education, Taiwan.
- *2022.12*: Honorable Mention Award, Student Poster Competition, TSFD Conference, Taiwan.
- *2020.12*: Honorable Mention Award, Capstone Project Competition, PME Department, NTHU, Taiwan.
- *2019.08*: 9th Place Award, Formula SAE Japan, SAE International, as a team award.

# 📖 Education
- *2024 - Present*: Ph.D. in Mechanical Engineering, Carnegie Mellon University. Computational Bio-Modeling Lab, advisor: Prof. Jessica Zhang.
- *2021 - 2023*: M.S. in Power Mechanical Engineering, National Tsing Hua University. GPA: 4.08/4.3. Advisor: Prof. Tsung-Hui (Alex) Huang.
- *2017 - 2021*: B.S. in Power Mechanical Engineering, National Tsing Hua University. Electrical and Control Division, advisor: Prof. J. Andrew Yeh.

# 🔬 Selected Projects
- **Scientific ML for Physical Systems**: Built graph neural networks, Neural ODEs, transformers, PINNs, and reduced-order models for PDEs and biological transport.
- **AI Agents for Simulation**: Developing agentic workflows for simulation setup, execution, validation, analysis, and iteration.
- **Biological Imaging and Neural Dynamics**: Developed neuron image segmentation and tracking methods and transformer-based models for biological time series.
- **AI for Materials and Structures**: Developed neural constitutive models, anomaly-detection methods, and multiscale surrogate models for structural and material systems.

# 💻 Experience and Skills
- *2017 - 2024*: Research Assistant, National Tsing Hua University. Managed and participated in interdisciplinary research projects and helped maintain Linux and Windows research servers.
- *2022*: Teaching Assistant, Mechanics of Materials. Served as TA team leader; student rating: 4.9/5.0.
- *2020 Season*: Head of Power Mechanical Group, NTHU Racing Team. Led electric race car reducer, timing system, and high-voltage charger projects.
- **AI and Scientific Computing**: Python, PyTorch, JAX, graph neural networks, Neural ODEs, transformers, PINNs, C/C++, CUDA, MPI/PETSc, FEniCS, Docker, Git, and ParaView.
