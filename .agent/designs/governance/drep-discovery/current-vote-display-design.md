# Governance — Current Vote Display Design

**Path:** `.agent/designs/governance/drep-discovery/current-vote-display-design.md`
**Status:** draft, merged into Governance DRep Discovery Sprint 5
**Plan:** [../../../plans/governance/governance-drep-discovery-plan.md](../../../plans/governance/governance-drep-discovery-plan.md) (Sprint 5)
**Tasks:** [../../../plans/governance/governance-drep-discovery-plan-tasks.json](../../../plans/governance/governance-drep-discovery-plan-tasks.json) (task-031..task-052)
**UX:** [current-vote-display-ux.md](./current-vote-display-ux.md)

---

## 1. Overview

This design realises the renderer-only Current Vote Display feature defined by the companion plan. It parses the existing `cardano-wallet v2026-05-11` `delegation.active.voting` field, exposes the selected wallet's current governance delegation on the `Wallet` domain model, renders a new `CurrentVoteSummary` above the existing `VotingPowerDelegation` form, pre-fills the form from the current on-chain delegation, and blocks identical re-submissions client-side.

No new IPC channel, no new cardano-wallet endpoint, no signing-path change, and no `WalletsStore` polling change are introduced. A blocking sanitization step (task-031, task-032) widens `filterLogData` and reduces the `Casted governance vote` analytics payload to `{ voteKind }` before any vote target ever leaves the renderer DOM.

## 2. Goals / Non-Goals

### Goals

- Single discriminated union (`WalletVotingTarget` with `kind` tag) for DRep / Abstain / No Confidence delegations, with normalized DRep id forms (`cip129`, `cip105`, `credentialHex`) suitable for the existing `DRepIdDisplay`.
- Mapper in `_createWalletFromServerData` with explicit collision rules between `delegatedStakePoolId` (pool) and `votingTarget` (DRep / sentinel) for the four `delegation.status` values.
- CIP-1694 liquid-democracy semantics: the newest on-chain vote delegation is the current delegation; there is no multi-epoch waiting period like stake-pool delegation.
- A four-state `CurrentVoteSummary`: `noDelegation`, `drep`, `abstain`, and `no_confidence`.
- CIP-119 anchor metadata affordances in the DRep state: display `body.givenName`, link to the in-app detail route, and link to the raw anchor URL externally.
- Storybook: pure `makeGovernanceWallets(option)` factory + `GovernanceWrapper` `key`-derivation rule, with V2's module-level mutable `GOVERNANCE_WALLETS` retired.

### Non-Goals

- No new IPC channel, no new main-process logic.
- No raw anchor JSON rendering inside the current-vote panel; full anchor rendering remains owned by DRep detail.
- No `cardano-wallet` / `cardano-node` / `cardano-launcher` pin change.
- No new analytics event id; the existing `Casted governance vote` event is modified in payload only.
- No change to the signing path inside `VotingStore.delegateVotes` or the hardware-wallet gating in `VotingPowerDelegationConfirmationDialog`.

## 3. CIP-1694 timing semantics

Vote delegation is liquid. v1 surfaces only the current on-chain delegation from `delegation.active.voting`; in-flight ratification handling is deferred.

## 4. Process boundary map

| Concern | Process | Justification |
|---|---|---|
| `delegation.active.voting` parsing | **renderer** (`source/renderer/app/api/api.ts`) | The wallet REST response is already consumed in the renderer; no secret material involved. |
| `normalizeDRepIdentity` (bech32 <-> credential hex) | **renderer** (`source/renderer/app/utils/governance/`) | Pure deterministic function over a public on-chain id; no privileged primitives. |
| `Wallet.currentVote` / `isVoting` computeds | **renderer** (`source/renderer/app/domains/Wallet.ts`) | MobX domain model lives in the renderer. |
| `filterLogData` widening | **shared** (`source/common/utils/logging.ts`) | The same helper runs in both main and renderer; widening once covers all log call sites. |
| Existing `delegateVotes` tx build / sign / submit | **renderer -> main -> cardano-wallet** | Unchanged. This design touches only the pre-tx UI; key handling and hardware-wallet signing paths are untouched. |

No new IPC channels and no new main-side handlers are introduced; therefore no `source/main/ipc/<name>.ts` / `source/renderer/app/ipc/<name>.ts` pair, no preload allow-list change.

## 5. State machine (4 states)

### `noDelegation`

