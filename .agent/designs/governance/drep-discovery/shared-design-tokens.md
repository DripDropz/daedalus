# DRep Discovery — Shared Design Tokens

These tokens are referenced by all three variants. They are intentionally framework-agnostic — each variant doc maps them onto react-polymorph components and SCSS module class names.

## 1. Status Badges

> Token names in this document are **illustrative pending design-system review**. Final names will be drawn from `source/renderer/app/themes/` once the governance theme tokens are reviewed by design; treat every `--…` symbol below as `e.g.`.

| State | Source | Label (en) | Label (ja TBD) | Light token | Dark token | Icon |
|---|---|---|---|---|---|---|
| Active | `drep-state` | Active | TBD | `--badge-success-bg` / `--badge-success-fg` | same tokens | dot |
| Inactive | `drep-state` (no votes within `drepActivity`) | Inactive | TBD | `--badge-neutral-bg` / `--badge-neutral-fg` | same | dot |
| Expiring soon (≤6 epochs) | derived | Expiring in {n} epochs | TBD | `--badge-warning-bg` / `--badge-warning-fg` | same | warning triangle |
| Retired | `drep-state` | Retired | TBD | `--badge-disabled-bg` / `--badge-disabled-fg` | same | none |
| Top-35 (search/show-all only) | derived from `drep-stake-distribution` | Excluded from default cohort | TBD | `--badge-info-bg` / `--badge-info-fg` | same | info `i` |
| Selfnode / CLI unsupported | `SelfnodeCliUnsupported` | DRep data unavailable on selfnode | TBD | `--badge-disabled-bg` | same | warning |

Contrast rule: every badge must meet **WCAG 2.1 AA 4.5:1** in both themes. Color must never be the sole indicator — pair every status with an icon **and** the textual label. Existing `_votingConfig.scss` already exposes the success/warning/neutral palette; reuse, don't redefine.

## 2. Source Labels (Sprint 4-ready)

Every rendered field gets an explicit provenance label. This is the single most important anti-misleading-content control.

| Label | When applied | Visual | Tooltip copy (en) |
|---|---|---|---|
| **On-chain** | DRep ID, registration epoch, expiry, voting power, active/inactive, vote positions | small pill, `--source-onchain-fg`, monospace `chain` icon | "Read directly from the Cardano ledger by your local node." |
| **On-chain anchor reference** | The raw anchor URL and hash pair that lives on-chain (the *reference* itself, distinct from the *content* it points to) | small pill, `--source-onchain-fg`, link-chain icon | "The anchor URL and hash recorded on-chain. Content is not fetched or verified at this label." |
| **Verified off-chain content** | Anchor-derived fields after hash verification (Sprint 4) | small pill, `--source-verified-fg`, check-shield icon | "Fetched from {host}, hash-matched the on-chain anchor hash." |
| **Unverified anchor** | Anchor *content* has been fetched but not yet hash-verified (transitional state during Sprint 4 fetch pipeline). Never applied to the raw URL/hash pair on-chain — that uses **On-chain anchor reference**. | small pill, `--source-unverified-fg`, dashed-circle icon | "Anchor content fetched but not yet hash-verified. Treat as untrusted." |
| **Anchor unavailable** | Fetch or hash check failed | small pill, `--source-warning-fg`, warning triangle | "The anchor URL could not be retrieved or did not match the on-chain hash. Off-chain profile is not shown." |

Token names follow the existing `themes/` convention (e.g., `--theme-source-onchain-color`); naming-only — actual hex deferred to theme tokens used by `staking/delegation-center/`.

## 3. Voting Power Formatting

Voting power is `BigNumber | null` (lovelace). Never `Number`.

Two rendering forms:

- **Card / table**: human-rounded ADA via existing `formattedNumber()` style, two significant figures, with explicit `₳` glyph. Examples: `₳ 1.2M`, `₳ 23M`, `₳ 688K`, `₳ 0`.
- **Detail / confirmation**: full ADA with thousands separators **and** raw lovelace on a secondary line for evaluators. Example:
  ```
  ₳ 23,137,980.123456
  (23,137,980,123,456 lovelace)
  ```

`null` voting power = ranking unavailable → render `—` with a tooltip "Stake distribution unavailable this refresh." Do **not** silently fall back to 0.

