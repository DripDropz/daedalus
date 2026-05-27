# Governance DRep Discovery Plan

## Overview

This plan covers the full DRep Discovery flow required for Daedalus users to discover, evaluate, favorite, select, and delegate to a DRep without leaving the app.

The plan remains local-first: DRep discovery data comes from the Daedalus-managed local Cardano node and cardano-wallet only. Verified DRep profile metadata may be rendered as secondary off-chain content only after the anchor bytes are fetched with hardened transport rules, hash-verified against the on-chain anchor hash, parsed, and clearly labeled.

## Task Tracking

- Companion tasks JSON: [governance-drep-discovery-plan-tasks.json](governance-drep-discovery-plan-tasks.json)

---

## Plan Boundary

This document and its companion task tracker are the canonical DRep Discovery implementation plan under `.agent/plans/governance/`. The plan owns the complete in-app DRep Discovery flow: browse, evaluate, favorite, select, review confirmation, and delegate through the existing Daedalus delegation paths.

The following surfaces are outside this plan unless they are explicitly added to this document and task tracker:

- Governance explorer surfaces for constitution, committee, proposals, treasury, and proposal details.
- Governance dashboard surfaces for active proposal voting, delegation overview, and DRep performance.
- Anchor-pipeline generalisation for constitution, governance action rationale, and constitutional committee rationale.
- DRep registration and active proposal voting.
- Local governance history.

Artifact placement decision: this plan and its task tracker are canonical under `.agent/plans/governance/` only.

---

## Goals

- Replace the GovTool-only discovery path with in-app DRep discovery backed by local Cardano state.
- Let users browse an unbiased default DRep cohort, search or show all DReps, inspect DRep details, and favorite DReps.
- Let users select a DRep from the discovery surface and delegate through the existing software-wallet and hardware-wallet flows.
- Render verified DRep anchor metadata only after hardened fetch, hash verification, immutable hash-keyed caching, parsing, and source labeling are complete.
- Preserve current-state-only behavior until a separate local-history initiative is approved.
- Tell users the current governance vote (DRep / Abstain / No Confidence) held by the selected wallet and pre-fill the existing `VotingPowerDelegation` flow from that state.
- Sanitize DRep ids and `abstain` / `no_confidence` literals out of logs and analytics before plumbing the current-vote state into the renderer.
- When a wallet has not delegated, surface the CIP-1694 reward-withdrawal restriction and nudge the user to choose a DRep, Abstain, or No Confidence — Daedalus never picks a delegation automatically.
- Display the DRep's `body.givenName` (CIP-119) inline alongside the DRep id and offer two links: the in-app DRep detail view and the raw anchor URL.

## Non-Goals

- No hosted explorers, hosted indexers, GovTool, Koios, Blockfrost, or public governance APIs as application data sources.
- No new delegation backend. The selector only supplies a DRep ID to the existing delegation flow.
- No proposal explorer, constitution explorer, treasury explorer, or committee explorer work.
- No DRep registration, DRep retirement, or proposal voting write flows.
- No historical metadata or previous-governance-state browsing.
- No IPFS transport implementation in this release; keep the transport interface slot reserved for a later approved phase.

---

## Requirements

