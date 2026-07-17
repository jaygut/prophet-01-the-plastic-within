(() => {
  "use strict";

  const drawer = document.getElementById("source-drawer");
  const openButton = document.getElementById("open-sources");
  const closeButton = document.getElementById("close-sources");
  if (!drawer) return;

  const claims = new Map();
  const sources = new Map();
  let ready = false;
  let returnFocus = null;
  let sessionBaseHash = "";
  let sessionManaged = false;
  let mutationFrame = 0;

  const text = (id, value, fallback = "Not recorded") => {
    const node = document.getElementById(id);
    if (node) node.textContent = value == null || value === "" ? fallback : String(value);
  };

  const claimFromHash = () => {
    const match = window.location.hash.match(/^#claim-(P01-CLAIM-\d{3})$/);
    return match ? match[1] : null;
  };

  function scopeText(scope) {
    if (!scope) return "See claim wording";
    return Object.keys(scope)
      .map((key) => scope[key] ? `${key.replaceAll("_", " ")}: ${scope[key]}` : "")
      .filter(Boolean)
      .join(" · ");
  }

  function sourceCard(source, locatorOverride) {
    const article = document.createElement("article");
    article.className = "drawer-source-card";

    const label = document.createElement("span");
    label.textContent = `${source.id} · ${source.source_type || "source"}`;
    article.append(label);

    const title = document.createElement("strong");
    title.textContent = source.title;
    article.append(title);

    const meta = document.createElement("p");
    meta.textContent = `${source.authors_or_organization || source.publisher} · ${source.publication_date || "publication date not stated"}`;
    article.append(meta);

    const locator = document.createElement("p");
    const locatorLabel = document.createElement("b");
    locatorLabel.textContent = "Locator: ";
    locator.append(locatorLabel, document.createTextNode(locatorOverride || source.locator || "See source"));
    article.append(locator);

    const why = document.createElement("p");
    const whyLabel = document.createElement("b");
    whyLabel.textContent = "Why it matters: ";
    why.append(whyLabel, document.createTextNode(source.relevance || "Supports the cited claim."));
    article.append(why);

    const limit = document.createElement("p");
    const limitLabel = document.createElement("b");
    limitLabel.textContent = "Does not establish: ";
    limit.append(limitLabel, document.createTextNode(source.limitations || "Claims beyond its stated scope."));
    article.append(limit);

    const link = document.createElement("a");
    link.href = source.url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = source.doi ? "Open DOI ↗" : "Open primary source ↗";
    link.setAttribute("aria-label", `Open primary source in a new tab: ${source.title}`);
    article.append(link);
    return article;
  }

  function historyLinks(claim) {
    const container = document.getElementById("drawer-conflict-copy");
    const conflict = document.getElementById("drawer-conflict");
    if (!container || !conflict) return;
    const entries = [];
    (claim.conflicts_with || []).forEach((id) => entries.push(["Conflicts with", id]));
    if (claim.supersedes) entries.push(["Supersedes", claim.supersedes]);
    if (claim.superseded_by) entries.push(["Superseded by", claim.superseded_by]);
    conflict.hidden = entries.length === 0;
    container.replaceChildren();
    if (!entries.length) return;
    container.className = "drawer-history-links";
    entries.forEach(([relationship, id]) => {
      const link = document.createElement("a");
      link.href = `#claim-${id}`;
      link.dataset.claimId = id;
      link.textContent = `${relationship}: ${id}`;
      container.append(link);
    });
  }

  function showDrawer(focusClose = true) {
    const alreadyOpen = drawer.open || drawer.hasAttribute("open");
    if (!alreadyOpen) {
      if (typeof drawer.showModal === "function") drawer.showModal();
      else drawer.setAttribute("open", "");
    }
    document.body.classList.add("drawer-open");
    if (focusClose && !alreadyOpen) window.setTimeout(() => closeButton?.focus(), 0);
  }

  function renderClaim(id, trigger, focusClose = true) {
    if (!ready || !claims.has(id)) return false;
    const claim = claims.get(id);
    if (!(drawer.open || drawer.hasAttribute("open"))) returnFocus = trigger || document.activeElement;

    text("drawer-state", String(claim.evidence_state || claim.status).toUpperCase());
    text("drawer-title", claim.status === "superseded" ? "Historical claim preserved" : "Claim + source");
    text("drawer-claim-id", `${claim.id} · ${String(claim.claim_class || "claim").toUpperCase()}`);
    text("drawer-claim-copy", claim.claim);
    text("drawer-status", `${claim.status} / ${claim.evidence_state}`);
    text("drawer-type", claim.evidence_type);
    text("drawer-scope", scopeText(claim.scope));
    text("drawer-validity", `valid_from ${claim.valid_from || "not recorded"}${claim.invalid_at ? ` · invalid_at ${claim.invalid_at}` : " · active at verification"}`);
    text("drawer-caveat", claim.caveat);
    text("drawer-verified", `Last verified ${claim.last_verified}`);
    historyLinks(claim);

    const list = document.getElementById("drawer-source-list");
    if (list) {
      list.replaceChildren();
      (claim.source_ids || []).forEach((sourceId, index) => {
        const source = sources.get(sourceId);
        if (source) list.append(sourceCard(source, claim.locators?.[index]));
      });
    }
    showDrawer(focusClose);
    return true;
  }

  function openClaim(id, trigger, options = {}) {
    if (!ready || !claims.has(id)) return false;
    const alreadyOpen = drawer.open || drawer.hasAttribute("open");
    const historyMode = options.history || "none";
    if (historyMode === "user") {
      if (!alreadyOpen) {
        sessionBaseHash = window.location.hash;
        sessionManaged = true;
        window.history.pushState({ prophetClaim:id }, "", `#claim-${id}`);
      } else {
        window.history.replaceState({ prophetClaim:id }, "", `#claim-${id}`);
      }
    }
    return renderClaim(id, trigger, !alreadyOpen);
  }

  function finishClose(restoreFocus = true) {
    if (typeof drawer.close === "function" && drawer.open) drawer.close();
    else drawer.removeAttribute("open");
    document.body.classList.remove("drawer-open");
    if (restoreFocus && returnFocus && typeof returnFocus.focus === "function") returnFocus.focus();
    returnFocus = null;
    sessionManaged = false;
  }

  function requestClose() {
    if (sessionManaged && window.history.state?.prophetClaim) {
      window.history.back();
      return;
    }
    if (claimFromHash()) {
      const cleanUrl = `${window.location.pathname}${window.location.search}${sessionBaseHash && !sessionBaseHash.startsWith("#claim-") ? sessionBaseHash : ""}`;
      window.history.replaceState(null, "", cleanUrl);
    }
    finishClose(true);
  }

  function focusableNodes() {
    return [...drawer.querySelectorAll("button:not([disabled]),a[href],[tabindex]:not([tabindex='-1'])")]
      .filter((node) => node.getClientRects().length > 0);
  }

  function syncClaimLinks(scope = document) {
    if (!ready) return;
    scope.querySelectorAll?.("[data-claim-id]").forEach((link) => {
      const id = link.dataset.claimId;
      if (claims.has(id)) link.href = `#claim-${id}`;
    });
  }

  document.addEventListener("click", (event) => {
    const link = event.target.closest("[data-claim-id]");
    if (!link) return;
    const id = link.dataset.claimId;
    if (!ready || !claims.has(id)) return;
    event.preventDefault();
    openClaim(id, link, { history:"user" });
  });

  openButton?.addEventListener("click", () => openClaim("P01-CLAIM-024", openButton, { history:"user" }));
  closeButton?.addEventListener("click", requestClose);
  drawer.addEventListener("click", (event) => { if (event.target === drawer) requestClose(); });
  drawer.addEventListener("cancel", (event) => {
    event.preventDefault();
    requestClose();
  });
  drawer.addEventListener("keydown", (event) => {
    if (event.key !== "Tab") return;
    const focusable = focusableNodes();
    if (!focusable.length) {
      event.preventDefault();
      closeButton?.focus();
      return;
    }
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });
  drawer.addEventListener("close", () => document.body.classList.remove("drawer-open"));

  function respondToHistory() {
    const id = claimFromHash();
    if (id && ready && claims.has(id)) {
      renderClaim(id, openButton || document.body, true);
      return;
    }
    if (drawer.open || drawer.hasAttribute("open")) finishClose(true);
  }
  window.addEventListener("popstate", respondToHistory);
  window.addEventListener("hashchange", respondToHistory);

  Promise.all([
    fetch("data/claims.json", { cache:"no-store" }).then((response) => {
      if (!response.ok) throw new Error("Claims unavailable");
      return response.json();
    }),
    fetch("data/sources.json", { cache:"no-store" }).then((response) => {
      if (!response.ok) throw new Error("Sources unavailable");
      return response.json();
    })
  ])
    .then(([claimData, sourceData]) => {
      claimData.forEach((claim) => claims.set(claim.id, claim));
      sourceData.forEach((source) => sources.set(source.id, source));
      ready = true;
      document.documentElement.classList.add("is-enhanced");
      if (openButton) openButton.hidden = false;
      syncClaimLinks();

      const observer = new MutationObserver(() => {
        if (mutationFrame) return;
        mutationFrame = requestAnimationFrame(() => {
          mutationFrame = 0;
          syncClaimLinks();
        });
      });
      observer.observe(document.body, { subtree:true, childList:true, attributes:true, attributeFilter:["data-claim-id"] });
      respondToHistory();
    })
    .catch(() => {
      ready = false;
      document.documentElement.classList.add("source-fallback-ready");
      document.querySelectorAll("[data-claim-id]").forEach((link) => { link.href = "#source-register"; });
    });

  window.ProphetSources = {
    openClaim,
    close:requestClose,
    isReady:() => ready,
    claims,
    sources
  };
})();
