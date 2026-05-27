# Variant 1 — Dedicated Governance Section

**Paradigm:** Top-level "Governance" nav item with its own layout container and three sub-routes (Directory, Detail, Favorites). Delegation handoff via route parameter into the existing `/voting/governance` form.

## Information Architecture

```mermaid
flowchart TD
  Nav[Sidebar: Governance] --> GovRoot[/governance]
  VotingNav[Sidebar: Voting] --> Existing[/voting/governance]
  Existing -- 'Browse DReps' button --> Dir
  GovRoot --> Dir[/governance/dreps]
  GovRoot --> Detail[/governance/dreps/:drepId]
  GovRoot --> Favs[/governance/favorites]
  Dir -- Select for delegation --> Hand[Voting form pre-fill]
  Detail -- Select for delegation --> Hand
  Favs -- Select for delegation --> Hand
  Hand --> Existing
  Existing --> Confirm[Confirmation dialog]
  Confirm --> SW{Wallet type?}
  SW -- Software --> SwPwd[Spending password]
  SW -- Hardware --> HwDev[On-device confirm]
  SwPwd --> Submit[delegateVotes request]
  HwDev --> Submit2[VotingStore HW path]
```

New route literals (proposed for `routes-config.ts`):

```
GOVERNANCE: {
  ROOT: '/governance',
  DREPS: '/governance/dreps',
  DREP_DETAIL: '/governance/dreps/:drepId',
  FAVORITES: '/governance/favorites',
}
```

The existing `VOTING.GOVERNANCE = '/voting/governance'` route stays; the handoff is `history.push('/voting/governance', { selectedDrepId })` (or a query param — final shape is a Sprint 2 implementation detail captured under task-010).

**Sub-route defaults & active state:**
- `/governance` redirects to `/governance/dreps` (the Directory is the section landing page).
- The `Directory` tab is the active tab for **both** `/governance/dreps` and `/governance/dreps/:drepId` (detail view does not get its own tab).
- The `Favorites` tab is active only for `/governance/favorites`.

**Second entry point — "Browse DReps" from the voting form.** In addition to the top-level sidebar nav, the existing `VotingPowerDelegation` form gains a secondary "Browse DReps" link/button next to the DRep ID input that navigates the user to `/governance/dreps`. This is the plan-mandated second entry affordance — users who land on the voting form first should not have to learn a separate nav surface to discover the directory.

**Round-trip state preservation (binding).** Navigating out to `/governance/dreps` from `VotingPowerDelegation` must preserve the form's currently-selected wallet and vote-type. Two acceptable implementations (Sprint 2 picks one):

1. Pass form state in `history.push` location state: `history.push('/governance/dreps', { from: '/voting/governance', wallet, voteType })`. The directory remembers `from` and the "Select for delegation" handoff replays `wallet` / `voteType` when it `history.push`'es back.
2. Cache the form snapshot in `VotingStore` (e.g., `VotingStore.pendingFormState`) before navigation; restore it from the store on form re-mount.

Either way, the user must land back on `/voting/governance` with the same wallet and vote-type they had when they clicked "Browse DReps", plus the newly-selected DRep ID pre-filled. Tests must cover wallet + vote-type restoration end-to-end.

## Wireframes

### Directory route `/governance/dreps`

```
┌─ Sidebar ──┬─ Header: Governance ──────────────────────────────┐
│ Wallets    │  Directory  |  Favorites                          │
│ Staking    ├──────────────────────────────────────────────────┤
│ Voting     │  [🔄 Refresh] Last updated 3 min ago              │
│► Governance│  ╭──────────────────────────────────────────────╮ │
│ Settings   │  │ ⓘ Default view shows up to 200 eligible      │ │
│            │  │   DReps in randomized order, excluding the   │ │
│            │  │   35 largest. [Show all] · [Reshuffle]       │ │
│            │  ╰──────────────────────────────────────────────╯ │
│            │  [Search DReps by name or ID…]   [Filters ▾ (1)] │
│            │  ┌───────────────────────────────────────────────┐│
│            │  │ ☆ │ ●Active │ DRep ID drep1yg7s…aj8ras  📋   ││
│            │  │   │         │ Voting power: ₳ 688K  (on-chain)││
│            │  │   │         │ [View details]  [Select]       ││
│            │  └───────────────────────────────────────────────┘│
│            │  …repeat…                                          │
│            │  ◀  page 1 of 8  ▶                                │
└────────────┴────────────────────────────────────────────────────┘
```

### Detail route `/governance/dreps/:drepId`