- [ ] Use local `cardano-node` and `cardano-wallet` as the only sources of truth for DRep discovery and delegation status.
- [ ] Use a main-process `cardano-cli` wrapper for DRep ledger-state reads, with the renderer receiving typed payloads only through IPC.
- [ ] Capture representative `drep-state`, `drep-stake-distribution`, and `gov-state` fixtures before merging DRep query-service implementation.
- [ ] Own and expose the cardano-node socket path across the launcher lifecycle before the query service is added.
- [ ] Preserve lovelace precision end to end: parse CLI stdout with a token-preserving JSON parser, represent voting power as `BigNumber | null`, serialize IPC lovelace fields as decimal strings, and rehydrate in the renderer.
- [ ] Default directory view excludes the top 35 DReps by voting power, then shows up to the next 200 eligible DReps in randomized order.
- [ ] Eligible default-cohort DReps must be active, have expiry more than 6 epochs away, and have completed DRep anchor metadata once verified anchor metadata is available.
- [ ] The excluded top 35 and non-cohort DReps remain reachable through search/show-all filters and direct DRep ID entry.
- [ ] DRep discovery surfaces load the latest local state on entry and provide an explicit refresh control.
- [ ] DRep favorites persist across app sessions through Electron local store and are not per-wallet or synced.
- [ ] Sprint 2 local discovery renders local on-chain fields and anchor presence only; it does not render anchor-derived profile content.
- [ ] Verified anchor metadata appears only after hash verification and source labeling are in place.
- [ ] All anchor-derived content carries a verified off-chain content source label wherever it is rendered.
- [ ] DRep selector state crosses into the delegation form by prop or route parameter. `VotingStore` must not read `GovernanceStore` directly.
- [ ] Delegation submission continues through the existing software-wallet `delegateVotes` request and existing hardware-wallet signing path in `VotingStore`.
- [ ] Sprint 2 confirmation shows the DRep ID only; verified display names are added only after the verified anchor pipeline is active.
- [ ] All user-visible DRep Discovery text ships with polished en-US and ja-JP copy.
- [ ] Widen `WalletDelegation` / `WalletNextDelegation` with `voting?: WalletVotingTarget` (discriminated by `kind`) carrying a canonical `DRepIdentity` (`raw`, `cip129?`, `cip105?`, `credentialHex?`, `credentialType: 'key' | 'script'`).
- [ ] Fix the latent literal mismatch where Daedalus writes `'voting_and_delegating'` but the cardano-wallet wire emits `'delegating_and_voting'`, preserving the public `WalletDelegationStatuses.VOTING_AND_DELEGATING` export name.
- [ ] Sanitize `filterLogData` for `dRepId`, `vote`, `voting` keys and reduce the `Casted governance vote` analytics payload to `voteKind` only.
- [ ] Render a `CurrentVoteSummary` panel above the `VotingPowerDelegation` form. The panel ALWAYS renders; states are: `noDelegation` (warning + nudge), `drep` (givenName + source label + id + two links: in-app view details, external anchor URL), `abstain`, and `no_confidence`. Pre-fill form state from the current on-chain delegation (or leave empty for `noDelegation`); disable submit when the form selection matches the current delegation after canonical normalization.
- [ ] Add a five-value `currentVote` Storybook knob (`noDelegation | drepVerified | drepUnverified | abstain | noConfidence`) to every governance story (production + V1 + V2 + V3) via a pure wallet factory and `key`-based remount. Default value is `noDelegation` so the warning + nudge state is visible on first load.
- [ ] Surface a reward-withdrawal warning in the `noDelegation` state using copy grounded in CIP-1694 (rewards blocked from withdrawal until the stake credential delegates to a DRep, Abstain, or No Confidence). Daedalus must not auto-select a delegation.
- [ ] When the displayed delegation has an anchor, render the `body.givenName` field (CIP-119) and link both to (a) the in-app DRep detail route and (b) the raw anchor URL in a new browser context (`target="_blank" rel="noopener noreferrer"`).
- [ ] Use the CIP-119 test vectors as fixture provenance in stories and tests: SIPO mainnet (`https://sipo.tokyo/drep/SIPO.jsonld`), Cardano Academy preprod (`https://raw.githubusercontent.com/cardano-foundation/cardano-academy/refs/heads/main/Cardano%20Academy.jsonld`), and the canonical CIP-119 example (`https://github.com/cardano-foundation/CIPs/blob/master/CIP-0119/examples/drep.jsonld`).

---

## Acceptance Criteria

- Users can open an in-app DRep directory without visiting an external portal.
- Users can refresh DRep discovery data to the latest local state.
- Users can browse the default cohort, inspect why entries are included or excluded, and use search/show-all for all other DReps.
- Users can view DRep detail with local on-chain fields: DRep ID, registration state, active/inactive state, expiry, voting power or delegated stake, current epoch vote positions on active proposals, and anchor presence.
- Users can view verified DRep profile metadata after anchor verification succeeds, with clear source labeling and graceful absence or failure states.
- Users can favorite and unfavorite DReps, and favorites persist across app restart.
- Users can select a DRep from discovery, see the selected DRep ID in the delegation form, review it in confirmation, and submit through the existing delegation path.
- Hardware-wallet users keep the existing signing path, including on-device confirmation and failure handling.
- Query and parse failures surface as typed payloads rather than partial or misleading directory results.
- Users can complete browse -> evaluate -> select -> delegate without external portals on a synced node.
- Users see the current governance delegation (DRep id / Abstain / No Confidence) of the selected wallet without leaving the Governance page.
- Users cannot submit a vote identical to the current on-chain delegation; the server-side `same_vote` error remains the safety net.
- DRep ids, `abstain` / `no_confidence` literals, and CIP-129/CIP-105 strings appear in the renderer DOM only — never in logs, electron-store, or analytics — verified by automated spies.
- Users whose wallet has no governance delegation see a warning that staking rewards cannot be withdrawn until they delegate, and a clear CTA to choose a delegation.
- Users see the DRep's display name (CIP-119 `body.givenName`) and can open both the in-app DRep detail view and the raw anchor URL from the panel.