Screen-reader announcement: use the visible localized number string directly in `aria-label` (e.g., `aria-label="Voting power 23,137,980 ada"`). Card surfaces add an `aria-describedby` element with the text `"rounded display, exact value in detail view"` so SR users know the rounded card value is not the exact figure. Do **not** synthesize a number-to-words form; reuse whatever the locale-aware formatter already produces.

## 4. DRep ID Display

Always show both CIP-129 (new bech32) and CIP-105 (legacy `drep1…`) when both are derivable. In cards, show CIP-129 primary + truncated middle (e.g., `drep1yg7s…aj8ras`) with a copy button. In detail, show both forms fully, monospaced, each with its own copy button.

Copy button feedback: existing Daedalus toast / inline confirmation. Toast copy: `"DRep ID copied"`. Announce via aria-live polite.

## 5. Randomization Indicator

The default-cohort view is randomized. Users must understand this without surprise.

- Inline banner at the top of the directory: `"Default view shows up to 200 eligible DReps in randomized order, excluding the 35 largest by voting power. {ShowAllLink} or {SearchLink} to find any DRep."`
- The banner remains visible (not dismissible per-session) so refresh-induced reorder is never mysterious.
- When a filter or search is active, banner switches copy: `"Showing {n} DReps matching your filters. Default randomized order does not apply."`
- A subtle "Reshuffle" link in the banner triggers reseed for the current view without re-querying (the seed lives in `GovernanceStore`).

## 6. Refresh State

| Phase | Trigger | Visual | Time budget |
|---|---|---|---|
| Initial load | route enter, no cached state | full skeleton list | ≤700 ms before skeleton |
| Stale-while-refresh | explicit refresh or route re-enter with cached data | small spinner badge next to "Last updated {time}" timestamp, list interactive | up to 10 s |
| Timeout / failed | spawn or parse failure from `GovernanceQueryService` | inline error banner: `"Couldn't refresh DRep data. {Retry}. Showing last successful snapshot from {time}."` | banner appears at 10 s |
| Ranking unavailable (partial) | `drep-stake-distribution` failed but `drep-state` succeeded | list renders, voting-power column shows `—` with tooltip, banner: `"Voting power data unavailable this refresh. Ranking-based filters disabled."` | immediate |

The "Last updated {time}" timestamp is part of every directory variant. Format: relative ("3 minutes ago") with absolute ISO timestamp in tooltip.

## 7. Confirmation Dialog Identity

The confirmation dialog must render the DRep identity in three byte-exact, mutually consistent representations so a user (and a test harness) can verify the on-screen identity matches what the signing layer hands to the wallet and the hardware device.

Until verified anchor pipeline lands:

```
You are delegating your voting power to:
CIP-129 DRep ID:  drep1yg7svuv02gh9j2q574jv06l4xnzwyp63effljze28qe993caj8ras
CIP-105 DRep ID:  drep185r8rr6j9evjs…uutaz3        (when derivable)
Signed payload:   { vote: { type: "drep", id: "<hex credential>" } }
                  (Source: On-chain)
```

After Sprint 4 (verified anchor only):

```
You are delegating your voting power to:
{verified givenName}
CIP-129 DRep ID:  drep1yg7svuv02gh9j2q574jv06l4xnzwyp63effljze28qe993caj8ras
CIP-105 DRep ID:  drep185r8rr6j9evjs…uutaz3        (when derivable)
Signed payload:   { vote: { type: "drep", id: "<hex credential>" } }
                  (Source: On-chain · Name: Verified off-chain content)
```

Never show an unverified anchor name in the confirmation dialog — confirmation is a security surface.

**Identity equality rule (binding):** The DRep identifier displayed on the hardware device must be **byte-equal** to the identifier rendered in the confirmation dialog *and* to the `vote.id` field of the signed payload. The CIP-129 and CIP-105 strings shown to the user must both decode to the same underlying DRep credential bytes as the payload `id`.

**Acceptance criterion (HW tests):** A hardware-wallet e2e test must assert that the identifier surfaced by the device prompt is byte-equal to `vote.chosenOption` (or the equivalent field in the constructed tx body). This is a release-blocking assertion.

## 8. Hardware Wallet Confirmation

Reuse the existing on-device prompt UI from `VotingStore` hardware path. Add a permanent caption inside the dialog:

