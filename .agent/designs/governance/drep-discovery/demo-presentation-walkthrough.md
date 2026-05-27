# Governance DRep Discovery Demo Presentation

This walkthrough is packaged for async sharing.

Note: the screenshots now live in this same folder as standalone PNG files, using the names referenced below.

## Recommended Demo Route

Use the same current-vote state across all screenshots for continuity:
- `Current vote (mock) = DRep — verified anchor`
- DRep shown in the summary card: `SIPO`

## Comparison Table

| Concept | Primary model | Best fit | Strengths | Tradeoffs |
| --- | --- | --- | --- | --- |
| V1 Dedicated Section | Full-page governance destination with current delegation plus directory browsing | Teams who want the clearest end-to-end governance flow | Easiest to explain, strongest information hierarchy, keeps discovery and selection in one place | Bigger product footprint than V2 and more of a destination-style experience |
| V2 Embedded Selector | Existing delegation form with an entry point into an overlay selector | Teams optimizing for minimal product disruption | Lowest-friction adoption path, preserves the current flow, adds discovery only when needed | Less spacious than V1 and less powerful than V3 for deep comparison |
| V3 Split Pane | Desktop explorer with persistent filters, result list, and detail pane | Power-user desktop browsing and side-by-side evaluation | Most capable browsing model, strongest comparison workflow, keeps detail visible while scanning results | Largest UX departure from the current form-first flow and potentially the heaviest concept to ship |

## Recommendation Framing

Use this framing in decision meetings:
- Pick `V2` if the priority is incremental change with the lowest implementation and adoption risk.
- Pick `V1` if the priority is a clear, dedicated governance experience that is easy to present and reason about.
- Pick `V3` if the priority is the richest desktop exploration experience for users comparing many DReps.

### 1. V1 Dedicated Section

Screenshot ID: `v1-dedicated-section-directory-loaded`
Screenshot file: [v1-dedicated-section-directory-loaded.png](./v1-dedicated-section-directory-loaded.png)
Story URL: `http://localhost:6007/?path=/story/governance-drep-discovery-ux-preview-v1-dedicated-section--v1-directory-loaded`
Canvas URL: `http://localhost:6007/iframe.html?id=governance-drep-discovery-ux-preview-v1-dedicated-section--v1-directory-loaded&knob-Current%20vote%20(mock)=drepVerified`

Short description:
The V1 concept uses a dedicated governance destination. The current delegation sits above the DRep directory, then the user browses ranked DRep cards with search, filters, favorites, and direct selection actions.

What to say:
- Best for a focused, full-page governance experience.
- Easy to explain because discovery and selection live in one place.
- Good fit for teams who want the clearest end-to-end browsing flow.

### 1a. V1 DRep Detail View

Screenshot ID: `v1-detail-view-verified-anchor`
Screenshot file: [v1-detail-view-verified-anchor.png](./v1-detail-view-verified-anchor.png)
Story URL: `http://localhost:6007/?path=/story/governance-drep-discovery-ux-preview-v1-dedicated-section--v1-detail-verified-anchor-preview-sprint-4`
Canvas URL: `http://localhost:6007/iframe.html?id=governance-drep-discovery-ux-preview-v1-dedicated-section--v1-detail-verified-anchor-preview-sprint-4&viewMode=story`

Short description:
This view shows how a dedicated DRep detail page could support deeper evaluation before delegation. It combines on-chain facts, anchor reference data, and richer verified off-chain profile content in one place.

What to say:
- Best screen for explaining how users can inspect a DRep before selecting them.
- Shows the strongest trust-and-verification story in the V1 flow.
- Useful when teams want to understand how identity, metadata, and selection work together.

### 2. V2 Embedded Selector Entry

Screenshot ID: `v2-embedded-selector-voting-form`
Screenshot file: [v2-embedded-selector-voting-form.png](./v2-embedded-selector-voting-form.png)
Story URL: `http://localhost:6007/?path=/story/governance-drep-discovery-ux-preview-v2-embedded-selector--v2-voting-form-with-browse-dreps-button`
Canvas URL: `http://localhost:6007/iframe.html?id=governance-drep-discovery-ux-preview-v2-embedded-selector--v2-voting-form-with-browse-dreps-button&knob-Current%20vote%20(mock)=drepVerified`

Short description:
The V2 concept keeps users inside the existing delegation form and adds a clear `Browse DReps` entry point. This is the lightest-weight change from the current flow.

What to say:
- Best for minimal product disruption.
- Keeps the delegation journey anchored in the existing form.
- Useful if the goal is incremental adoption rather than a brand-new governance surface.

### 3. V2 Embedded Selector Overlay

Screenshot ID: `v2-embedded-selector-overlay-detail`
Screenshot file: [v2-embedded-selector-overlay-detail.png](./v2-embedded-selector-overlay-detail.png)
Story URL: `http://localhost:6007/?path=/story/governance-drep-discovery-ux-preview-v2-embedded-selector--v2-selector-overlay-detail-highlighted`
Canvas URL: `http://localhost:6007/iframe.html?id=governance-drep-discovery-ux-preview-v2-embedded-selector--v2-selector-overlay-detail-highlighted&knob-Current%20vote%20(mock)=drepVerified`

