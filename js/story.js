(() => {
  "use strict";

  const scenes = [...document.querySelectorAll(".story-scene[data-scene]")];
  const progress = document.getElementById("hud-progress-bar");
  const chapter = document.getElementById("hud-chapter");
  const evidence = document.getElementById("hud-evidence");
  const boundary = document.getElementById("claim-boundary-copy");
  const railLinks = [...document.querySelectorAll(".chapter-rail a")];
  const visibleScenes = new Set();
  let activeScene = null;
  let frame = 0;

  const labels = {
    "cold-open":"BOUNDARY",
    particle:"THE PARTICLE",
    "measurement-problem":"MEASUREMENT",
    "evidence-chamber":"EVIDENCE",
    "risk-matrix":"RISK MATRIX",
    "investable-stack":"INVESTABLE STACK",
    "delphi-position":"DELPHI POSITION",
    "thesis-diff":"THESIS DIFF",
    invitation:"INVITATION",
    closing:"CLOSING"
  };
  const boundaries = {
    "cold-open":"Every material claim opens to evidence and limits.",
    particle:"Presence carries its route, its sampled tissue and its method into any interpretation.",
    "measurement-problem":"Particle count, particle shape and total polymer weight are three different measurements.",
    "evidence-chamber":"Each thread stops at its highest supported category.",
    "risk-matrix":"Unknown cells remain explicit; color carries no biological-danger estimate.",
    "investable-stack":"Buyer, trigger, proof gate, moat hypothesis and failure mode travel together.",
    "delphi-position":"Scientific status and Delphi investment posture remain separately labeled.",
    "thesis-diff":"A successor preserves the prior claim and requires human approval for publication.",
    invitation:"Each response route opens a user-controlled email draft.",
    closing:"Conviction remains inside the reviewed evidence gates."
  };
  const stateColors = {
    contested:"var(--coral)",
    inferred:"var(--violet)",
    established:"var(--mint)",
    developing:"var(--amber)",
    observed:"var(--cyan)"
  };

  function setActive(scene) {
    if (!scene || scene === activeScene) return;
    activeScene = scene;
    const key = scene.dataset.scene;
    const act = scene.dataset.act || "00";
    const state = scene.dataset.evidence || "Evidence";

    scenes.forEach((item) => item.classList.toggle("is-active", item === scene));
    document.body.dataset.scene = key;
    document.body.dataset.evidence = state;
    if (chapter) chapter.textContent = `${labels[key] || key.toUpperCase()} / ${act}`;
    if (evidence) {
      evidence.textContent = state.toUpperCase();
      evidence.style.color = stateColors[state.toLowerCase()] || "var(--cyan)";
    }
    if (boundary) boundary.textContent = boundaries[key] || boundaries["cold-open"];
    railLinks.forEach((link) => {
      if (link.getAttribute("href") === `#${scene.id}`) link.setAttribute("aria-current", "step");
      else link.removeAttribute("aria-current");
    });
  }

  function chooseScene(rects) {
    if (!rects.length) return null;
    const hudHeight = document.getElementById("story-hud")?.getBoundingClientRect().height || 0;
    const activation = Math.max(hudHeight + 14, Math.min(window.innerHeight * 0.38, window.innerHeight - 90));
    const containing = rects.filter(({ rect }) => rect.top <= activation && rect.bottom >= activation);
    if (containing.length) {
      return containing.reduce((best, item) => {
        const distance = Math.abs((item.rect.top + item.rect.bottom) / 2 - activation);
        return distance < best.distance ? { scene:item.scene, distance } : best;
      }, { scene:containing[0].scene, distance:Infinity }).scene;
    }
    const candidates = visibleScenes.size ? rects.filter(({ scene }) => visibleScenes.has(scene)) : rects;
    const pool = candidates.length ? candidates : rects;
    return pool.reduce((best, item) => {
      const distance = item.rect.bottom < activation ? activation - item.rect.bottom : item.rect.top - activation;
      return distance < best.distance ? { scene:item.scene, distance } : best;
    }, { scene:pool[0].scene, distance:Infinity }).scene;
  }

  function update() {
    frame = 0;
    const rects = scenes.map((scene) => ({ scene, rect:scene.getBoundingClientRect() }));
    const maximum = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    const value = Math.min(1, Math.max(0, window.scrollY / maximum));
    const next = chooseScene(rects);
    if (progress) progress.style.width = `${(value * 100).toFixed(2)}%`;
    setActive(next);
  }

  function schedule() {
    if (!frame) frame = requestAnimationFrame(update);
  }

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) visibleScenes.add(entry.target);
        else visibleScenes.delete(entry.target);
      });
      schedule();
    }, { rootMargin:"-12% 0px -12% 0px", threshold:[0, 0.01, 0.15, 0.4, 0.75] });
    scenes.forEach((scene) => observer.observe(scene));
  }

  window.addEventListener("scroll", schedule, { passive:true });
  window.addEventListener("resize", schedule, { passive:true });
  window.addEventListener("hashchange", schedule);
  window.addEventListener("popstate", schedule);
  window.addEventListener("load", schedule, { once:true });

  document.querySelectorAll('a[href^="http://"],a[href^="https://"]').forEach((link) => {
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    if (!link.getAttribute("aria-label")) {
      link.setAttribute("aria-label", `${link.textContent.trim() || "External source"} (opens in a new tab)`);
    }
  });

  let printDetails = [];
  window.addEventListener("beforeprint", () => {
    printDetails = [...document.querySelectorAll("details")].map((detail) => [detail, detail.open]);
    printDetails.forEach(([detail]) => { detail.open = true; });
  });
  window.addEventListener("afterprint", () => {
    printDetails.forEach(([detail, wasOpen]) => { detail.open = wasOpen; });
    printDetails = [];
  });

  setActive(scenes[0]);
  schedule();
  document.documentElement.classList.add("story-ready");
  window.ProphetStory = { get activeScene() { return activeScene; }, schedule };
})();