---

## Key Decisions

| Decision | Resolution |
|---|---|
| Scope | Full DRep Discovery flow: browse, evaluate, favorite, select, confirmation, and delegation through existing paths. |
| Artifact placement | Canonical `.agent/plans/governance/` files only. |
| Data source | Local `cardano-node` and `cardano-wallet` only. |
| Query mechanism | Main-process `cardano-cli` wrapper against the cardano-launcher-managed local node IPC endpoint. |
| Era flag | Prefer `cardano-cli latest query ...`; fall back to `conway` only if the bundled CLI lacks `latest`. |
| Socket path | Configure `nodeConfig.socketFile` pre-launch and read the launcher-resolved socket path after `node.start()`. CLI subcommands receive it through `CARDANO_NODE_SOCKET_PATH` in `spawn.env`. |
| DRep query shape | Bulk `--all-dreps` once per latest-state refresh. Per-DRep CLI invocations are forbidden for directory/detail refresh. |
| Lovelace precision | `BigNumber | null` in app models; decimal-string serialization across IPC; lossless CLI JSON parsing with `json-bigint`. |
| Default cohort | Exclude top 35 by voting power, then show up to the next 200 eligible DReps in randomized order. |
| Anchor content | Render only after hardened fetch, Blake2b-256 hash verification, immutable hash-keyed caching, parsing, and source labeling. |
| Delegation boundary | No second delegation backend. Selection only supplies a DRep ID to existing software-wallet and hardware-wallet paths. |
| Current-state boundary | No historical governance or stale anchor-content views in this release. |
| Wire status literal | Wire value is `delegating_and_voting`; the Daedalus `'voting_and_delegating'` literal is a bug fixed in Sprint 5 (constant export name preserved). |
| `ApiDRep` discrimination | Bech32 HRP of raw on-wire string: `"abstain"` / `"no_confidence"` sentinels; `drep1…` (CIP-129); `drep_vkh1…` / `drep_script1…` (CIP-105). |
| Delegation effective semantics | Per CIP-1694, vote delegation has no per-action waiting period — the newest on-chain delegation IS the current delegation. The renderer uses `delegation.active.voting` as the authoritative current state. Historical vote-delegation browsing is out of scope for v1. |
| Same-vote prevention | Client-side after canonical-form normalization; server `same_vote` error retained as authoritative safety net. |
| Storybook isolation | Each `currentVote` knob change uses a pure wallet factory and force-remounts `VotingPowerDelegation` via a React `key`. No mutation of module-level `GOVERNANCE_WALLETS`. |
| No auto-delegation | Daedalus never sets a default DRep. When a wallet has not delegated, the panel must show the CIP-1694 reward-withdrawal warning and a CTA to choose one. |
| DRep name source | CIP-119 `body.givenName` only. If the anchor has not been verified, the name is hidden and only the DRep id is shown with an unverified source label. |
| Anchor URL display | Show as an external link with `target="_blank" rel="noopener noreferrer"`. Never render the raw anchor JSON inline in the panel; the DRep detail view owns full anchor rendering. |

---

## Discovery Query Findings

The initial query-path gate has been folded into this plan as research findings rather than a separate implementation sprint.