> Confirm on your {Ledger | Trezor}. The DRep ID shown on the device will match the ID above. Do not approve if they differ.

Sub-state mapping is driven by the canonical `HwDeviceStatus` enum in `source/common/types/hardware-wallets.types.ts`. The five governance-specific copy variants below cover the in-flow states a user can encounter during a DRep delegation; **long-tail device errors fall through to Daedalus's existing HW error-mapping infrastructure** (used by ADA send / pool delegation today) — do not duplicate that mapping here.

| Sub-state | `HwDeviceStatus` | Message ID | Copy |
|---|---|---|---|
| Device disconnected | `disconnected` | `governance.hw.disconnected` | "Hardware wallet disconnected. Reconnect and unlock your device to continue." |
| Device locked | `device_locked` | `governance.hw.locked` | "Device is locked. Enter your PIN on the device to continue." |
| Cardano app not open | `launching_cardano_app` / `cardano_app_not_open` | `governance.hw.appNotOpen` | "Open the Cardano app on your {Ledger}." |
| Rejected on device | `verification_rejected` | `governance.hw.rejected` | "Transaction rejected on device. No delegation was submitted." |
| Timeout | `connecting_failed` / `timeout` | `governance.hw.timeout` | "No response from device. Disconnect and reconnect, then try again." |

## 9. Microcopy Inventory (message IDs)

All variants share these IDs so `yarn i18n:manage` produces a stable set. ja-JP marked `TBD` per scope.

| ID | en source |
|---|---|
| `governance.nav.label` | Governance |
| `governance.drepDirectory.heading` | DRep directory |
| `governance.drepDirectory.tabs.directory` | Directory |
| `governance.drepDirectory.tabs.favorites` | Favorites |
| `governance.drepDirectory.backToDirectory` | Back to directory |
| `governance.drepFavorites.empty.title` | No favorites yet |
| `governance.drepFavorites.empty.body` | DReps you favorite from the directory appear here. Favorites are stored on this device only. |
| `governance.drepDirectory.searchPlaceholder` | Search by name or DRep ID |
| `governance.drepDirectory.cohortBanner` | Default view shows up to 200 eligible DReps in randomized order, excluding the 35 largest by voting power. |
| `governance.drepDirectory.cohortBanner.showAll` | Show all DReps |
| `governance.drepDirectory.cohortBanner.reshuffle` | Reshuffle order |
| `governance.drepDirectory.lastUpdated` | Last updated {time} |
| `governance.drepDirectory.refresh` | Refresh |
| `governance.drepDirectory.filter.active` | Status |
| `governance.drepDirectory.filter.metadata` | Metadata |
| `governance.drepDirectory.filter.favorited` | Favorited |
| `governance.drepDirectory.empty.noResults` | No DReps match your filters. {ClearFilters} or {ShowAll}. |
| `governance.drepDirectory.empty.selfnode` | DRep directory data is unavailable on the selfnode cluster. |
| `governance.drepDirectory.empty.noSync` | Your node is still syncing. DRep data becomes available once the node reaches the tip. |
| `governance.drepDirectory.error.refresh` | Couldn't refresh DRep data. {Retry}. Showing last successful snapshot from {time}. |
| `governance.drepDirectory.error.rankingUnavailable` | Voting power data unavailable this refresh. Ranking-based filters disabled. |
| `governance.drepDirectory.card.status.active` | Active |
| `governance.drepDirectory.card.status.inactive` | Inactive |
| `governance.drepDirectory.card.status.expiring` | Expiring in {n} epochs |
| `governance.drepDirectory.card.status.retired` | Retired |
| `governance.drepDirectory.card.votingPower` | Voting power |
| `governance.drepDirectory.card.viewDetails` | View details |
| `governance.drepDirectory.card.select` | Select for delegation |
| `governance.drepDirectory.card.favorite.add` | Add to favorites |
| `governance.drepDirectory.card.favorite.remove` | Remove from favorites |
| `governance.drepDetail.sourceLabel.onchain` | On-chain |
| `governance.drepDetail.sourceLabel.verified` | Verified off-chain content |
| `governance.drepDetail.sourceLabel.unverified` | Unverified anchor |
| `governance.drepDetail.sourceLabel.anchorUnavailable` | Anchor unavailable |
| `governance.drepDetail.copyIdToast` | DRep ID copied |
| `governance.delegationConfirm.hw.caption` | Confirm on your {device}. The DRep ID shown on the device will match the ID above. |
| `governance.hw.disconnected` | Hardware wallet disconnected. Reconnect and unlock your device to continue. |
| `governance.hw.locked` | Device is locked. Enter your PIN on the device to continue. |
| `governance.hw.appNotOpen` | Open the Cardano app on your {device}. |
| `governance.hw.rejected` | Transaction rejected on device. No delegation was submitted. |
| `governance.hw.timeout` | No response from device. Disconnect and reconnect, then try again. |