The wallet has not delegated its voting power to a DRep, Abstain, or No Confidence. The panel always renders, shows a CIP-1694 reward-withdrawal warning, states that Daedalus will not pick a DRep automatically, and presents a primary CTA to choose a delegation. The form remains blank until the user explicitly chooses a target.

### `drep`

The wallet currently delegates voting power to a DRep. The panel shows `body.givenName` when the anchor is verified, the DRep source label, the compact CIP-129/CIP-105 id pair, an in-app "View details" link, and an external "Anchor metadata" link. If the anchor has not been verified, the production component hides the name and shows only the id with an unverified source label.

### `abstain`

The wallet currently delegates to the predefined Abstain voting option. The panel renders the existing single-badge treatment plus a caption explaining that the stake is recorded on chain as not participating in governance and rewards can be withdrawn.

### `no_confidence`

The wallet currently delegates to the predefined No Confidence voting option. The panel renders the existing single-badge treatment plus a caption explaining that the stake counts as Yes on every motion of no-confidence and rewards can be withdrawn.

## 6. Data model

### 6.1 Final TypeScript shapes

```ts
export type DelegationStatus =
  | 'not_delegating'
  | 'delegating'
  | 'voting'
  | 'delegating_and_voting';

export type DRepIdentity = {
  raw: string;
  cip129?: string;
  cip105?: string;
  credentialHex?: string;
  credentialType: 'key' | 'script';
  givenName?: string;
  anchorUrl?: string;
};

export type WalletVotingTarget =
  | { kind: 'drep'; drep: DRepIdentity; source: 'verified' | 'unverified' | 'onchain' }
  | { kind: 'abstain' }
  | { kind: 'no_confidence' };

```

`credentialType` is set from the HRP detected during normalization: `drep1...` and `drep_vkh1...` -> `'key'`; `drep_script1...` -> `'script'`. The same-vote comparator must compare `credentialType` AND credential bytes, or canonical CIP-129 string including the type-byte header, never bytes alone.

`WalletDelegationStatuses.VOTING_AND_DELEGATING` remains the constant name; its string value is corrected to `'delegating_and_voting'`. A unit test pins `WalletDelegationStatuses.VOTING_AND_DELEGATING === 'delegating_and_voting'`.

### 6.2 `ApiDRep` (bech32 prefix) -> `WalletVotingTarget`

| `ApiDRep` raw string | HRP | Resulting `WalletVotingTarget.kind` | `DRepIdentity` fields populated |
|---|---|---|---|
| `"abstain"` | - | `'abstain'` | n/a |
| `"no_confidence"` | - | `'no_confidence'` | n/a |
| `drep1...` | `drep` (CIP-129) | `'drep'` | `raw`, `cip129 = raw`, derived `cip105`, `credentialHex`, `credentialType` |
| `drep_vkh1...` | `drep_vkh` (CIP-105 key hash) | `'drep'` | `raw`, `cip105 = raw`, derived `cip129`, `credentialHex`, `credentialType = 'key'` |
| `drep_script1...` | `drep_script` (CIP-105 script hash) | `'drep'` | `raw`, `cip105 = raw`, derived `cip129`, `credentialHex`, `credentialType = 'script'` |
| anything else | - | parser returns `null`; mapper logs sanitized warning and treats wallet as if `voting === undefined` | n/a |

### 6.3 Storage / serialization

- `WalletVotingTarget` is held in memory only on the MobX `Wallet` instance. It is not persisted to `electron-store`, never appears in IPC payloads, and is never accepted as user input.
- `DRepIdentity.raw` and `credentialType` are required; the rest are derived or hydrated from verified CIP-119 anchor metadata.
- Historical vote-delegation browsing is not represented in v1.

## 7. Mapper rules — `_createWalletFromServerData` (task-037)

Pseudocode for the branch inside [source/renderer/app/api/api.ts](../../../../source/renderer/app/api/api.ts) `_createWalletFromServerData`:

```ts
const parseVoting = (v: ApiDRep | undefined): WalletVotingTarget | null => {
  if (v == null) return null;
  if (v === 'abstain') return { kind: 'abstain' };
  if (v === 'no_confidence') return { kind: 'no_confidence' };
  const drep = normalizeDRepIdentity(v);
  return drep ? { kind: 'drep', drep, source: 'onchain' } : null;
};

switch (delegation.active.status) {
  case 'voting':
    delegatedStakePoolId = null;
    votingTarget = parseVoting(delegation.active.voting);
    break;
  case 'delegating_and_voting':
    delegatedStakePoolId = delegation.active.target ?? null;
    votingTarget = parseVoting(delegation.active.voting);
    break;
  case 'delegating':
  case 'not_delegating':
  default:
    delegatedStakePoolId = delegation.active.target ?? null;
    votingTarget = null;
    break;
}
```

