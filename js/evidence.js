(() => {
  "use strict";

  const root = document.documentElement;
  const byId = (id) => document.getElementById(id);
  const setText = (id, value) => {
    const node = byId(id);
    if (node) node.textContent = value;
  };
  const setClaim = (id, claimId, label) => {
    const node = byId(id);
    if (!node) return;
    node.dataset.claimId = claimId;
    node.href = window.ProphetSources?.isReady() ? `#claim-${claimId}` : "#source-register";
    if (label) node.textContent = label;
  };
  const setChip = (id, label, className) => {
    const node = byId(id);
    if (!node) return;
    node.textContent = label;
    node.className = `state-chip ${className}`;
  };

  function wireTabs(selector, keyAttribute, activate) {
    const buttons = [...document.querySelectorAll(selector)];
    if (!buttons.length) return;

    const select = (button, focus = false) => {
      buttons.forEach((item) => {
        const selected = item === button;
        item.setAttribute("aria-selected", String(selected));
        item.tabIndex = selected ? 0 : -1;
      });
      activate(button.dataset[keyAttribute], button);
      if (focus) button.focus();
    };

    buttons.forEach((button, index) => {
      button.addEventListener("click", () => select(button));
      button.addEventListener("keydown", (event) => {
        if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
        event.preventDefault();
        let next = index;
        if (event.key === "ArrowLeft") next = (index - 1 + buttons.length) % buttons.length;
        if (event.key === "ArrowRight") next = (index + 1) % buttons.length;
        if (event.key === "Home") next = 0;
        if (event.key === "End") next = buttons.length - 1;
        select(buttons[next], true);
      });
    });
    select(buttons.find((button) => button.getAttribute("aria-selected") === "true") || buttons[0]);
  }

  const pathways = {
    inhale: {
      state: "OBSERVED · SELECTED TISSUE",
      stateClass: "observed",
      title: "Air → sampled lung tissue",
      copy: "A μFTIR study, using particle-resolved infrared spectroscopy, reported 39 particles in 11 of 13 surgical lung samples and published blank-adjusted results.",
      limit: "This supports an inhalation route and does not establish disease or population prevalence.",
      claim: "P01-CLAIM-001",
      source: "AIR",
      route: "INHALE",
      matrix: "LUNG",
      stage: "DETECTION",
      reached: 3,
      passportRoute: "Inhalation under review",
      passportMatrix: "Sampled lung tissue",
      passportMethod: "μFTIR · ≥3 μm",
      equivalent: "Claim P01-CLAIM-001. The inhalation view reaches sampled lung tissue and a reported detection. The diagram carries no dose, prevalence or disease estimate."
    },
    ingest: {
      state: "ROUTE UNDER REVIEW",
      stateClass: "contested",
      title: "Food or water → route unresolved",
      copy: "Human-matrix detections do not identify an individual particle's exposure route. Ingestion remains a route hypothesis unless a study design resolves it.",
      limit: "A plausible route does not establish the route for a reported human-matrix detection.",
      claim: "P01-CLAIM-023",
      source: "FOOD / WATER",
      route: "INGEST?",
      matrix: "HUMAN MATRIX",
      stage: "ROUTE?",
      reached: 1,
      passportRoute: "Ingestion hypothesis",
      passportMatrix: "Matrix must be named",
      passportMethod: "Workflow must be named",
      equivalent: "Claim P01-CLAIM-023. The ingestion view ends at a route hypothesis. It does not connect a category-level exposure route to a specific human detection."
    },
    circulate: {
      state: "OBSERVED · SELECTED COHORT",
      stateClass: "observed",
      title: "Circulation → sampled carotid plaque",
      copy: "Polyethylene and PVC were reported in excised plaques from a selected carotid-surgery cohort.",
      limit: "The sample is a plaque matrix from a selected cohort. The observation does not resolve original exposure route or causality.",
      claim: "P01-CLAIM-002",
      source: "BLOOD-FACING",
      route: "CIRCULATE",
      matrix: "PLAQUE",
      stage: "DETECTION",
      reached: 3,
      passportRoute: "Circulation before sampling",
      passportMatrix: "Excised carotid plaque",
      passportMethod: "Complementary methods",
      equivalent: "Claim P01-CLAIM-002. The circulation view reaches an excised carotid-plaque matrix and reported detection in a selected surgery cohort. Original exposure route and causality remain unresolved."
    }
  };

  function updatePathway(key, button) {
    const data = pathways[key] || pathways.inhale;
    const visual = document.querySelector(".particle-passport");
    if (visual) visual.dataset.route = key;
    setChip("path-state", data.state, data.stateClass);
    setText("path-title", data.title);
    setText("path-copy", data.copy);
    setText("path-limit", data.limit);
    setClaim("path-claim", data.claim, `Open ${data.claim}`);
    setText("passport-route-value", data.passportRoute);
    setText("passport-matrix-value", data.passportMatrix);
    setText("passport-method-value", data.passportMethod);
    setText("route-source-label", data.source);
    setText("route-route-label", data.route);
    setText("route-matrix-label", data.matrix);
    setText("route-stage-label", data.stage);
    setText("path-visual-equivalent", data.equivalent);

    ["route-source-label", "route-route-label", "route-matrix-label", "route-stage-label"].forEach((id, index) => {
      const node = byId(id);
      if (!node) return;
      node.classList.toggle("active", index < data.reached);
      node.classList.toggle("boundary", index === data.reached);
    });
    const panel = byId("pathway-panel");
    if (panel && button) panel.setAttribute("aria-labelledby", button.id);
  }

  wireTabs("[data-path]", "path", updatePathway);

  const passportVisual = document.querySelector(".particle-passport");
  const passportSteps = [...document.querySelectorAll(".passport-step")];
  const staticPassportQuery = window.matchMedia("(max-width: 1020px), (max-height: 720px), (prefers-reduced-motion: reduce)");
  let passportFrame = 0;
  const visiblePassportSteps = new Set();

  function setPassportStep(key) {
    if (!passportVisual) return;
    passportVisual.dataset.passportStep = key;
    passportSteps.forEach((step) => {
      const current = key !== "all" && step.dataset.passportStep === key;
      step.classList.toggle("is-current", current || key === "all");
      if (current) step.setAttribute("aria-current", "step");
      else step.removeAttribute("aria-current");
    });
  }

  function choosePassportStep() {
    passportFrame = 0;
    if (staticPassportQuery.matches) {
      setPassportStep("all");
      return;
    }
    const activation = window.innerHeight * 0.48;
    const candidates = visiblePassportSteps.size ? [...visiblePassportSteps] : passportSteps;
    let best = candidates[0];
    let distance = Infinity;
    candidates.forEach((step) => {
      const rect = step.getBoundingClientRect();
      const center = rect.top + rect.height / 2;
      const nextDistance = Math.abs(center - activation);
      if (nextDistance < distance) {
        best = step;
        distance = nextDistance;
      }
    });
    if (best) setPassportStep(best.dataset.passportStep);
  }

  function schedulePassportStep() {
    if (!passportFrame) passportFrame = requestAnimationFrame(choosePassportStep);
  }

  if (passportSteps.length && "IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) visiblePassportSteps.add(entry.target);
        else visiblePassportSteps.delete(entry.target);
      });
      schedulePassportStep();
    }, { rootMargin: "-22% 0px -22% 0px", threshold: [0, 0.2, 0.55, 1] });
    passportSteps.forEach((step) => observer.observe(step));
  }
  window.addEventListener("scroll", schedulePassportStep, { passive: true });
  window.addEventListener("resize", schedulePassportStep, { passive: true });
  staticPassportQuery.addEventListener?.("change", schedulePassportStep);
  schedulePassportStep();

  const staticPresentationQuery = window.matchMedia("(max-width: 1020px), (max-height: 720px), (prefers-reduced-motion: reduce)");
  function applyStaticPresentation() {
    if (!staticPresentationQuery.matches) return;
    document.querySelectorAll(".static-risk-register details,.static-position-register details").forEach((detail) => { detail.open = true; });
  }
  staticPresentationQuery.addEventListener?.("change", applyStaticPresentation);
  applyStaticPresentation();

  const methods = {
    ftir: {
      kind: "instrument",
      kicker: "PARTICLE-RESOLVED SPECTROSCOPY",
      output: "IDENTITY · COUNT · SIZE · SHAPE",
      title: "μFTIR (particle-resolved infrared spectroscopy) resolves individual particles within a method-dependent window.",
      copy: "It can identify polymer spectra and retain morphology. Substrate, preparation, scan strategy and the lower size threshold shape the report.",
      retains: "Particle-level identity and morphology",
      limits: "Very small particles and complex-matrix recovery remain workflow dependent",
      control: "Blanks, recovery, spectral library and declared size window",
      claim: "P01-CLAIM-006",
      caption: "μFTIR profile · capability map",
      input: "PREPARED SAMPLE",
      mode: "PARTICLE-RESOLVED",
      name: "μFTIR",
      lanes: { count:["is-on","RETAINED"], morphology:["is-on","RETAINED"], identity:["is-on","RETAINED"], mass:["is-off","DIFFERENT OUTPUT"], comparability:["is-conditional","QA DEPENDENT"] },
      qa: "Reference materials, blanks, recovery and proficiency sit across the analytical workflow.",
      equivalent: "Claim P01-CLAIM-006. μFTIR can retain particle count, morphology and polymer identity within a declared workflow window. Polymer mass is a different measurand. Comparability depends on the quality system."
    },
    raman: {
      kind: "instrument",
      kicker: "PARTICLE-RESOLVED SPECTROSCOPY",
      output: "IDENTITY · COUNT · SIZE · SHAPE",
      title: "Raman resolves spectra at particle scale within its workflow limits.",
      copy: "It can retain count and morphology while fluorescence, throughput, preparation and recovery constrain the result.",
      retains: "Particle-level spectra, count and morphology",
      limits: "Fluorescence, throughput and complex-matrix recovery",
      control: "Blanks, recovery, spectral confirmation and declared size window",
      claim: "P01-CLAIM-006",
      caption: "Raman profile · capability map",
      input: "PREPARED SAMPLE",
      mode: "PARTICLE-RESOLVED",
      name: "RAMAN",
      lanes: { count:["is-on","RETAINED"], morphology:["is-on","RETAINED"], identity:["is-on","RETAINED"], mass:["is-off","DIFFERENT OUTPUT"], comparability:["is-conditional","QA DEPENDENT"] },
      qa: "A declared spectral library, blank protocol, recovery and proficiency context remain part of the result.",
      equivalent: "Claim P01-CLAIM-006. Raman can retain count, morphology and polymer spectra within a declared workflow window. Fluorescence and recovery can constrain the report. Polymer mass is a different measurand."
    },
    pyro: {
      kind: "instrument",
      kicker: "DESTRUCTIVE MASS ANALYSIS",
      output: "POLYMER IDENTITY · POLYMER MASS",
      title: "Py-GC/MS (destructive polymer-mass analysis) reports polymer-specific mass after the sample is destroyed.",
      copy: "The workflow can identify and quantify polymer mass. Destructive analysis discards particle count, size and morphology.",
      retains: "Polymer identity and polymer-specific mass",
      limits: "Particle count, size and morphology are lost in destructive analysis",
      control: "Calibration, recovery, contamination control and matrix-specific validation",
      claim: "P01-CLAIM-006",
      caption: "Py-GC/MS profile · capability map",
      input: "PREPARED ALIQUOT",
      mode: "MASS-RESOLVED",
      name: "PY-GC/MS",
      lanes: { count:["is-off","NOT RETAINED"], morphology:["is-off","NOT RETAINED"], identity:["is-on","RETAINED"], mass:["is-on","RETAINED"], comparability:["is-conditional","QA DEPENDENT"] },
      qa: "Calibration, recovery and matrix-specific controls define whether mass results can be compared.",
      equivalent: "Claim P01-CLAIM-006. Py-GC/MS reports polymer identity and polymer-specific mass after destructive analysis. It does not retain particle count or morphology. Comparability remains workflow dependent."
    },
    reference: {
      kind: "qa",
      kicker: "QUALITY-SYSTEM LAYER",
      output: "CONTROLS · RECOVERY · PROFICIENCY",
      title: "Reference materials and QA connect methods without becoming a method.",
      copy: "They support calibration, recovery checks and interlaboratory proficiency across declared matrices and measurands.",
      retains: "A traceable control and performance context",
      limits: "A reference material does not select the measurand or validate every matrix",
      control: "Commutability, stability, homogeneity and fit to the target workflow",
      claim: "P01-CLAIM-009",
      caption: "Reference + QA · cross-workflow layer",
      input: "METHOD + CONTROL MATERIAL",
      mode: "QUALITY SYSTEM",
      name: "REFERENCE + QA",
      lanes: { count:["is-na","NOT AN OUTPUT"], morphology:["is-na","NOT AN OUTPUT"], identity:["is-na","NOT AN OUTPUT"], mass:["is-na","NOT AN OUTPUT"], comparability:["is-on","SYSTEM PURPOSE"] },
      qa: "This cross-workflow QA layer performs no analytical measurement and carries no method ranking.",
      equivalent: "Claim P01-CLAIM-009. Reference materials and QA are a cross-workflow quality layer for controls, recovery and proficiency. The layer performs no analytical measurement and carries no method ranking."
    }
  };

  function updateMethod(key, button) {
    const data = methods[key] || methods.ftir;
    const prism = document.querySelector(".method-prism");
    if (prism) {
      prism.dataset.methodState = key;
      prism.dataset.methodKind = data.kind;
    }
    setText("method-kicker", data.kicker);
    setText("method-output", data.output);
    setText("method-title", data.title);
    setText("method-copy", data.copy);
    setText("method-retains", data.retains);
    setText("method-limits", data.limits);
    setText("method-control", data.control);
    setText("method-visual-caption", data.caption);
    setText("method-input-label", data.input);
    setText("method-graphic-mode", data.mode);
    setText("method-graphic-name", data.name);
    setText("qa-layer", data.qa);
    setText("method-graphic-equivalent", data.equivalent);
    setClaim("method-claim", data.claim, `Open ${data.claim}`);

    Object.entries(data.lanes).forEach(([lane, values]) => {
      const node = document.querySelector(`[data-lane="${lane}"]`);
      if (!node) return;
      node.className = values[0];
      setText(`lane-${lane}-state`, values[1]);
    });
    const panel = byId("method-panel");
    if (panel && button) panel.setAttribute("aria-labelledby", button.id);
  }

  wireTabs("[data-method]", "method", updateMethod);

  const threads = {
    lung: {
      state:"OBSERVED", stateClass:"observed", stop:"STOPS AT RUNG 01 / DETECTION", title:"Selected lung tissue",
      copy:"Particles were reported with a stated size limit and blank controls.", limit:"Disease, population prevalence and dose-response remain unestablished.", claim:"P01-CLAIM-001", rung:1,
      design:"13 surgical tissue samples · μFTIR · blank controls", visualLimit:"Selected small series; disease and prevalence remain unresolved.",
      equivalent:"Claim P01-CLAIM-001. The lung thread stops at reported detection in a 13-sample μFTIR study. Disease, prevalence and dose-response remain unestablished."
    },
    plaque: {
      state:"ASSOCIATION", stateClass:"contested", stop:"STOPS AT RUNG 02 / HUMAN ASSOCIATION", title:"Selected carotid-surgery cohort",
      copy:"Plaque detection was associated with a higher composite event rate in a prospective observational cohort.", limit:"Selection, residual confounding and observational design prevent a causal conclusion.", claim:"P01-CLAIM-003", rung:2,
      design:"257 carotid-surgery patients · prospective observational follow-up", visualLimit:"Association in a selected cohort; causal inference remains unresolved.",
      equivalent:"Claim P01-CLAIM-003. The carotid-plaque thread reaches human association in a selected observational cohort. It stops before causal inference."
    },
    brain: {
      state:"OBSERVED", stateClass:"observed", stop:"STOPS AT RUNG 01 / DETECTION", title:"Postmortem brain tissue",
      copy:"A postmortem study reported micro- and nanoplastic signals with complementary analytical methods.", limit:"The result does not establish living burden, exposure route or dementia causality.", claim:"P01-CLAIM-004", rung:1,
      design:"Postmortem tissues · complementary analytical methods", visualLimit:"Method-sensitive postmortem result; living burden remains unresolved.",
      equivalent:"Claim P01-CLAIM-004. The postmortem brain thread stops at reported detection using complementary methods. Living burden and dementia causality remain unestablished."
    },
    tpe: {
      state:"DEVELOPING SIGNAL", stateClass:"contested", stop:"ASSAY SIGNAL / NO VALIDATED REVERSAL", title:"Plasma-exchange assay signal",
      copy:"An uncontrolled study reported lower post-procedure circulating counts in higher-baseline groups while the largest low-baseline group increased.", limit:"The assay signal does not establish total-body clearance, durability or patient benefit.", claim:"P01-CLAIM-019", rung:1,
      design:"Uncontrolled pre/post procedure · proprietary circulating-particle assay", visualLimit:"Baseline-dependent assay signal; no validated body-burden reversal.",
      equivalent:"Claim P01-CLAIM-019. The plasma-exchange thread carries a developing, baseline-dependent circulating assay signal. It does not reach validated total-body reversal or patient benefit."
    }
  };

  function updateThread(key, button) {
    const data = threads[key] || threads.lung;
    const visual = document.querySelector(".evidence-ladder-visual");
    if (visual) visual.dataset.threadState = key;
    setChip("thread-state", data.state, data.stateClass);
    setText("thread-stop", data.stop);
    setText("thread-title", data.title);
    setText("thread-copy", data.copy);
    setText("thread-limit", data.limit);
    setText("thread-design", data.design);
    setText("thread-visual-limit", data.visualLimit);
    setText("thread-visual-equivalent", data.equivalent);
    setClaim("thread-claim", data.claim, "Open evidence and study limits");

    document.querySelectorAll("#evidence-ladder-list [data-rung]").forEach((item) => {
      const rung = Number(item.dataset.rung);
      item.classList.toggle("reached", rung <= data.rung);
      item.classList.toggle("current", rung === data.rung);
      const status = item.querySelector(":scope > i");
      if (status) status.textContent = rung === data.rung ? "STOPS HERE" : rung < data.rung ? "SUPPORTED" : "UNFILLED";
    });
    const panel = byId("thread-panel");
    if (panel && button) panel.setAttribute("aria-labelledby", button.id);
  }

  wireTabs("[data-thread]", "thread", updateThread);

  const riskRows = ["Size", "Shape", "Polymer", "Surface / additives", "Route", "Tissue / compartment", "Persistence / clearance", "Host vulnerability"];
  const riskViews = {
    evidence: {
      heads:["IDENTITY","DOSE","FATE","OUTCOME"],
      classes:[
        ["partial","unknown","partial","unknown"], ["partial","unknown","unknown","unknown"],
        ["known","partial","unknown","partial"], ["unknown","unknown","unknown","unknown"],
        ["partial","unknown","partial","partial"], ["known","partial","partial","partial"],
        ["unknown","unknown","unknown","unknown"], ["partial","unknown","unknown","partial"]
      ],
      labels:{ known:"Reported", partial:"Partial", unknown:"Unknown" },
      legend:["Reported","Partial / method-sensitive","Unknown for decision"],
      state:"CONTESTED CATEGORY", stateClass:"contested", title:"Which coordinates were actually measured?",
      copy:"Cells show whether the public evidence reports a dimension clearly, partially or leaves it open. Color and pattern carry no estimate of biological danger.",
      claim:"P01-CLAIM-005", visualTitle:"PROPERTY × EVIDENCE MATRIX", caption:"Availability · no risk magnitude encoded",
      equivalent:"Claim P01-CLAIM-005. The evidence view marks two reported, thirteen partial and seventeen unknown coordinates across identity, dose, fate and outcome. The matrix carries no biological-risk estimate."
    },
    diligence: {
      heads:["MEASURAND","VALIDATION","BUYER","TRIGGER"],
      classes:[
        ["partial","partial","unknown","partial"], ["partial","unknown","unknown","unknown"],
        ["known","partial","partial","partial"], ["unknown","unknown","partial","partial"],
        ["partial","unknown","partial","partial"], ["known","partial","partial","unknown"],
        ["unknown","unknown","unknown","unknown"], ["partial","unknown","partial","unknown"]
      ],
      labels:{ known:"Defined", partial:"Needs proof", unknown:"Open" },
      legend:["Defined in reviewed set","Needs decision-specific proof","Open diligence question"],
      state:"DILIGENCE MAP", stateClass:"observed", title:"Which coordinates can support a purchase decision?",
      copy:"Cells recast the same dimensions as Delphi diligence questions. They indicate definition and proof status, not market attractiveness or company quality.",
      claim:"P01-CLAIM-028", visualTitle:"PROPERTY × DILIGENCE MATRIX", caption:"Decision readiness · no company score encoded",
      equivalent:"Claim P01-CLAIM-028. The diligence view maps each dimension against measurand, validation, buyer and trigger. Defined, needs-proof and open states carry no company score or market forecast."
    }
  };

  function updateRisk(key, button) {
    const data = riskViews[key] || riskViews.evidence;
    const visual = document.querySelector(".risk-matrix-visual");
    if (visual) visual.dataset.riskState = key;
    setText("matrix-title", data.visualTitle);
    setText("matrix-caption", data.caption);
    setText("risk-legend-known", data.legend[0]);
    setText("risk-legend-partial", data.legend[1]);
    setText("risk-legend-unknown", data.legend[2]);
    setChip("risk-state", data.state, data.stateClass);
    setText("risk-view-title", data.title);
    setText("risk-view-copy", data.copy);
    setText("matrix-description", data.equivalent);
    setClaim("risk-claim", data.claim, key === "evidence" ? "Open the unresolved interpretation" : "Open the counter-thesis");

    const heads = [...document.querySelectorAll("#matrix-grid .matrix-head")];
    const cells = [...document.querySelectorAll("#matrix-grid > i")];
    const table = byId("matrix-data-table");
    heads.forEach((head, index) => { head.textContent = data.heads[index]; });
    cells.forEach((cell, index) => {
      const row = Math.floor(index / 4);
      const column = index % 4;
      const state = data.classes[row][column];
      cell.className = state;
      cell.setAttribute("aria-label", `${riskRows[row]}, ${data.heads[column]}: ${data.labels[state]}`);
    });
    if (table) {
      [...table.tHead.rows[0].cells].slice(1).forEach((cell, index) => { cell.textContent = data.heads[index]; });
      [...table.tBodies[0].rows].forEach((row, rowIndex) => {
        [...row.cells].slice(1).forEach((cell, columnIndex) => {
          cell.textContent = data.labels[data.classes[rowIndex][columnIndex]];
        });
      });
      setText("matrix-table-caption", `${key === "evidence" ? "Evidence" : "Diligence"}-view text equivalent`);
    }
    const grid = byId("matrix-grid");
    if (grid) grid.setAttribute("aria-label", data.equivalent);
    const panel = byId("risk-panel");
    if (panel && button) panel.setAttribute("aria-labelledby", button.id);
  }

  wireTabs("[data-risk-view]", "riskView", updateRisk);

  const positions = {
    conviction: {
      mode:"CURRENT CONVICTION · 16 JUL 2026", title:"Infrastructure before interpretation.", claim:"P01-CLAIM-024", orbit:"CURRENT POSITION", emphasis:["lead","build","select","watch"],
      items:[
        ["Lead","Reference, QA and reproducible matrix-specific measurement.","P01-CLAIM-024"],
        ["Build","Source control and substitution where a defined buyer can verify full-system economics.","P01-CLAIM-025"],
        ["Select","Clinical interpretation after analytical validity and actionability.","P01-CLAIM-026"],
        ["Watch","Removal until relevant burden, safe clearance and benefit converge.","P01-CLAIM-027"]
      ],
      equivalent:"Claims P01-CLAIM-024 through P01-CLAIM-027. The current position leads measurement, builds defined prevention and replacement, selects decision-linked interpretation, and watches removal."
    },
    questions: {
      mode:"OPEN QUESTIONS · OWNER REQUIRED", title:"Name the decision before the dataset.", claim:"P01-CLAIM-026", orbit:"OPEN QUESTIONS", emphasis:["select"],
      items:[
        ["Measure","Which matrix, measurand and decision must reproduce?","P01-CLAIM-024"],
        ["Prevent","Who owns the full-system cost, capture and waste denominator?","P01-CLAIM-025"],
        ["Clinical","Which validated reference range changes care or outcome?","P01-CLAIM-026"],
        ["Remove","How do blood signal, tissue burden, durable clearance and benefit relate?","P01-CLAIM-027"]
      ],
      equivalent:"Claims P01-CLAIM-024 through P01-CLAIM-027. The open-question view emphasizes clinical selection while listing unresolved measurand, prevention, actionability and removal questions."
    },
    falsifiers: {
      mode:"FALSIFIERS · REVIEW BEFORE CONVICTION", title:"Write down what would make us wrong.", claim:"P01-CLAIM-028", orbit:"FALSIFIERS", emphasis:["lead","build","select","watch"],
      items:[
        ["Measure","Independent sites fail to reproduce the target-matrix result.","P01-CLAIM-024"],
        ["Market","Buyers fund one-off compliance work without repeat economics.","P01-CLAIM-028"],
        ["Platform","Particle, route and matrix fragmentation prevents workflow reuse.","P01-CLAIM-028"],
        ["Clinical","A valid result fails to change a useful decision or outcome.","P01-CLAIM-026"]
      ],
      equivalent:"Claim P01-CLAIM-028. The falsifier view marks every posture as reviewable and lists reproducibility, repeat economics, fragmentation and clinical actionability failure cases."
    },
    milestones: {
      mode:"MILESTONES · EVIDENCE CAN MOVE POSTURE", title:"Advance only on a named gate.", claim:"P01-CLAIM-027", orbit:"MILESTONES", emphasis:["build","watch"],
      items:[
        ["Measure","Independent multi-site validation in the target matrix.","P01-CLAIM-024"],
        ["Prevent","Audited field performance and full-system economics.","P01-CLAIM-025"],
        ["Clinical","Prospective evidence that changes a useful decision.","P01-CLAIM-026"],
        ["Remove","Controlled evidence of safe, durable clearance and patient benefit.","P01-CLAIM-027"]
      ],
      equivalent:"Claims P01-CLAIM-024 through P01-CLAIM-027. The milestone view emphasizes build and watch postures and names the evidence required to move each one."
    },
    sourcing: {
      mode:"SOURCING · CURRENT PRIORITY ORDER", title:"Start where proof and buyer can meet.", claim:"P01-CLAIM-024", orbit:"SOURCING", emphasis:["lead","build"],
      items:[
        ["Lead","Reference materials and transferable QA workflows.","P01-CLAIM-024"],
        ["Build","Defined source-control systems with auditable operating value.","P01-CLAIM-025"],
        ["Select","Decision-linked interpretation and application-specific materials.","P01-CLAIM-026"],
        ["Watch","Biomedical removal until the full evidence chain closes.","P01-CLAIM-027"]
      ],
      equivalent:"Claims P01-CLAIM-024 through P01-CLAIM-027. The sourcing view emphasizes lead and build, followed by selective interpretation and a watch posture for removal."
    }
  };

  function updatePosition(key, button) {
    const data = positions[key] || positions.conviction;
    const orbit = byId("posture-orbit");
    if (orbit) {
      orbit.dataset.positionState = key;
      orbit.setAttribute("aria-label", data.equivalent);
    }
    setText("position-mode", data.mode);
    setText("position-view-title", data.title);
    setText("position-orbit-mode", data.orbit);
    setText("position-visual-equivalent", data.equivalent);
    setClaim("position-claim", data.claim, "View-level evidence basis");
    document.querySelectorAll("[data-posture-node]").forEach((node) => {
      node.classList.toggle("active", data.emphasis.includes(node.dataset.postureNode));
    });
    const list = byId("position-list");
    if (list) {
      list.replaceChildren(...data.items.map(([label, copy, claim]) => {
        const item = document.createElement("li");
        const strong = document.createElement("strong");
        const span = document.createElement("span");
        const link = document.createElement("a");
        strong.textContent = label;
        span.textContent = copy;
        link.textContent = claim;
        link.href = "#source-register";
        link.dataset.claimId = claim;
        item.append(strong, span, link);
        return item;
      }));
    }
    const panel = byId("position-panel");
    if (panel && button) panel.setAttribute("aria-labelledby", button.id);
  }

  wireTabs("[data-position-view]", "positionView", updatePosition);

  const diffs = {
    measurement: {
      version:"EVIDENCE VERSION · 2026-07-01", priorTitle:"Near-term national monitoring looked likely.",
      priorCopy:"Draft CCL 6 elevated microplastics as a drinking-water research priority. The working inference went further than the notice itself.",
      priorId:"P01-CLAIM-013 · invalid_at 2026-07-01", priorClaim:"P01-CLAIM-013",
      activeTitle:"The near-term gate shifts from monitoring to measurement.",
      activeCopy:"Proposed UCMR 6 omits microplastics because a validated method and adequate laboratory capacity are not ready within the cycle.",
      activeId:"P01-CLAIM-014 · valid_from 2026-07-01", activeClaim:"P01-CLAIM-014",
      changes:"National monitoring demand moves out; method validation and laboratory capacity become the immediate bottleneck.",
      unchanged:"Draft research priority remains. The records establish no national limit or category-level health conclusion.",
      effect:"MEASURE strengthens. Clinical and removal postures stay unchanged.",
      equivalent:"Claims P01-CLAIM-013 and P01-CLAIM-014. The measurement-policy view preserves the prior inference and activates the UCMR 6 correction. Measure strengthens while clinical and removal postures stay unchanged."
    },
    removal: {
      version:"EVIDENCE VERSION · 2026-04-27", priorTitle:"The earlier record had no reported lower circulating signal.",
      priorCopy:"The reviewed record contained no published human procedure with a reported circulating-particle reduction.",
      priorId:"P01-CLAIM-018 · invalid_at 2026-04-27", priorClaim:"P01-CLAIM-018",
      activeTitle:"A baseline-dependent assay signal now exists.",
      activeCopy:"An uncontrolled plasma-exchange study reported lower post-procedure counts in higher-baseline groups while the largest low-baseline group increased.",
      activeId:"P01-CLAIM-019 · valid_from 2026-04-27", activeClaim:"P01-CLAIM-019",
      changes:"A reported human circulating-particle signal enters the record as developing evidence.",
      unchanged:"Total-body clearance, durability, safety and patient benefit remain unestablished.",
      effect:"REMOVE remains WATCH. The new signal changes one claim without advancing the posture.",
      equivalent:"Claims P01-CLAIM-018, P01-CLAIM-019 and P01-CLAIM-020. The removal-frontier view preserves the prior inference, records a baseline-dependent circulating assay signal and keeps Remove at Watch."
    }
  };

  function updateDiff(key, button) {
    const data = diffs[key] || diffs.measurement;
    setText("diff-version", data.version);
    setText("diff-prior-title", data.priorTitle);
    setText("diff-prior-copy", data.priorCopy);
    setText("diff-prior-id", data.priorId);
    setText("diff-active-title", data.activeTitle);
    setText("diff-active-copy", data.activeCopy);
    setText("diff-active-id", data.activeId);
    setText("diff-changes", data.changes);
    setText("diff-unchanged", data.unchanged);
    setText("diff-effect", data.effect);
    setText("diff-visual-equivalent", data.equivalent);
    setClaim("diff-prior-claim", data.priorClaim, "Open preserved claim");
    setClaim("diff-active-claim", data.activeClaim, "Open active claim");
    setClaim("diff-claim", data.activeClaim, "Open new source + preserved history");
    const panel = byId("diff-panel");
    if (panel) {
      panel.dataset.diffState = key;
      if (button) panel.setAttribute("aria-labelledby", button.id);
    }
  }

  wireTabs("[data-diff]", "diff", updateDiff);

  root.classList.add("evidence-ready");
  window.ProphetEvidence = {
    pathways,
    methods,
    threads,
    riskViews,
    positions,
    diffs,
    setPassportStep,
    updatePathway,
    updateMethod,
    updateThread,
    updateRisk,
    updatePosition,
    updateDiff
  };
})();