### Variant-specific extras

IDs that only exist in one variant. Listed here so `yarn i18n:manage` finds every string from a single source of truth.

| Variant | ID | en source |
|---|---|---|
| V2 | `governance.voting.browseDReps` | Browse DReps |
| V2 | `governance.drepSelector.selectAndClose` | Select & close |
| V2 | `governance.drepSelector.cancel` | Cancel |
| V2 | `governance.drepSelector.escHint` | Press Esc to cancel |
| V3 | `governance.voting.openExplorer` | Open DRep explorer |
| V3 | `governance.drepExplorer.backToForm` | Back to delegation form |
| V1/V3 | `governance.drepDirectory.showAll.sortBiasWarning` | Sorted by voting power. Default randomized order is designed to reduce popularity bias — consider returning to default for unbiased browsing. |

**JA-length risk:** The longer en-US strings — cohort banner (`governance.drepDirectory.cohortBanner`), refresh error banner (`governance.drepDirectory.error.refresh`), ranking-unavailable banner (`governance.drepDirectory.error.rankingUnavailable`), and the Show-all sort-bias warning — are expected to expand 30–60% in Japanese and German. Each surface must allow a minimum of 2 wrapped lines without truncating; in cards/banners the layout must reflow vertically rather than ellipsizing.

ja-JP source strings: **TBD** placeholders to be added during Sprint 4 polish task (per plan).

## 10. Accessibility Floor (all variants)

- **Card keyboard contract.** A DRep card is *not* itself a focusable element. The card wrapper uses `role="group"` purely to give a screen-reader a single label (`"{drepId}, {status}, voting power {amount}"`). Each card contains three real focusable child controls in this Tab order:
  1. `<button aria-pressed={isFavorite}>` — favorite toggle
  2. `<a href="…">` or `<button>` — "View details"
  3. `<button>` — "Select for delegation"

  `Enter` and `Space` activate each control with their **native** semantics (Space toggles the favorite button, Enter activates the link/buttons). No overrides, no `Shift+Enter` shortcut, no Space-on-card behavior.
- Focus ring: existing react-polymorph focus-skin tokens, no custom overrides.
- Live region: refresh state announcements (`"DRep list refreshed, 187 results"`) via `aria-live="polite"`.
- All numeric values that aren't trivially read (lovelace, voting power, expiry epochs) include an `aria-label` with human-readable form.
- Color contrast verified for both Daedalus light and dark themes in every status/source-label combination above.

## 11. DRep ID Search Semantics

Search input accepts partial and full bech32 DRep IDs across both CIP forms. Behavior:

- **Minimum prefix length: 8 characters** (after the `drep1` / CIP-129 HRP prefix). Below 8 chars the input shows the help text `"Enter at least 8 characters to search by ID"`; no IPC call is made.
- **Prefix match (≥ 8 chars, not full bech32):** returns all matches with their full DRep IDs visible in the result list. Never auto-selects, never opens detail — the user must explicitly pick a row.
- **Exact match (full bech32, valid checksum):** bypasses the result list and opens the detail view for that DRep directly.
- **Both ID forms are searched.** CIP-105 (`drep1…` legacy) and CIP-129 (new bech32) are both indexed. If the same underlying DRep credential matches via both forms, the result list **deduplicates by underlying DRep credential** (the row shows both ID forms stacked).
- **Validation before IPC.** Any input that the user submits as a full bech32 ID runs the same bech32 prefix / checksum / length checks defined in task-003 *before* `GovernanceQueryService` is called. Invalid full-form entries surface the existing "Invalid DRep ID" error and never reach the main process.
- **Verified-name search (Sprint 4 only).** Once verified `givenName` is available, search also matches names. ID search semantics above remain unchanged.