The mapper uses `delegation.active.voting` as the authoritative current state. Historical vote-delegation browsing and in-flight ratification nuance are deferred beyond v1.

## 8. Normalizer design — `normalizeDRepIdentity` (task-036)

New module: `source/renderer/app/utils/governance/normalizeDRepIdentity.ts`.

```ts
export function normalizeDRepIdentity(raw: string): DRepIdentity | null;
```

Algorithm summary:

1. Run `bech32.decode(raw)` with the HRP preserved. Do not use helpers that discard the HRP; the normalizer must branch on `drep`, `drep_vkh`, and `drep_script`.
2. For CIP-129 `drep1...`, strip the header byte, derive credential type (`0x22` key, `0x23` script), credential hex, and CIP-105 form.
3. For CIP-105 `drep_vkh1...` or `drep_script1...`, derive the CIP-129 form with the correct header byte.
4. Reject any other HRP, length mismatch, or bech32-decode failure by returning `null`. If a warning is logged, it may include HRP only, never the raw DRep id.

Round-trip unit tests cover key and script DReps, cross-form conversion, and invalid input. Reuse an existing bech32 helper from the renderer bundle; do not add a new direct dependency.

## 9. Component hierarchy

### 9.1 New: `CurrentVoteSummary` (task-039)

Location: `source/renderer/app/components/voting/voting-governance/CurrentVoteSummary.tsx` (+ `.scss` module).

```ts
type CurrentVoteSummaryProps = {
  currentVote: WalletVotingTarget | null;
};
```

Rendering rules:

- `currentVote == null` -> `noDelegation` panel with reward-withdrawal warning, Daedalus-does-not-auto-delegate subline, and "Choose a delegation" CTA.
- `currentVote.kind === 'drep'` -> current delegation card with DRep name, source label, compact id display, in-app details link, and anchor URL link.
- `currentVote.kind === 'abstain'` -> single Abstain badge plus rewards-withdrawable caption.
- `currentVote.kind === 'no_confidence'` -> single No Confidence badge plus rewards-withdrawable caption.

### Anchor metadata display

The panel shows the CIP-119 `body.givenName` only after anchor verification succeeds. It links to the in-app DRep detail route and to the raw anchor URL with `target="_blank" rel="noopener noreferrer"`. The panel never inline-renders the full JSON; DRep detail owns full anchor rendering, transport hardening, parsing, and trust explanations.

### 9.2 Modified: `VotingPowerDelegation` (task-041, task-042, task-043)

| Concern | Change |
|---|---|
| Pre-fill | On wallet selection / wallet change, seed `state.selectedVoteType` and `drepInputState.value` from `wallet.currentVote`. `noDelegation` keeps the blank form state. |
| Render summary | Render `<CurrentVoteSummary>` above the existing form for every selected wallet. |
| Same-vote disable | Compute `isSameAsCurrent = canonicallyEqual(selection, currentVote)` using `normalizeDRepIdentity` on the user input and on the stored target. Add it to `submitButtonDisabled`. |
| Reset behaviour | The existing `WalletsDropdown.onChange` reset must respect the current-on-chain fallback. |

`VotingPowerDelegation` MUST NOT cache the selected `Wallet` object instance in local React state. Daedalus's `Request.ts` replaces the wallets array contents with fresh `Wallet` instances on every poll, so a stale React-state reference will show stale `currentVote`.

### 9.3 Modified: `VotingPowerDelegationConfirmationDialog` (task-045)

- No new historical comparison props are introduced in v1.
- The hardware-wallet gating block remains unchanged. Disconnected / locked / app-not-open states are unaffected.

## 10. Storybook architecture (task-046 - task-048)

```ts
type CurrentVoteOption =
  | 'noDelegation'
  | 'drepVerified'
  | 'drepUnverified'
  | 'abstain'
  | 'noConfidence';
```

Contract:

- Returns a freshly constructed `Wallet[]` on every call. No memoization, no module-level cache, no mutation of any pre-existing `Wallet` instance.
- `noDelegation` is the default and renders the warning + nudge state on first load.
- DRep fixtures use CIP-119 test-vector provenance: SIPO mainnet, Cardano Academy preprod, and the canonical CIP-119 example.
- The selected option is fed as `key={option}` into `VotingPowerDelegation` so local form state cannot leak across knob changes.

