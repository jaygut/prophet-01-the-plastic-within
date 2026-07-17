# Prophet 01 — Evidence Register

- **Edition:** The Plastic Within
- **Evidence freeze:** 16 July 2026
- **Public status:** Static research pack; human approval remains required for publication
- **Canonical records:** [`../data/claims.json`](../data/claims.json), [`../data/sources.json`](../data/sources.json), [`../data/scenes.json`](../data/scenes.json), [`../data/opportunity-map.json`](../data/opportunity-map.json)

## Editorial boundary

This register supports an investment-research experience, not medical advice, a diagnostic, a market forecast or a claim that microplastics as one category cause human disease. Detection, association, mechanism, experimental causality, human causality and validated reversal remain separate states. Counts, mass, concentration and particle-resolved measurements are never normalized into one burden score.

Every public factual passage resolves to a claim ID. Every claim resolves to at least one source ID and exact locator. `status: contested` means no winner was selected; `status: superseded` means the historical claim remains queryable with `invalid_at` and `superseded_by` fields.

## Research method

The main agent and three independent research workstreams searched human evidence and analytical methods; standards, policy and public investment; and venture layers, buyers and proof gates. Agent findings were treated as leads. Headline sources were then opened and checked directly against official agency pages, Federal Register notices, standards catalog records, PubMed/DOI records, full open-access articles and ClinicalTrials.gov.

Source precedence for factual conflict was: binding or official current record; peer-reviewed primary evidence; authoritative synthesis; then commentary or company material. Recency never overrode scope or method quality. Search snippets, press coverage, company claims and market-size databases were not used as evidence for the public thesis.

## What the evidence changes

1. **Human presence is observable, but not one comparable burden.** Lung, plaque and postmortem tissue studies use different matrices, methods and limits (`P01-CLAIM-001`–`004`).
2. **General human disease causality is not established.** Selected associations and experimental mechanisms matter, but the category-level interpretation remains contested (`P01-CLAIM-003`, `005`, `023`).
3. **Measurement is the current category-opening gate.** Interlaboratory work, NIST activity, EPA's method gap and matrix-specific standards converge on reference materials, contamination control and reproducibility (`P01-CLAIM-006`–`014`).
4. **Regulation creates separate use cases, not one market.** California drinking water and the EU intentionally-added-particle restriction have different scopes and buyers (`P01-CLAIM-011`, `015`, `028`).
5. **Removal advanced by one narrow step in 2026.** A plasma-exchange study changed an immediate circulating assay signal under some baseline conditions, but did not establish total-body clearance, durability, safety benefit or clinical outcome (`P01-CLAIM-018`–`021`).

## Claim ledger