- Production DRep discovery reads should use a singleton Electron main-process `cardano-cli` wrapper against the cardano-launcher-managed local node. The renderer receives typed IPC payloads only.
- `cardano-wallet` remains a wallet-scoped delegation/status source for this release, not a DRep directory source. The pinned `cardano-wallet` swagger for `v2026-05-11` / `c642e0779676d2567e3d5fa1e2db9f029b6398e1` exposes `PUT /v2/dreps/{drepId}/wallets/{walletId}` with `operationId: joinDRep`; no directory-wide DRep read endpoint was found.
- An Ogmios sidecar is rejected for this release because it adds another managed service, package surface, IPC/security boundary, and synchronization path while the Daedalus-managed local node can answer the required ledger reads through `cardano-cli`.
- The current flake pins `cardano-node` / `cardano-cli` to `github:IntersectMBO/cardano-node/11.0.1` at `97036a66bcf8c89f687ae57a048eecc0389977ef`, NAR hash `sha256-+dod+EL73MICgbgflyJnwDlxbCeaBbBLrr2tLX59hAA=`, and `cardano-wallet` to `github:cardano-foundation/cardano-wallet/v2026-05-11` at `c642e0779676d2567e3d5fa1e2db9f029b6398e1`, NAR hash `sha256-8Gp5/vYh01EVZ3++wCBfLOq+9roPtswQITHIsvDUGUE=`.
- The root `cardano-cli`, `cardano-node`, and `cardano-wallet` symlinks in this checkout currently resolve to an older `daedalus-cardano-bridge` output (`version` file `2025.3.31`). Refresh the Nix dev shell or bridge output before producing release fixtures.
- The locally available CLI still confirms the required command shape: `latest` and `conway` era-prefixed commands are available, `latest query` lists `drep-state`, `drep-stake-distribution`, and `gov-state`, and the DRep queries support `--all-dreps` plus `--output-json`.
- `cardano-cli latest query` documents `CARDANO_NODE_SOCKET_PATH` as the local-node socket source, and the specific query commands make `--socket-path` optional when that environment variable is set. DRep Discovery subprocesses should therefore set the socket in `spawn.env`, not pass it as user-controllable argv.
- `cardano-launcher` already supports `nodeConfig.socketFile` and exposes the launcher-resolved `node.nodeService.socketPath`; Daedalus currently does not set `socketFile` before launcher construction or expose the resolved path from `CardanoNode`, so Sprint 1 owns that prerequisite.
- No new package or flake input is required for the plan revision: `cardano-cli` comes from the `cardano-node` flake input, `bignumber.js`, `json-bigint`, `blake2b`, `blakejs`, `cardano-launcher`, `electron-store`, and Node HTTPS/DNS primitives are already present.
- Live DRep JSON fixture capture could not be completed in this session: `CARDANO_NODE_SOCKET_PATH` was unset, no `cardano-node` process was running, and the only discovered preview socket refused connection. The query-service merge remains blocked until synced-node fixtures for `drep-state`, `drep-stake-distribution`, and `gov-state` are committed under `tests/mocks/governance/`, including at least one lovelace value above `Number.MAX_SAFE_INTEGER`.

---

## Current Baseline

- Daedalus already supports software-wallet governance delegation through `PUT /v2/dreps/{dRepId}/wallets/{walletId}` in [source/renderer/app/api/voting/requests/delegateVotes.ts](../../../source/renderer/app/api/voting/requests/delegateVotes.ts).
- The hardware-wallet governance path already builds a `cast_vote` certificate in [source/renderer/app/stores/VotingStore.ts](../../../source/renderer/app/stores/VotingStore.ts).
- The existing voting governance route is mounted from [source/renderer/app/Routes.tsx](../../../source/renderer/app/Routes.tsx) and route literals live in [source/renderer/app/routes-config.ts](../../../source/renderer/app/routes-config.ts).
- Daedalus currently routes users externally for DRep discovery via localized GovTool-oriented copy in [source/renderer/app/i18n/locales/en-US.json](../../../source/renderer/app/i18n/locales/en-US.json) and [source/renderer/app/i18n/locales/ja-JP.json](../../../source/renderer/app/i18n/locales/ja-JP.json).
- No `GovernanceStore`, governance read IPC channels, main-process DRep query service, or in-app DRep directory exists yet.

## Toolchain Baseline

- `cardano-wallet`: `github:cardano-foundation/cardano-wallet/v2026-05-11` in [flake.nix](../../../flake.nix)
- `cardano-node` / `cardano-cli`: `github:IntersectMBO/cardano-node/11.0.1` in [flake.nix](../../../flake.nix)
- Current flake lock references are recorded in [flake.lock](../../../flake.lock); refresh local root tool symlinks through Nix before capturing DRep query fixtures.
- Runtime/build stack: Electron 41.3.0, React 16.14.0, MobX 5.15.7, TypeScript 4.9.5, Webpack 5.106.2, Node `>=v22.0.0`, Yarn 1.22.x in [package.json](../../../package.json)
- Already-present supporting packages: `bignumber.js@9.0.1`, `json-bigint@1.0.0`, `blake2b@2.1.3`, `blakejs@1.1.0`, and `cardano-launcher@0.20220119.0`

---

## Technical Design

### Main-Process Query Service

