(() => {
  "use strict";

  const buttons = [...document.querySelectorAll("[data-layer]")];
  const panel = document.getElementById("stack-detail");
  const instrument = document.querySelector(".stack-instrument");
  if (!buttons.length || !panel) return;

  const layers = new Map();
  const titles = {
    measure: "Make results comparable across laboratories.",
    map: "Keep provenance attached across time and source.",
    attribute: "Discriminate a mechanism that changes a decision.",
    prevent: "Verify one source-control system in the field.",
    replace: "Qualify function, fate and economics together.",
    remove: "Require burden, clearance and patient benefit."
  };
  const claims = {
    measure: { investment:"P01-CLAIM-024", science:"P01-CLAIM-006" },
    map: { investment:"P01-CLAIM-028", science:"P01-CLAIM-022" },
    attribute: { investment:"P01-CLAIM-028", science:"P01-CLAIM-023" },
    prevent: { investment:"P01-CLAIM-025", science:"P01-CLAIM-015" },
    replace: { investment:"P01-CLAIM-025", science:"P01-CLAIM-015" },
    remove: { investment:"P01-CLAIM-027", science:"P01-CLAIM-020" }
  };

  const text = (id, value) => {
    const node = document.getElementById(id);
    if (node) node.textContent = value;
  };

  const claim = (id, claimId, label) => {
    const node = document.getElementById(id);
    if (!node) return;
    node.dataset.claimId = claimId;
    node.href = window.ProphetSources?.isReady() ? `#claim-${claimId}` : "#source-register";
    node.textContent = label;
  };

  function select(button, focus = false) {
    buttons.forEach((item) => {
      const active = item === button;
      item.setAttribute("aria-selected", String(active));
      item.tabIndex = active ? 0 : -1;
    });

    const data = layers.get(button.dataset.layer);
    if (!data) return;
    const claimSet = claims[data.id];
    const posture = document.getElementById("stack-posture");
    if (posture) {
      posture.textContent = `${data.posture} · ${data.posture_basis}`;
      posture.className = `posture-chip ${data.posture.toLowerCase()}`;
    }

    if (instrument) instrument.dataset.activeLayer = data.id;
    panel.dataset.claimIds = data.claim_ids.join(" ");
    text("stack-horizon", data.capital_adoption_horizon);
    text("stack-name", titles[data.id] || data.label);
    text("stack-problem", data.problem);
    text("stack-archetypes", data.company_archetypes.join(" · "));
    text("stack-buyer", data.economic_owner);
    text("stack-buyer-state", data.buyer_state);
    text("stack-trigger", data.purchase_trigger);
    text("stack-gate", data.evidence_gate);
    text("stack-moat", data.moat_hypothesis);
    text("stack-failure", data.failure_mode);
    text("stack-capital", data.capital_intensity);
    text("stack-stage", data.plausible_venture_stage);
    text("stack-question", data.diligence_question);
    text("stack-milestone", `Advances when ${data.advance_milestone} Weakens when ${data.kill_event}`);
    text("stack-visual-equivalent", `Claims ${claimSet.investment} and ${claimSet.science}. ${data.label} is selected with a ${data.posture} Delphi posture. Buyer: ${data.economic_owner} Proof gate: ${data.evidence_gate}`);
    claim("stack-claim", claimSet.investment, "Investment inference");
    claim("stack-science-claim", claimSet.science, "Scientific / policy basis");
    panel.setAttribute("aria-labelledby", button.id);
    if (focus) button.focus();
  }

  buttons.forEach((button, index) => {
    button.addEventListener("click", () => select(button));
    button.addEventListener("keydown", (event) => {
      let next = null;
      if (event.key === "ArrowRight" || event.key === "ArrowDown") next = buttons[(index + 1) % buttons.length];
      if (event.key === "ArrowLeft" || event.key === "ArrowUp") next = buttons[(index - 1 + buttons.length) % buttons.length];
      if (event.key === "Home") next = buttons[0];
      if (event.key === "End") next = buttons[buttons.length - 1];
      if (!next || next.disabled) return;
      event.preventDefault();
      select(next, true);
    });
  });

  fetch("data/opportunity-map.json", { cache:"no-store" })
    .then((response) => {
      if (!response.ok) throw new Error("Opportunity map unavailable");
      return response.json();
    })
    .then((data) => {
      data.forEach((layer) => layers.set(layer.id, layer));
      document.documentElement.classList.add("opportunity-ready");
      select(buttons.find((button) => button.getAttribute("aria-selected") === "true") || buttons[0]);
    })
    .catch(() => {
      buttons.forEach((button, index) => {
        if (index === 0) return;
        button.disabled = true;
        button.setAttribute("aria-disabled", "true");
        button.title = "Interactive data unavailable. The complete static register follows.";
      });
      document.documentElement.classList.add("opportunity-fallback");
    });

  window.ProphetOpportunity = { layers, select };
})();