| Claim | Status / state | Public-safe finding | Primary source locator | Essential limit |
|---|---|---|---|---|
| `P01-CLAIM-001` | active / observed | μFTIR reported 39 particles in 11/13 lung samples. | `P01-SOURCE-004`, Abstract | Small selected series; route evidence, not disease. |
| `P01-CLAIM-002` | active / observed | PE was reported in 150/257 plaques and PVC in 31 in a carotid-surgery cohort. | `P01-SOURCE-005`, Abstract > Results | Not prevalence or causality. |
| `P01-CLAIM-003` | active / observed association | Plaque detection was associated with a composite outcome, adjusted HR 4.53 (95% CI 2.00–10.27). | `P01-SOURCE-005`, Abstract > Results/Conclusions | Selected cohort and residual confounding; association only. |
| `P01-CLAIM-004` | active / observed | A postmortem study reported signals in decedent kidney, liver and brain. | `P01-SOURCE-006`, Abstract | Quantitative cross-tissue and dementia readings remain method-sensitive. |
| `P01-CLAIM-005` | **contested** | Reviews differ on whether a broad suspected-harm conclusion is justified across selected outcomes. | `P01-SOURCE-001`, `007`, `008` | Frameworks differ and are not averaged. |
| `P01-CLAIM-006` | active / established | Preparation, blanks, thresholds and measurand change the reportable result. | `P01-SOURCE-002`, `003`, `009`, `010` | Water/reference-material performance does not transfer automatically to tissue. |
| `P01-CLAIM-007` | active / observed | In a 22-lab clean-water study, FTIR/Raman identification was strong while blank contamination was substantial. | `P01-SOURCE-002`, Abstract | Both results stay visible; not biospecimen validation. |
| `P01-CLAIM-008` | active / observed | A VAMAS 84-lab comparison found wide reproducibility ranges in a simplified matrix. | `P01-SOURCE-003`, Abstract | No universal error percentage is inferred. |
| `P01-CLAIM-009` | active / established | NIST identifies reference-material gaps as a reproducibility barrier. | `P01-SOURCE-010`, Reference Materials | Research program, not completed universal certification. |
| `P01-CLAIM-010` | active / established | ISO 24187 sets environmental analytical principles, not human assay validation. | `P01-SOURCE-011`, Abstract | No clinical scope or monitoring mandate. |
| `P01-CLAIM-011` | active / established | California adopted a drinking-water method/reporting framework in 2022. | `P01-SOURCE-012`, Actions; Testing and Reporting | No health-based limit or federal mandate. |
| `P01-CLAIM-012` | active / established | Draft CCL 6 prioritizes microplastics research and names four explicit gaps. | `P01-SOURCE-022`, 91 FR 17193–17194 | Candidate status imposes no requirement. |
| `P01-CLAIM-013` | **superseded** / inference | Earlier working inference: CCL 6 made near-term national monitoring likely. | `P01-SOURCE-022`, CCL process | Invalidated 2026-07-01; never a regulatory fact. |
| `P01-CLAIM-014` | active / established | Proposed UCMR 6 omits microplastics because a validated method and capacity are not ready in time. | `P01-SOURCE-023`, 91 FR 39959–39960 | Proposed, not final; omission is not a safety conclusion. |
| `P01-CLAIM-015` | active / established | EU rules restrict intentionally added synthetic polymer microparticles within scoped uses and transitions. | `P01-SOURCE-014`, Scope/Exclusions/Transitions | Not a blanket microplastics ban. |
| `P01-CLAIM-016` | active / established | STOMP sequences measurement/mechanism before a later removal workstream. | `P01-SOURCE-015`, `016`, Technical Areas/FAQ | Roadmap targets are not achieved technology. |
| `P01-CLAIM-017` | active / established | ARPA-H committed a $144m STOMP envelope and anticipated multiple awards. | `P01-SOURCE-016`, `017`, Budget/launch | Commitment is not $144m already awarded. |
| `P01-CLAIM-018` | **superseded** / inference | Earlier working inference: no published human procedure had changed a circulating signal. | `P01-SOURCE-015`, The Problem | Superseded by a May 2026 study; source addressed validation, not exhaustive absence. |
| `P01-CLAIM-019` | active / developing | TPE changed immediate assay counts differently by baseline, including an increase in the largest low-baseline group. | `P01-SOURCE-020`, Methods/Table 2/Limitations | Proprietary assay; uncontrolled; no total burden, durability or outcome. |
| `P01-CLAIM-020` | active / boundary | No cited study validates safe, durable total-body reduction with improved human outcomes. | `P01-SOURCE-015`, `016`, `020`, `021` | Dated boundary; re-review on controlled independent evidence. |
| `P01-CLAIM-021` | active / developing | NCT07658443 is an estimated 20-person observational paired-biomarker study with no posted results. | `P01-SOURCE-021`, Design/Outcomes/Record Dates | Biomarker endpoint; not treatment assignment or benefit. |
| `P01-CLAIM-022` | active / established | NIEHS frames exposomics across the life course and prioritizes measurement and harmonization. | `P01-SOURCE-018`, Definition/Priorities | Strategy is not clinical actionability or a market size. |
| `P01-CLAIM-023` | active / boundary | Evidence supports detection and selected associations, not general category-level human disease causality. | `P01-SOURCE-001`, `007`, `008`, `019` | Lack of proof is not proof of safety. |
| `P01-CLAIM-024` | active / Delphi inference | Lead measurement, reference and reproducibility infrastructure. | `P01-SOURCE-003` Abstract; `009` Methods Development; `010` Reference Materials; `012` Actions; `016` FAQ; `023` §III.E.1 | Demand signals do not prove venture margins or moat. |
| `P01-CLAIM-025` | active / Delphi inference | Build conviction in defined prevention and safer-material use cases. | `P01-SOURCE-012` policy framework; `014` Scope/Transitions; `023` §III.E.1 | Field economics and lifecycle proof remain company-specific. |
| `P01-CLAIM-026` | active / Delphi inference | Select clinical interpretation only after analytical validity and actionability. | `P01-SOURCE-001` Abstract; `005` Abstract; `009` method gaps; `016` clinical-validation FAQ | No product endorsement or approval claim. |
| `P01-CLAIM-027` | active / Delphi inference | Watch biomedical removal pending relevant burden, safe durable clearance and benefit. | `P01-SOURCE-015` program sequence; `016` TA3 FAQ; `020` Limitations; `021` Design/Outcomes | Controlled independent evidence can re-rate the posture. |
| `P01-CLAIM-028` | active / counter-thesis | The umbrella category may fragment, and compliance work may not form one venture market. | `P01-SOURCE-002`, `003` Abstracts; `011` Abstract; `012` Actions/Reporting; `014` Scope/Exclusions/Transitions; `018` definition/priorities | Falsifiable failure scenario, not a forecast. |