- Add a singleton `GovernanceQueryService` in the Electron main process.
- Use the confirmed `cardano-cli` path and call `latest query drep-state --all-dreps --output-json`, `latest query drep-stake-distribution --all-dreps --output-json`, and `latest query gov-state --output-json`.
- Read the captured node socket path from the running `CardanoNode` instance and pass it through `CARDANO_NODE_SOCKET_PATH` in `child_process.spawn` environment.
- Deduplicate in-flight refreshes and retain last-successful data only for stale-while-refresh continuity.
- Return typed failures for whole-call query errors, ranking-unavailable states, invalid DRep IDs, parse failures, and selfnode capability errors.
- Preserve large lovelace values by parsing CLI stdout with `json-bigint` in lossless mode and converting raw decimal strings into `BigNumber`.

### Shared Types And IPC

- Add shared DRep discovery types under `source/common/types/`.
- Add governance read IPC contracts in `source/common/ipc/api.ts` for DRep list, DRep detail, wallet governance status, and anchor metadata payloads when available.
- Register main-process handlers in `source/main/ipc/index.ts`.
- Add renderer IPC clients under `source/renderer/app/ipc/`, following the existing main/renderer split pattern.
- Document IPC serialization for all lovelace fields as decimal strings.

### Renderer State

- Add `GovernanceStore` and register it in [source/renderer/app/stores/index.ts](../../../source/renderer/app/stores/index.ts).
- Own DRep list, browsing detail, favorites, selected delegation target, default cohort state, search/show-all state, refresh metadata, loading states, and typed errors.
- Keep the browsing detail separate from the delegation target.
- Persist favorites through Electron local store, per device, not per wallet.
- Keep `VotingStore` independent from `GovernanceStore`; selected DRep ID crosses the boundary as a prop or route parameter.

### Discovery UX

- Add DRep directory and detail surfaces under `source/renderer/app/components/`.
- Directory columns include DRep ID, active/inactive state, expiry status, voting power, metadata status, and favorite toggle.
- Filters include active status, expiry threshold, metadata status, top-35 exclusion, default cohort, favorited, search, and show-all.
- Detail view shows local on-chain fields first and remains useful when anchor metadata is unavailable.
- Add routes for DRep directory and DRep detail if the implementation uses separate routed pages.
- Integrate a Browse DReps affordance into [source/renderer/app/components/voting/voting-governance/VotingPowerDelegation.tsx](../../../source/renderer/app/components/voting/voting-governance/VotingPowerDelegation.tsx).
- Retain direct DRep ID paste entry.

Three information-architecture paradigms have been designed and prototyped: V1 dedicated Governance section, V2 embedded selector overlay launched from `VotingPowerDelegation`, and V3 split-pane explorer. The design folder's [README](../../designs/governance/drep-discovery/README.md) recommends V1 as the only variant that cleanly absorbs the future governance surfaces flagged in the Plan Boundary, with the largest Sprint 2 cost as the acknowledged trade-off. Final variant selection is pending stakeholder review; shared tokens, copy, and component contracts are variant-agnostic.

### Anchor Metadata Pipeline

- Add a transport-agnostic main-process anchor fetch service with HTTP/HTTPS implemented and an IPFS slot reserved.
- Fetch only bounded raw bytes; do not parse JSON or write cache entries during raw fetch.
- Keep TLS verification enabled, disable redirects by default, enforce connect+total timeout <= 10 seconds, enforce about a 1 MB response cap, and allow only JSON content types.
- Add SSRF protection with DNS-rebinding mitigation by binding the validated resolved IP to the actual connection.
- Verify Blake2b-256 hash against the on-chain anchor hash before parsing, caching, or rendering.
- Cache only verified content in an immutable local cache keyed by anchor hash.
- Do not serve stale cached content when the on-chain anchor hash changes.

### Delegation Integration

- Selecting a DRep pre-fills the existing delegation form.
- Confirmation shows DRep ID in the local-only milestone.
- Confirmation may show a verified display name only after the verified anchor pipeline and source labeling are active.
- Software-wallet submission continues through the existing `delegateVotes` request.
- Hardware-wallet submission continues through the existing initialization, signing, and confirmation flow in `VotingStore`.

---

## Implementation Plan

### Sprint 1: Data Contracts, Socket Path, Query Service, And IPC

1. Define shared DRep discovery types and IPC wire contracts.
2. Own the node socket path across cardano-launcher pre-launch and post-launch lifecycle.
3. Commit synced-node DRep query fixtures before merging the main-process DRep query service.
4. Add governance IPC contracts and renderer clients.
5. Keep a per-wallet-bump API surface checklist for future cardano-wallet changes.

### Sprint 2: Store, Directory, Detail, Selector, And Local Delegation Handoff