```
┌─ Governance > DRep detail ────────────────────────────────────┐
│ [← Back to directory]                                          │
│                                                                │
│ {default avatar} drep1yg7s…aj8ras  📋    ☆ Favorite           │
│ (CIP-105) drep185r8rr6j9evjs…uutaz3  📋                       │
│                                                                │
│ ┌── On-chain ──────────────────────────────────────────────┐  │
│ │ Status:        ● Active                                  │  │
│ │ Expires in:    34 epochs                                 │  │
│ │ Voting power:  ₳ 688,964.12                              │  │
│ │                (688,964,123,456 lovelace)                │  │
│ │ Registered:    epoch 502                                 │  │
│ │ Current votes: 2 Yes · 1 No · 0 Abstain (this epoch)     │  │
│ └──────────────────────────────────────────────────────────┘  │
│                                                                │
│ ┌── Anchor ────────────────────────────────────────────────┐  │
│ │ Anchor URL:    https://example.org/drep.json   (present) │  │
│ │ Anchor digest: b5e2…f3a1                                 │  │
│ │ Status:        Unverified anchor (Sprint 4 will fetch    │  │
│ │                and verify off-chain profile)             │  │
│ └──────────────────────────────────────────────────────────┘  │
│                                                                │
│ [Select for delegation]                                        │
└────────────────────────────────────────────────────────────────┘
```

### Favorites route `/governance/favorites`

Same card layout as Directory, but cohort banner replaced with: `"{n} DReps you've favorited. Favorites are stored on this device only."` Empty state: prominent illustration + copy + CTA back to Directory.

## Interaction Sequence (HW Wallet Happy Path)

```mermaid
sequenceDiagram
  participant U as User
  participant Dir as Directory
  participant Store as GovernanceStore
  participant Det as Detail
  participant Form as VotingPowerDelegation
  participant VS as VotingStore (HW)
  participant Dev as Hardware device

  U->>Dir: Open /governance/dreps
  Dir->>Store: ensureLoaded()
  Store-->>Dir: cohort + last-updated
  U->>Dir: Click "View details" on DRep X
  Dir->>Det: navigate /governance/dreps/X
  Det->>Store: getDetail(X)
  Store-->>Det: on-chain fields + anchor presence
  U->>Det: Click "Select for delegation"
  Det->>Form: navigate /voting/governance with drepId=X
  Form->>Form: pre-fill DRep input, validate
  U->>Form: Confirm wallet + submit
  Form->>VS: initialize HW delegation tx
  VS->>Dev: show DRep ID for confirmation
  Dev-->>U: prompt: confirm X
  U->>Dev: approve
  Dev-->>VS: signed witness
  VS-->>Form: success
  Form-->>U: success screen
```

## Component Hierarchy

Following existing convention (`source/renderer/app/components/<area>/<sub>/`):

```
components/voting/voting-governance/
  VotingPowerDelegation.tsx              ← *modify existing*: add "Browse DReps" link/button next to DRep ID input, wire to /governance/dreps with form-state preservation per IA section above

components/governance/
  layouts/
    GovernanceWithNavigation.tsx          ← analog of StakingWithNavigation
    GovernanceWithNavigation.scss
  drep-directory/
    DRepDirectory.tsx                     ← page container
    DRepDirectory.scss
    DRepDirectoryBanner.tsx               ← randomization + show-all banner
    DRepDirectoryFilters.tsx              ← filter dropdown
    DRepDirectorySearch.tsx
    DRepDirectoryList.tsx                 ← card list (mobile/dense)
    DRepDirectoryTable.tsx                ← table view (large screens, parity w/ StakePoolsTable)
    DRepCard.tsx                          ← single result, used by list + favorites
    DRepCard.scss
    DRepStatusBadge.tsx                   ← per shared tokens §1
    DRepSourceLabel.tsx                   ← per shared tokens §2
    DRepIdDisplay.tsx                     ← dual-ID + copy
    DRepRefreshIndicator.tsx              ← last-updated + spinner
    helpers.ts                            ← filter/sort helpers analog to stake-pools/helpers.ts
  drep-detail/
    DRepDetail.tsx
    DRepDetail.scss
    DRepDetailOnchainSection.tsx
    DRepDetailAnchorSection.tsx           ← shows "unverified anchor" Sprint 2; verified content Sprint 4
    DRepDetailActions.tsx                 ← favorite + select-for-delegation
  drep-favorites/
    DRepFavorites.tsx
    DRepFavorites.scss
    DRepFavoritesEmptyState.tsx
  shared/
    DRepEmptyState.tsx                    ← noResults | selfnode | noSync variants
    DRepErrorBanner.tsx                   ← refresh failed | ranking unavailable
```

Container components (MobX `@observer`) live under `containers/governance/` mirroring the per-page structure.

## State / Empty / Loading / Error Treatments