## Conflict register — never averaged

### Category-level harm

`P01-CLAIM-005` stays contested. Chartres et al. reaches “suspected” conclusions for selected outcomes from a body of evidence dominated by animal studies, while Lamoree et al. and Xu et al. emphasize inadequate human exposure assessment and analytical rigor. The sources ask related but non-identical questions. No synthetic certainty score or winner is published.

### Human tissue and blood interpretation

The experience uses lung and plaque observations only within their own methods and cohorts. It does not compare tissue concentrations on one axis. Postmortem brain findings are shown only as method-sensitive detection; sensational mass analogies and dementia-causality language are excluded.

### Regulation and monitoring

The later, more specific official record wins for the question “Is U.S. national monitoring imminent?” `P01-CLAIM-013` is invalidated and linked to `P01-CLAIM-014`. The underlying CCL 6 research-priority fact (`P01-CLAIM-012`) remains active. Nothing was deleted.

### Removal

The TPE result (`P01-CLAIM-019`) supersedes only the narrow absence inference (`P01-CLAIM-018`). It does not conflict away the validation boundary (`P01-CLAIM-020`) because an immediate proprietary blood-assay change and durable total-body clinical benefit are different claims.

## Delphi posture and falsifiers

| Posture | Decisive diligence question | Advances when | Weakens or dies when |
|---|---|---|---|
| **Lead — Measure** | Can another lab reproduce the decision-relevant result with declared recovery, blanks and method window? | Independent multi-site validation plus a repeat buyer changes a real decision. | Performance collapses outside the originating lab or incumbents satisfy the use case at commodity economics. |
| **Build — Prevent / Replace** | Does the system reduce a defined source or substitute a function at acceptable full-system and lifecycle cost? | Multi-site qualification, audited denominator and repeat orders. | Fouling, waste transfer, qualification failure or scale economics erase value. |
| **Select — Map / Attribute / clinical interpretation** | Which named decision changes, and is the signal analytically valid and actionable? | A prospective prediction or result replicates and changes a budgeted decision. | Heterogeneity dominates attribution or results remain informative but non-actionable. |
| **Watch — Remove** | What relevant burden is removed, how is it independently measured and which patient outcome improves? | Controlled, clean-circuit, orthogonally measured durable reduction with patient benefit. | Circulating signal is unrelated to burden or benefit, or procedure risk and rebound dominate. |

## Real thesis diffs

### Measurement / policy diff

- **Prior evidence version:** 6 April 2026, draft CCL 6 (`P01-SOURCE-022`).
- **Preserved working inference:** `P01-CLAIM-013`, near-term national monitoring likely.
- **New source:** 1 July 2026 proposed UCMR 6 (`P01-SOURCE-023`).
- **Active correction:** `P01-CLAIM-014`, microplastics omitted because validated methods and laboratory capacity were not ready.
- **What changes:** near-term national monitoring demand weakens; the measurement-infrastructure thesis strengthens.
- **What does not:** research prioritization remains; no national limit or category-level health conclusion appears.

### Removal diff

- **Prior evidence version:** 2 April 2026 STOMP program gap (`P01-SOURCE-015`).
- **Preserved working inference:** `P01-CLAIM-018`, no published human procedure had changed a circulating signal.
- **New source:** 21 May 2026 Weinstein et al. (`P01-SOURCE-020`).
- **Active correction:** `P01-CLAIM-019`, a baseline-dependent immediate assay signal exists.
- **What changes:** removal moves from no signal to developing, contested proof-of-principle.
- **What does not:** no validated total-body clearance, durability or human benefit; Delphi posture remains Watch (`P01-CLAIM-020`, `027`).

## Known research gaps and review triggers

- Human-biospecimen reference materials and cross-laboratory comparisons remain immature.
- Particle count, polymer mass, morphology and nanoscale measurements remain non-interchangeable.
- Route-, dose- and property-specific prospective human cohorts are limited.
- No reference range or decision pathway makes a general consumer microplastics result clinically actionable.
- Re-review UCMR 6 after finalization; re-review STOMP after named awards and any TA3 solicitation; re-review NCT07658443 when results post; re-review removal posture on independent controlled evidence.
- WHO's 2022 review has a December 2021 evidence cutoff and is retained as historical framing, not a 2026 endpoint.

## Public-language exclusions

The edition does not use “detox,” “plastic causes heart disease,” “plastic spoon in the brain,” “77% of people,” “EU microplastics ban,” “$144m awarded,” “validated removal,” or any cross-study composite burden. Named companies are omitted from the public stack; archetypes and proof gates are more defensible than a logo wall.