1. Add `GovernanceStore` with DRep list, detail, favorites, selected DRep ID, filters, refresh, and error state.
2. Build DRep directory and detail components using local on-chain data only.
3. Add Browse DReps selection into the existing voting delegation UI.
4. Update confirmation to show DRep ID.
5. Persist favorites and wire routes or navigation entry points.

### Sprint 3: Internal End-To-End Integration

1. Verify local browse -> favorite -> select -> confirmation -> delegate through existing paths.
2. Run compile, lint, and manual smoke checks before anchor rendering begins.

### Sprint 4: Verified Anchor Enrichment And Release Gate

1. Add hardened raw anchor fetch service.
2. Hash-verify, cache, and parse DRep anchor metadata.
3. Render verified DRep metadata with source labels.
4. Polish localized copy and walkthroughs.
5. Add Storybook, Jest, and Cucumber coverage.
6. Complete release verification for browse -> evaluate -> select -> delegate without external portals.

### Sprint 5: Wallet Current Vote Display

This sprint extends the discovery work with an in-app current-vote panel on the existing `VotingPowerDelegation` page. It is renderer-only: no new IPC, no main-process change, no cardano-wallet pin change. It MUST land its sanitization gate before any UI surfaces the new state.

1. **Sanitization gate (BLOCKER).** Redact `dRepId` / `vote` / `voting` from `filterLogData` and reduce the `Casted governance vote` analytics payload to a `voteKind` enum.
2. **Data plumbing.** Commit `GET /v2/wallets/{id}` fixtures for `voting`, `delegating_and_voting`, abstain, and no_confidence. Fix the `'voting_and_delegating'` literal mismatch. Widen `WalletDelegation` with `voting?: WalletVotingTarget`. Add the `normalizeDRepIdentity` helper. Extract current delegation in `_createWalletFromServerData` with explicit collision rules between `delegatedStakePoolId` and `votingTarget`. Extend `Wallet` with `currentVote` / `isVoting` and add the new field to the `Wallet.update()` pick list.
3. **`CurrentVoteSummary` component.** New presentational component reusing `DRepIdDisplay`, `DRepSourceLabel`, `DRepStatusBadge`. Renders four distinct states: `noDelegation` (reward-withdrawal warning + CTA to choose a delegation), `drep` (givenName + source label + id + in-app view-details link + external anchor URL link), `abstain`, and `no_confidence`. The component never auto-selects a delegation on the user's behalf.
4. **Production flow integration.** Render `CurrentVoteSummary` above the form. Pre-fill `selectedVoteType` and `drepInputState.value` from the current on-chain delegation. Disable submit on identical-to-current after canonical normalization.
5. **Storybook stories + fixtures.** Add the five-value `currentVote` knob (`noDelegation | drepVerified | drepUnverified | abstain | noConfidence`, default `noDelegation`) with a pure wallet factory and `key`-based remount across production + V1 + V2 + V3 stories. Anchor fixtures use the CIP-119 test vectors (SIPO mainnet, Cardano Academy preprod, canonical CIP-119 example). Migrate the module-level `GOVERNANCE_WALLETS` constants in production and V2 stories to per-render `makeGovernanceWallets(option)` calls.
6. **i18n.** Add `voting.governance.currentVote.*` namespace keys in a new `CurrentVoteSummary.messages.ts` plus `voting.governance.confirmationDialog.previousVote` / `.newVote`. Run `yarn i18n:manage` and write final ja-JP copy.
7. **Tests.** Jest unit tests for mapper, `Wallet` computeds, and `CurrentVoteSummary`; Cucumber `@e2e` scenario including the HW-wallet path; sanitization regression test spying over `logger.*` and `AnalyticsTracker.sendEvent`.

---

## Testing Strategy

- Run `yarn compile`, `yarn lint`, `yarn prettier:check`, `yarn i18n:manage`, and `yarn storybook:build` for release readiness.
- Add Jest coverage for shared DRep types, lossless parsing, query-service behavior, latest-on-load and refresh behavior, default cohort ranking/randomization, anchor fetch and verification, immutable cache behavior, `GovernanceStore`, selector integration, confirmation identity display, and hardware-wallet propagation.
- Add Cucumber coverage for DRep directory browsing, refresh, search/show-all, DRep detail, verified anchor profile display, favorite persistence, selector handoff, software-wallet delegation, and mocked Ledger/Trezor delegation paths.
- Add Storybook stories for directory, detail, selector, favorite toggle, source labels, confirmation dialog states, and loading/error/empty states.
- Perform manual release validation on a synced node for the complete browse -> evaluate -> select -> delegate flow.
- For Sprint 5: cover `_createWalletFromServerData` voting mapping, `Wallet.currentVote` / `isVoting` computeds, `CurrentVoteSummary` component snapshots per knob value, the Cucumber `@e2e` governance-current-vote feature, and the sanitization regression spying over `logger.*` and `AnalyticsTracker.sendEvent`.

