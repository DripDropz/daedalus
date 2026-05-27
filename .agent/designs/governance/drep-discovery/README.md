# DRep Discovery — UX Design Index

**Status:** Draft for stakeholder review
**Date:** 2026-05-21
**Plan:** [governance-drep-discovery-plan.md](../../../plans/governance/governance-drep-discovery-plan.md)
**Tasks:** [governance-drep-discovery-plan-tasks.json](../../../plans/governance/governance-drep-discovery-plan-tasks.json)

This folder contains three full UX flow variants for the in-app DRep Discovery feature in Daedalus, plus shared design tokens and external research. Implementation (Storybook + React) is intentionally deferred.

## Documents

| File | Purpose |
|---|---|
| [external-research.md](./external-research.md) | Findings from GovTool, 1694.io, CIP-1694, CIP-119. Patterns to adopt and reject. |
| [shared-design-tokens.md](./shared-design-tokens.md) | Status badges, source labels, voting-power formatting, randomization indicator, refresh state — reused by all variants. |
| [variant-1-dedicated-section.md](./variant-1-dedicated-section.md) | Top-level **Governance** nav with sub-routes (directory / detail / favorites). |
| [variant-2-embedded-selector.md](./variant-2-embedded-selector.md) | Full-screen overlay launched from existing `VotingPowerDelegation`. |
| [variant-3-split-pane.md](./variant-3-split-pane.md) | Master/detail single route with persistent filter rail. |
| [current-vote-display-design.md](./current-vote-display-design.md) | Sprint 5 tech design: data model, mapper rules, normalizer, `CurrentVoteSummary` component, sequence diagrams, sanitization. |
| [current-vote-display-ux.md](./current-vote-display-ux.md) | Sprint 5 UX spec: wireframes for production / V1 / V2 / V3, knob spec, i18n key inventory. |

## Feature Scope (binding)

- Local-first: data comes only from `cardano-cli` via main-process `GovernanceQueryService`. No external API calls for discovery.
- Default cohort: exclude top 35 by voting power, randomize next ≤200 eligible (active, expiry > 6 epochs, completed metadata when verified anchor pipeline lands).
- Sprint 2 ships on-chain fields + anchor presence only. Sprint 4 adds verified anchor metadata with explicit source labels.
- Selection only supplies a `DRep ID` to the existing delegation flow in `VotingPowerDelegation`. No second delegation backend.
- Favorites persist via Electron local store, per device.
- Confirmation dialog shows DRep ID only until verified anchor pipeline lands.

## Comparison Matrix

Scoring: ● strong · ◐ partial · ○ weak

| Criterion | V1 Dedicated Section | V2 Embedded Selector | V3 Split-Pane |
|---|:---:|:---:|:---:|
| Discoverability of the feature | ● | ○ | ◐ |
| Evaluate-then-delegate speed | ◐ | ◐ | ● |
| Nav surface impact (low = better) | ○ (adds top-level item) | ● (none) | ◐ (one route) |
| Anti-bias clarity (top-35 exclusion legible) | ● | ◐ | ● |
| Anchor-label clarity (Sprint 4 fit) | ● | ◐ | ● |
| Hardware wallet confirmation fit | ● | ◐ (overlay must close cleanly) | ● |
| Implementation cost vs Sprint 2 baseline | ◐ (largest) | ● (Sprint 2) / ○ (Sprint 4) | ◐ (medium) |
| Sprint 4 expansion cost (anchor profile) | ● | ○ | ● |
| Form-state preservation across browsing (wallet + vote type) | ◐ (via location-state restore) | ● | ● |
| Accessibility (focus mgmt, keyboard) | ● | ◐ (overlay focus trap risk) | ◐ (split-pane focus order) |
| Future expansion to governance dashboard | ● | ○ | ◐ |
| Localization risk (long EN/JA strings) | ● | ◐ | ◐ (narrow detail pane) |

## Recommendation

**Variant 1 — Dedicated Governance Section.**