Short description:
Once opened, the V2 selector overlay gives users a browsable list on the left and a highlighted DRep detail pane on the right, without taking them away from the voting form.

What to say:
- Shows richer exploration without changing the surrounding flow.
- Good compromise between discoverability and implementation containment.
- Teams can focus on whether the overlay feels powerful enough without becoming heavy.

### 4. V3 Split Pane Explorer

Screenshot ID: `v3-split-pane-row-highlighted`
Screenshot file: [v3-split-pane-row-highlighted.png](./v3-split-pane-row-highlighted.png)
Story URL: `http://localhost:6007/?path=/story/governance-drep-discovery-ux-preview-v3-split-pane--v3-explorer-row-highlighted-with-detail`
Canvas URL: `http://localhost:6007/iframe.html?id=governance-drep-discovery-ux-preview-v3-split-pane--v3-explorer-row-highlighted-with-detail&knob-Current%20vote%20(mock)=drepVerified`

Short description:
The V3 concept uses a split-pane explorer with persistent filters, a results column, and a dedicated detail pane. It is the most information-dense and desktop-native option.

What to say:
- Best for power users comparing many DReps.
- Strongest browsing and triage model.
- Most capable concept, but also the biggest UX departure from the current delegation form.

## Suggested Share Order

If you are sending this asynchronously, use this order:
1. V2 entry screen to show the lowest-friction option.
2. V2 overlay to show the richer embedded browsing model.
3. V1 dedicated page to show the full-page governance destination.
4. V3 split pane to show the most advanced desktop explorer.

If you are presenting live, use this order instead:
1. V1 dedicated page
2. V2 embedded selector
3. V3 split pane

That live order makes the concepts feel progressively more advanced.

## Optional Extra Story Links

Use these if the audience asks for edge cases or detail depth:
- V1 verified detail: `http://localhost:6007/?path=/story/governance-drep-discovery-ux-preview-v1-dedicated-section--v1-detail-verified-anchor-preview-sprint-4`
- V2 favorites tab: `http://localhost:6007/?path=/story/governance-drep-discovery-ux-preview-v2-embedded-selector--v2-selector-overlay-favorites-tab`
- V3 filter rail: `http://localhost:6007/?path=/story/governance-drep-discovery-ux-preview-v3-split-pane--v3-explorer-filter-rail-with-active-filters`

## Screenshot Index

- `v1-dedicated-section-directory-loaded`
- `v1-detail-view-verified-anchor`
- `v2-embedded-selector-voting-form`
- `v2-embedded-selector-overlay-detail`
- `v3-split-pane-row-highlighted`

## 2-Minute Presenter Talk Track

Opening:
"This walkthrough compares three ways Daedalus could help users discover and delegate to DReps. I am using the same current delegation card across each concept so the comparison stays focused on the browsing experience, not on changes in mock data."

V1 dedicated section:
"The first concept is a dedicated governance destination. Users land in a full-page directory, see their current delegation at the top, and then browse DReps with search, filters, favorites, and direct selection actions. This is the easiest concept to explain because the whole journey lives in one place."

V2 embedded selector entry:
"The second concept keeps the existing delegation form intact and adds a Browse DReps entry point. This is the lowest-friction option because it preserves the current flow and introduces discovery only when the user asks for it."

V2 embedded selector overlay:
"When the selector opens, users can browse a list and inspect a highlighted DRep without leaving the form. This gives us more discovery depth than the entry screen alone, while still keeping the experience contained inside the current delegation workflow."

V3 split pane:
"The third concept is the most capable explorer. Users get persistent filters, a browsing column, and a dedicated detail pane at the same time. This is the strongest option for comparison-heavy desktop use, but it is also the biggest departure from the current form-first flow."

Closing:
"If the goal is minimal product disruption, V2 is the safest path. If the goal is the clearest dedicated governance experience, V1 is strongest. If the goal is the richest desktop exploration model, V3 is the most powerful concept."

## Executive Telegram Draft

🏛 Quick governance discovery update

Sorry for the late-week message. We had to account for additional planning and design work after discovering that Daedalus currently has no implemented display for the wallet's current governance delegation status, so that needed to be designed before the rest of the discovery work could be framed properly.

We now have three draft directions in Storybook for DRep discovery and delegation support: V1 dedicated governance section, V2 embedded selector, and V3 split-pane explorer.

⚠️ These are all drafts. Nothing is set in stone yet, and a lot will still change once implementation begins, including interaction details, layout refinements, and all copy text.

✨ Across the options, the direction is toward better DRep discovery, clearer current delegation context, richer detail views, favorites/shortlisting, and a more guided path from browsing into delegation.

✅ Current recommendation: V1 is the strongest default direction because it is the clearest and easiest governance experience to explain end-to-end. V3 is also worth keeping in consideration if we want a more advanced desktop explorer for heavier comparison workflows.

We now have screenshots and a walkthrough prepared so we can review the concepts and align on direction before implementation starts.