---

## Rollout Plan

- Treat synced-node fixture capture and socket-path ownership as hard gates before query-service merge.
- Keep Sprint 2 local-on-chain only; do not render anchor-derived metadata before fetch, verification, cache, parse, and source-labeling hardening land.
- Use the anchor-display feature flag for staged verification control, not as a permanent production off-switch.
- Release DRep Discovery only when users can complete the full in-app discovery and delegation flow without external portals.
- Treat the Sprint 5 sanitization gate (tasks task-031 + task-032 + task-052) as a hard prerequisite for any UI work that surfaces `delegation.active.voting`; no current-vote rendering ships until those land.

---

## Risks And Mitigations

| Risk | Mitigation |
|---|---|
| Node socket path is unavailable to CLI queries | Own `nodeConfig.socketFile` before launcher construction and capture the launcher-resolved path after `node.start()`. |
| Lovelace precision loss corrupts ranking | Use token-preserving JSON parsing, `BigNumber`, and decimal-string IPC serialization. |
| Query process count scales with DRep count | Use bulk `--all-dreps` queries only; forbid per-DRep CLI invocations for directory/detail refresh. |
| Ranking unavailable from stake-distribution failure | Surface typed ranking-unavailable failure instead of silently falling back to biased ordering. |
| Anchor fetch creates SSRF or TOCTOU exposure | Enforce hardened HTTP/HTTPS transport guards and DNS-rebinding mitigation. |
| Unverified metadata misleads delegation | Render anchor-derived content only after hash verification and label it as verified off-chain content. |
| Selector creates a competing delegation path | Keep selection as DRep ID handoff only; reuse existing `delegateVotes` and hardware-wallet signing paths. |
| Wallet API surface changes invalidate query rationale | Keep the per-bump swagger-grep checklist and re-open the decision if wallet adds directory-wide DRep endpoints. |
| Latent `voting_and_delegating` literal blocks all VOTING_AND_DELEGATING resolution | Sprint 5 fixes the underlying string while preserving the export name and adds a unit test asserting the constant equals the wire literal. |
| Vote target leaks into logs or analytics | Sprint 5 sanitization gate widens `filterLogData` and reduces the `Casted governance vote` payload to vote-kind only, with a Jest spy regression test in task-052. |
| Pre-fill from stale `Wallet` instance silently drops vote target after polling refresh | Sprint 5 adds `votingTarget` to the `Wallet.update()` pick list and derives the selected wallet from `selectedWalletId` against the latest snapshot. |
| Misframing vote-delegation timing as stake-pool-delegation timing | The renderer uses CIP-1694 liquid-democracy framing: the newest on-chain vote delegation IS current. Historical vote-delegation browsing remains out of scope for v1. |
| User assumes Daedalus auto-delegates | The `noDelegation` state explicitly states Daedalus will not pick a DRep and presents a CTA. Confirmed by code review: `delegateVotes` only fires from explicit form submission. |
| Anchor URL leads to malicious content | Always open in a new tab with `rel="noopener noreferrer"`. Full anchor parsing/validation happens in the DRep detail flow (Sprint 4), never inline in the current-vote panel. |

---

## Open Questions

- What is the final product definition of completed DRep metadata beyond hash verification and CIP-119 parse success?
- What exact local cache retention and pruning policy should be used for old verified DRep anchor content after it is no longer referenced by current on-chain state?
- Should a future approved phase add IPFS transport support for DRep anchors, or keep HTTP/HTTPS as the only implemented transport?
- Should DRep Discovery introduce a new top-level "Governance" nav item (V1 assumption) or rename the existing "Voting" item to "Governance" and nest current delegation under it? The latter yields cleaner long-term IA but disrupts muscle memory.
- What is the lifetime of the randomization seed for the default cohort: reseed on every refresh, reseed per app session (current proposal), or user-toggleable? This drives the randomization indicator copy in [shared-design-tokens.md](../../designs/governance/drep-discovery/shared-design-tokens.md).
- Confirm favorites remain per-device via Electron local store, accepting that wallet restore on a new machine will not carry favorites and the empty-state copy must own that expectation.

---

## References