| Scenario | Treatment |
|---|---|
| First load, no cached data | Full skeleton list, banner visible, refresh button disabled |
| First load completed, default cohort | List rendered, banner visible, "Last updated just now" |
| Refresh in flight, cached data present | Spinner badge next to timestamp, list still interactive |
| Refresh failed (timeout/parse) | `DRepErrorBanner` at top; cached list still shown; explicit retry |
| Ranking unavailable | List shown, voting-power column `—`, banner with `error.rankingUnavailable` |
| Selfnode CLI unsupported | Replace list area with `DRepEmptyState selfnode` |
| Node syncing | Replace list area with `DRepEmptyState noSync` |
| No filter results | List area shows `DRepEmptyState noResults` with `Clear filters` and `Show all` actions |
| Favorites empty | `DRepFavoritesEmptyState` with CTA back to Directory |
| DRep detail load failure | Inline error in main pane; "Back to directory" link |

## Anchor Source-Labelling Treatment (Sprint 4-ready)

`DRepDetailAnchorSection` always rendered. In Sprint 2 it shows only:

- Anchor URL (raw, no fetch)
- Anchor digest (truncated, copy button)
- Status badge: `Unverified anchor` (per shared tokens §2)

In Sprint 4, after `GovernanceQueryService` + anchor fetch verify the content, the section adds a child `DRepDetailAnchorContent` rendering `givenName`, `image`, `objectives`, `motivations`, `qualifications`, `references[Link|Identity]`, `paymentAddress`. Each rendered field carries the `Verified off-chain content` label. `DRepCard` does **not** render verified anchor content even in Sprint 4 (cards stay on-chain-only) — the Sprint 4 enrichment surfaces in detail and favorites only.

## Default-Cohort UX

- Banner copy (shared tokens §5) is sticky at the top of the directory list.
- "Excluded from default cohort" badge appears on any top-35 DRep when it surfaces via search or show-all.
- Default cohort is randomized; the seed is held in `GovernanceStore` and persists for the app session. "Reshuffle" reseeds without re-querying.
- Filtering or searching switches the banner copy to remove the randomization claim.

## Filter / Search — Show-All Without Re-introducing Bias

`Show all` toggles the cohort to "all eligible + top-35". When `Show all` is active, sort options become available (default still `randomized`; user can pick `voting power desc`, `voting power asc`, `expiry asc`). Sort is opt-in only; the user must make an explicit choice. This preserves anti-bias intent while letting power users find specific large DReps.

**Popularity-sort guardrail.** When the user activates the `voting power desc` sort under Show-all, an inline disclosure appears directly above the list (message ID `governance.drepDirectory.showAll.sortBiasWarning`):

> "Sorted by voting power. Default randomized order is designed to reduce popularity bias — consider returning to default for unbiased browsing."

The disclosure dismisses with the same user action that returns to default sort. Dismissal is not persisted — re-activating `voting power desc` shows it again.

Search is always available regardless of cohort and applies fuzzy match on DRep ID prefix (Sprint 2) and on verified `givenName` (Sprint 4). Search results are sorted by relevance only.

## Hardware Wallet Confirmation

Handed off to existing `VotingPowerDelegation` confirmation. Variant 1 adds nothing new to the HW flow; it inherits everything from shared tokens §7 (identity equality rule — CIP-129 + CIP-105 + signed payload all byte-equal) and §8 (HW sub-states). The only V1-specific concern: after a successful delegation, the user lands back on the voting confirmation screen; from there `View DRep in directory` link returns to `/governance/dreps/:drepId` to inspect ongoing state.

## Accessibility

- `GovernanceWithNavigation` mirrors `StakingWithNavigation` keyboard pattern: arrow keys cycle sub-nav, `Enter` activates.
- Directory list: each card is a `<article>` with `role="group"` and ARIA label "{drepId}, {status}, voting power {amount}".
- Banner is a `<section aria-labelledby="cohort-heading">` with a visually hidden heading so SR users get explicit context.
- Focus management on detail navigation: focus moves to the back-link, then primary heading.
- All status/source visual cues are paired with icon + text (color is decorative).

## Pros / Cons / Risks vs Other Variants

**Pros**
- Cleanest IA for future governance surfaces (proposals, constitution, dashboard).
- Each sub-surface gets its own URL → deep-link from notifications/docs is natural.
- Largest screen real estate for detail → best fit for Sprint 4 anchor content.

**Cons**
- Adds a new top-level nav item; largest Sprint 2 visual change.
- Most i18n surface area (three pages + nav label).

**Risks**
- New top-level nav requires sidebar layout/test updates; e2e snapshots may need refresh.
- "Governance" vs "Voting" labeling collision: existing `voting/governance` route stays but the new nav item is also "Governance" — needs final naming decision (see README open question #1).

## Implementation Effort Delta vs Sprint 2 Baseline

Tasks referenced: task-008 (directory components), task-009 (detail), task-010 (selector integration), task-013 (routes/nav wiring).

| Δ | Reason |
|---|---|
| +6–8h | `GovernanceWithNavigation` layout container + tests |
| +2–3h | New top-level sidebar entry + active-state logic + a11y |
| +3–4h | Three sub-routes wiring + deep-link state preservation |
| +1–2h | Extra i18n IDs (nav label, page titles, breadcrumbs) |
| **Total ~12–17h on top of baseline** | |