**Single strongest reason:** It is the only variant whose information architecture cleanly absorbs the **out-of-scope but already-named** future surfaces (proposals, constitution, committee, treasury, dashboard) called out in the plan's _Plan Boundary_ section. Picking V2 or V3 now forces a second IA migration the moment any of those land, and Daedalus has historically paid a high i18n + tests cost for nav reshuffles.

Trade-off acknowledged: V1 has the largest Sprint 2 cost (roughly +5–8h for layout container, navigation entry, and the extra sub-routes) and adds one new top-level nav item — both surfaced in the variant doc.

## Open Questions for Stakeholders

1. **Top-level "Governance" nav vs nested under "Voting".** V1 assumes a new top-level item; an alternative is to rename "Voting" → "Governance" and move existing delegation under it. The latter is more disruptive to muscle memory but produces a cleaner long-term IA. Which is acceptable for Sprint 2?
2. **Randomization seed UX.** Should the randomized default cohort reseed on every refresh (more anti-bias, but jarring during browsing), per-app-session (current proposal), or be user-toggleable? This directly affects the randomization indicator copy in [shared-design-tokens.md](./shared-design-tokens.md).
3. **Favorites scope confirmation.** The plan locks favorites to per-device via Electron local store. Stakeholders should confirm this survives the typical "I restored my wallet on a new machine" UX expectation — it will not, by design, and the empty-state copy must own that.

## Plan-Level Inconsistencies & Gaps Discovered

- **CIP-119 `doNotList` field is not addressed in the plan.** DReps can opt out of being listed in directory tools via `doNotList=true` in their CIP-119 metadata. Sprint 4 anchor-rendering must decide whether Daedalus honors this flag in the default cohort and/or search. **Flagged only — file this as a Sprint 4 acceptance-criterion addition in the task JSON (out of scope for this design folder; do not edit the task JSON from here).**
- **No defined treatment for the pre-defined voting options (`Abstain`, `No Confidence`).** The existing `VotingPowerDelegation` already exposes these as radio options. The plan's "selector only supplies a DRep ID" boundary leaves ambiguous whether the new directory should also expose Abstain / No Confidence as first-class "delegation targets" or keep them as form-only choices. Variants assume the latter; please confirm.
- **Refresh latency UX is undefined.** The plan requires latest-on-load + explicit refresh, but `cardano-cli` bulk queries can take seconds on a busy node. No skeleton timing budget or stale-while-refresh visual contract is specified. Shared tokens propose a `<700ms full skeleton, 700ms–10s stale-with-spinner, >10s timeout banner` budget; please confirm.
- **Confirmation dialog identity change between Sprint 2 and Sprint 4.** The plan says Sprint 2 shows DRep ID only, Sprint 4 may add a verified display name. This is a user-visible regression risk if a user re-inspects a previously-delegated DRep in detail view after Sprint 4 lands; flag for Sprint 4 design follow-up.
- **Network selector interaction.** Daedalus supports mainnet / preprod / preview / selfnode; the plan acknowledges selfnode CLI may be unsupported (`SelfnodeCliUnsupported`) but does not specify the directory's empty/unsupported state copy. Captured in shared tokens.

## References

- CIP-1694 (liquid democracy, vote delegation semantics, reward-withdrawal gate): https://github.com/cardano-foundation/CIPs/blob/master/CIP-1694/README.md
- CIP-119 test vector spec: https://github.com/cardano-foundation/CIPs/blob/master/CIP-0119/test-vector.md
- CIP-119 canonical example (`drep.jsonld`): https://github.com/cardano-foundation/CIPs/blob/master/CIP-0119/examples/drep.jsonld
- Mainnet test vector — SIPO: https://sipo.tokyo/drep/SIPO.jsonld
- Preprod test vector — Cardano Academy: https://raw.githubusercontent.com/cardano-foundation/cardano-academy/refs/heads/main/Cardano%20Academy.jsonld