- Companion task tracker: [governance-drep-discovery-plan-tasks.json](governance-drep-discovery-plan-tasks.json)
- Current wallet delegation request: [source/renderer/app/api/voting/requests/delegateVotes.ts](../../../source/renderer/app/api/voting/requests/delegateVotes.ts)
- Current voting delegation component: [source/renderer/app/components/voting/voting-governance/VotingPowerDelegation.tsx](../../../source/renderer/app/components/voting/voting-governance/VotingPowerDelegation.tsx)
- Current hardware governance certificate flow: [source/renderer/app/stores/VotingStore.ts](../../../source/renderer/app/stores/VotingStore.ts)
- CIP-119: https://cips.cardano.org/cip/CIP-0119
- CIP-1694: https://cips.cardano.org/cip/CIP-1694

### UX Design Artifacts

- Design folder overview, variant comparison, recommendation, and open questions: [.agent/designs/governance/drep-discovery/README.md](../../designs/governance/drep-discovery/README.md)
- External research: [.agent/designs/governance/drep-discovery/external-research.md](../../designs/governance/drep-discovery/external-research.md)
- Shared design tokens (status badges, source labels, formatting, refresh state, copy): [.agent/designs/governance/drep-discovery/shared-design-tokens.md](../../designs/governance/drep-discovery/shared-design-tokens.md)
- Variant 1 — Dedicated Governance section: [.agent/designs/governance/drep-discovery/variant-1-dedicated-section.md](../../designs/governance/drep-discovery/variant-1-dedicated-section.md)
- Variant 2 — Embedded selector overlay: [.agent/designs/governance/drep-discovery/variant-2-embedded-selector.md](../../designs/governance/drep-discovery/variant-2-embedded-selector.md)
- Variant 3 — Split-pane explorer: [.agent/designs/governance/drep-discovery/variant-3-split-pane.md](../../designs/governance/drep-discovery/variant-3-split-pane.md)

### Storybook Demos

- Variant 1 dedicated section demo: [storybook/stories/governance/V1DedicatedSection.stories.tsx](../../../storybook/stories/governance/V1DedicatedSection.stories.tsx)
- Variant 2 embedded selector demo: [storybook/stories/governance/V2EmbeddedSelector.stories.tsx](../../../storybook/stories/governance/V2EmbeddedSelector.stories.tsx)
- Variant 3 split-pane demo: [storybook/stories/governance/V3SplitPane.stories.tsx](../../../storybook/stories/governance/V3SplitPane.stories.tsx)

### Wallet Current Vote Display

- Current Vote Display tech design: [../../designs/governance/drep-discovery/current-vote-display-design.md](../../designs/governance/drep-discovery/current-vote-display-design.md)
- Current Vote Display UX spec: [../../designs/governance/drep-discovery/current-vote-display-ux.md](../../designs/governance/drep-discovery/current-vote-display-ux.md)
- Storybook current-vote mock: [../../../storybook/stories/governance/_utils/CurrentVoteMock.tsx](../../../storybook/stories/governance/_utils/CurrentVoteMock.tsx)
- CIP-1694 (liquid democracy, vote delegation semantics, reward-withdrawal gate): https://github.com/cardano-foundation/CIPs/blob/master/CIP-1694/README.md
- CIP-119 test vector spec: https://github.com/cardano-foundation/CIPs/blob/master/CIP-0119/test-vector.md
- CIP-119 canonical example (`drep.jsonld`, hash `a14a5ad4f36bddc00f92ddb39fd9ac633c0fd43f8bfa57758f9163d10ef916de`): https://github.com/cardano-foundation/CIPs/blob/master/CIP-0119/examples/drep.jsonld
- Mainnet test vector — SIPO: https://sipo.tokyo/drep/SIPO.jsonld
- Preprod test vector — Cardano Academy: https://raw.githubusercontent.com/cardano-foundation/cardano-academy/refs/heads/main/Cardano%20Academy.jsonld

---

## Changelog

### Added

- Created standalone DRep Discovery plan covering the full browse, evaluate, select, and delegate flow.
- Initial UX design package created with three flow variants (dedicated section, embedded selector, split-pane explorer), shared design tokens, external research, and Storybook stub demos.

### Changed

- Merged the discovery query gate findings into the plan and renumbered the implementation rollout from Sprint 1 through Sprint 4.
- Clarified this document and its task tracker as the standalone DRep Discovery source of truth.

---

**Status:** In Progress
**Date:** 2026-05-22
**Author:** david-profrontsolutions (ft. Github Copilot)