## 11. Sanitization design (task-031, task-032, task-052)

Add the flat keys `dRepId`, `vote`, and `voting` to the existing redaction list in [source/common/utils/logging.ts](../../../../source/common/utils/logging.ts) (`filterLogData`). Daedalus's `filterLogData` uses `omit-deep-lodash` with a flat key list; redaction by key name recurses at any depth and covers `delegation.active.voting`, `delegation.next[*].voting`, and `certificates[*].vote` once those flat keys are added.

The existing `Casted governance vote` event in [source/renderer/app/stores/VotingStore.ts](../../../../source/renderer/app/stores/VotingStore.ts) is reduced to vote kind only:

```ts
analyticsTracker.sendEvent(
  EventCategories.VOTING,
  'Casted governance vote',
  voteKind,
);
```

Event id and category are unchanged. This is a schema break for any Matomo dashboard that filters on the event action field; task-032 owns the CHANGELOG note.

## 12. Testing strategy (task-050, task-051, task-052)

| Layer | Coverage | Files |
|---|---|---|
| Unit - mapper | All four `status` branches + `voting`-only wallet asserts `delegatedStakePoolId === null` | `tests/jest/api/createWalletFromServerData.test.ts` |
| Unit - normalizer | `drep1` / `drep_vkh1` / `drep_script1` round-trips; invalid bech32 -> `null` | colocated with `normalizeDRepIdentity.ts` |
| Unit - Wallet computeds | `currentVote`, `isVoting` per `kind` plus null cases | `source/renderer/app/domains/__tests__/Wallet.test.ts` |
| Component - snapshot | `CurrentVoteSummary` snapshot per five `currentVote` knob values x en-US / ja-JP | colocated with component |
| Cucumber `@e2e` | Software + hardware-wallet paths include noDelegation, DRep, Abstain, No Confidence, same-vote prevention, and leak assertions | `tests/voting/features/governance-current-vote.feature` |
| Sanitization regression | `filterLogData` + injected `AnalyticsTracker.sendEvent` spy assertions; `same_vote` safety net reachability | `tests/jest/security/voting-sanitization.test.ts` |

## 13. Risks

1. **bech32 conversion edge cases.** `drep_script1` script hashes use header byte `0x23` in CIP-129; getting this byte wrong silently breaks the same-vote comparator for script DReps. Mitigation: round-trip unit tests for both `0x22` and `0x23` plus fixture coverage.
2. **Vote-delegation timing misframed as stake-pool timing.** Mitigation: `CurrentVoteSummary` names the newest on-chain target as current and keeps ratification nuance out of v1.
3. **User assumes Daedalus chooses automatically.** Mitigation: `noDelegation` explicitly states Daedalus will not pick a DRep and presents a CTA.
4. **Anchor URL leads to malicious content.** Mitigation: open with `rel="noopener noreferrer"`; full anchor parsing and verification stays in DRep detail.
5. **Future log call sites bypassing `filterLogData`.** Mitigation: sanitization regression tests and reviewer checklist for any logger or analytics call touching wallet records.

## 14. References

- Current Vote Display UX spec: [current-vote-display-ux.md](./current-vote-display-ux.md)
- Governance DRep Discovery plan: [../../../plans/governance/governance-drep-discovery-plan.md](../../../plans/governance/governance-drep-discovery-plan.md)
- Storybook current-vote mock: [../../../../storybook/stories/governance/_utils/CurrentVoteMock.tsx](../../../../storybook/stories/governance/_utils/CurrentVoteMock.tsx)
- CIP-1694 (liquid democracy, vote delegation semantics, reward-withdrawal gate): https://github.com/cardano-foundation/CIPs/blob/master/CIP-1694/README.md
- CIP-119 test vector spec: https://github.com/cardano-foundation/CIPs/blob/master/CIP-0119/test-vector.md
- CIP-119 canonical example (`drep.jsonld`): https://github.com/cardano-foundation/CIPs/blob/master/CIP-0119/examples/drep.jsonld
- Mainnet test vector — SIPO: https://sipo.tokyo/drep/SIPO.jsonld
- Preprod test vector — Cardano Academy: https://raw.githubusercontent.com/cardano-foundation/cardano-academy/refs/heads/main/Cardano%20Academy.jsonld
