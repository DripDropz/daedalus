/*
Production i18n IDs previewed here:
governance.drepDirectory.heading, governance.drepDirectory.tabs.directory,
governance.drepDirectory.tabs.favorites, governance.drepDirectory.backToDirectory,
governance.drepDirectory.searchPlaceholder, governance.drepDirectory.cohortBanner,
governance.drepDirectory.cohortBanner.showAll, governance.drepDirectory.cohortBanner.reshuffle,
governance.drepDirectory.lastUpdated, governance.drepDirectory.refresh,
governance.drepDirectory.empty.noResults, governance.drepDirectory.empty.selfnode,
governance.drepDirectory.empty.noSync, governance.drepDirectory.error.refresh,
governance.drepDirectory.error.rankingUnavailable, governance.drepDirectory.card.status.active,
governance.drepDirectory.card.status.inactive, governance.drepDirectory.card.status.expiring,
governance.drepDirectory.card.status.retired, governance.drepDirectory.card.votingPower,
governance.drepDirectory.card.viewDetails, governance.drepDirectory.card.select,
governance.drepDirectory.card.favorite.add, governance.drepDirectory.card.favorite.remove,
governance.drepDetail.sourceLabel.onchain, governance.drepDetail.sourceLabel.verified,
governance.drepDetail.sourceLabel.unverified, governance.drepDetail.sourceLabel.anchorUnavailable,
governance.voting.openExplorer, governance.drepExplorer.backToForm,
governance.delegationConfirm.hw.caption, governance.hw.disconnected,
governance.hw.locked, governance.hw.appNotOpen, governance.hw.rejected,
governance.hw.timeout, governance.drepDirectory.showAll.sortBiasWarning
*/
import React from 'react';
import { action } from '@storybook/addon-actions';
import { withState } from '@dump247/storybook-state';
import { boolean, number, select, withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import DRepIdDisplay from '../../../source/renderer/app/components/governance/_shared/DRepIdDisplay';
import DRepSourceLabel from '../../../source/renderer/app/components/governance/_shared/DRepSourceLabel';
import type {
  DRepEmptyStateVariant,
  DRepErrorVariant,
  DRepFixture,
  DRepRefreshState,
} from '../../../source/renderer/app/components/governance/_shared/fixtures';
import DRepExplorerV3 from '../../../source/renderer/app/components/voting/voting-governance/drep-explorer/DRepExplorerV3';
import type { HwDeviceStatus } from '../../../source/renderer/app/domains/Wallet';
import { HwDeviceStatuses } from '../../../source/renderer/app/domains/Wallet';
import GovernanceWrapper from './_utils/GovernanceWrapper';
import {
  CurrentVoteSummaryMock,
  currentVoteKnob,
  resolveCurrentVoteKnob,
} from './_utils/CurrentVoteMock';
import {
  DREP_FIXTURES,
  getAnchorUnavailableDRep,
  getFavoriteDReps,
  getScenarioDReps,
  getVerifiedDRep,
  refreshStateOptions,
} from './_utils/fixtures';

type PreviewControls = {
  hwDeviceStatus: HwDeviceStatus;
  refreshState: DRepRefreshState;
  showAll: boolean;
  showVerifiedAnchor: boolean;
  resultCount: number;
};

type ExplorerStoryOptions = {
  highlightedDRepId?: string | null;
  emptyState?: DRepEmptyStateVariant;
  errorState?: DRepErrorVariant;
  rankingUnavailable?: boolean;
  anchorUnavailable?: boolean;
  favoritesOnly?: boolean;
  activeFilters?: Array<string>;
  forceShowAll?: boolean;
  showSortBiasWarning?: boolean;
  defaultRefreshState?: DRepRefreshState;
};

const confirmationStyle: React.CSSProperties = {
  background: '#ffffff',
  border: '1px solid rgba(61, 78, 117, 0.16)',
  borderRadius: 6,
  color: '#1f2937',
  display: 'flex',
  flexDirection: 'column',
  gap: 16,
  margin: '0 auto',
  maxWidth: 720,
  padding: 22,
};

const messageStyle: React.CSSProperties = {
  background: 'rgba(49, 84, 163, 0.08)',
  borderRadius: 4,
  lineHeight: 1.45,
  margin: 0,
  padding: 12,
};

const drepFixtureOptions = DREP_FIXTURES.reduce<Record<string, string>>(
  (options, drep) => ({
    ...options,
    [drep.displayName]: drep.cip129,
  }),
  {}
);

const usePreviewControls = (
  defaultRefreshState: DRepRefreshState = 'idle',
  defaultHwDeviceStatus: HwDeviceStatus = HwDeviceStatuses.READY
): PreviewControls => ({
  hwDeviceStatus: select(
    'HwDeviceStatus',
    HwDeviceStatuses,
    defaultHwDeviceStatus
  ) as HwDeviceStatus,
  refreshState: select(
    'Refresh state',
    refreshStateOptions,
    defaultRefreshState
  ) as DRepRefreshState,
  showAll: boolean('Show all (include top-35)', false),
  showVerifiedAnchor: boolean('Show verified anchor (Sprint 4 preview)', false),
  resultCount: number('Result count', 187, { min: 0, max: 500, step: 1 }),
});

const getCallbacks = () => ({
  onBackToForm: action('onBackToForm'),
  onFavoriteToggle: (drep: DRepFixture) =>
    action('onFavoriteToggle')(drep.cip129),
  onHighlightDRep: (drep: DRepFixture) =>
    action('onHighlightDRep')(drep.cip129),
  onRefresh: action('onRefresh'),
  onReshuffle: action('onReshuffle'),
  onSelectDRep: (drep: DRepFixture) => action('onSelectDRep')(drep.cip129),
  onShowAll: action('onShowAll'),
});

const getErrorState = (
  refreshState: DRepRefreshState,
  override?: DRepErrorVariant
) => {
  if (override) return override;
  if (refreshState === 'failed') return 'refreshFailed';
  if (refreshState === 'rankingUnavailable') return 'rankingUnavailable';
  return undefined;
};

const renderExplorerStory = (options: ExplorerStoryOptions) =>
  withState(
    { highlightedDRepId: options.highlightedDRepId || null },
    (store) => {
      const voteState = resolveCurrentVoteKnob(
        currentVoteKnob('Current vote (mock)')
      );
      const controls = usePreviewControls(options.defaultRefreshState);
      const callbacks = getCallbacks();
      const showAll = controls.showAll || !!options.forceShowAll;
      const rows = options.emptyState
        ? []
        : getScenarioDReps({
            resultCount: controls.resultCount,
            showAll,
            showVerifiedAnchor: controls.showVerifiedAnchor,
            rankingUnavailable:
              options.rankingUnavailable ||
              controls.refreshState === 'rankingUnavailable',
            anchorUnavailable: options.anchorUnavailable,
            favoritesOnly: options.favoritesOnly,
          });

      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              width: '100%',
            }}
          >
            <div style={{ maxWidth: 560, width: '100%' }}>
              <CurrentVoteSummaryMock state={voteState} />
            </div>
          </div>
          <DRepExplorerV3
            dreps={rows.length ? rows : DREP_FIXTURES.slice(0, 8)}
            highlightedDRepId={store.state.highlightedDRepId}
            resultCount={options.emptyState ? 0 : controls.resultCount}
            refreshState={controls.refreshState}
            showAll={showAll}
            showVerifiedAnchor={controls.showVerifiedAnchor}
            activeFilters={options.activeFilters}
            favoritesOnly={options.favoritesOnly}
            emptyState={options.emptyState}
            errorState={getErrorState(controls.refreshState, options.errorState)}
            showSortBiasWarning={options.showSortBiasWarning}
            onBackToForm={callbacks.onBackToForm}
            onFavoriteToggle={callbacks.onFavoriteToggle}
            onHighlightDRep={(drep) => {
              callbacks.onHighlightDRep(drep);
              store.set({ highlightedDRepId: drep.cip129 });
            }}
            onSelectDRep={callbacks.onSelectDRep}
            onRefresh={callbacks.onRefresh}
            onShowAll={callbacks.onShowAll}
            onReshuffle={callbacks.onReshuffle}
          />
        </div>
      );
    }
  );

const getHardwareMessage = (
  status: HwDeviceStatus,
  fallback: string
): string => {
  if (status === HwDeviceStatuses.LAUNCHING_CARDANO_APP) {
    return 'Open the Cardano app on your Ledger.';
  }
  if (status === HwDeviceStatuses.VERIFYING_TRANSACTION_FAILED) {
    return 'Transaction rejected on device. No delegation was submitted.';
  }
  if (status === HwDeviceStatuses.CONNECTING_FAILED) {
    return 'No response from device. Disconnect and reconnect, then try again.';
  }
  return fallback;
};

const renderConfirmation = ({
  sprint4Preview = false,
  hardwareMessage,
  defaultHwDeviceStatus,
}: {
  sprint4Preview?: boolean;
  hardwareMessage?: string;
  defaultHwDeviceStatus?: HwDeviceStatus;
}) => {
  const voteState = resolveCurrentVoteKnob(
    currentVoteKnob('Current vote (mock)')
  );
  const controls = usePreviewControls('idle', defaultHwDeviceStatus);
  const defaultDRep = sprint4Preview ? getVerifiedDRep() : DREP_FIXTURES[0];
  const selectedDRepId = select(
    'DRep fixture',
    drepFixtureOptions,
    defaultDRep.cip129
  );
  const drep =
    DREP_FIXTURES.find((fixture) => fixture.cip129 === selectedDRepId) ||
    defaultDRep;
  const message = hardwareMessage
    ? getHardwareMessage(controls.hwDeviceStatus, hardwareMessage)
    : null;

  return (
    <div style={confirmationStyle}>
      <CurrentVoteSummaryMock state={voteState} />
      <h2 style={{ margin: 0 }}>Confirm voting-power delegation</h2>
      {sprint4Preview && drep.anchor?.verifiedName && (
        <p style={messageStyle}>
          <strong>{drep.anchor.verifiedName}</strong>{' '}
          <DRepSourceLabel type="verified" />
        </p>
      )}
      <DRepIdDisplay cip129={drep.cip129} cip105={drep.cip105} />
      <pre
        style={{ ...messageStyle, overflowWrap: 'anywhere' }}
      >{`{ vote: { type: "drep", id: "${drep.credentialHex}" } }`}</pre>
      <p style={messageStyle}>
        All three identifiers decode to the same on-chain credential — verify
        byte equality on your hardware device.
      </p>
      <DRepSourceLabel type="onchain" />
      {message && (
        <p style={messageStyle}>
          Confirm on your Ledger. The DRep ID shown on the device will match the
          ID above. Do not approve if they differ.
          <br />
          <strong>{message}</strong>
        </p>
      )}
      <button type="button" onClick={action('onClose')}>
        Close preview
      </button>
    </div>
  );
};

storiesOf('Governance / DRep Discovery (UX preview) / V3 Split Pane', module)
  .addDecorator(GovernanceWrapper)
  .addDecorator(withKnobs)
  .add(
    'V3 / Explorer — Initial (no row highlighted)',
    renderExplorerStory({ highlightedDRepId: null })
  )
  .add(
    'V3 / Explorer — Row highlighted with detail',
    renderExplorerStory({ highlightedDRepId: DREP_FIXTURES[0].cip129 })
  )
  .add(
    'V3 / Explorer — Filter rail with active filters',
    renderExplorerStory({
      highlightedDRepId: DREP_FIXTURES[1].cip129,
      activeFilters: ['active', 'has anchor'],
    })
  )
  .add(
    'V3 / Explorer — Show-all sort bias warning',
    renderExplorerStory({
      highlightedDRepId: DREP_FIXTURES[3].cip129,
      forceShowAll: true,
      showSortBiasWarning: true,
    })
  )
  .add('V3 / Explorer — Empty', renderExplorerStory({ emptyState: 'noSync' }))
  .add(
    'V3 / Explorer — No filter results',
    renderExplorerStory({
      emptyState: 'noResults',
      activeFilters: ['inactive'],
    })
  )
  .add(
    'V3 / Explorer — Ranking unavailable',
    renderExplorerStory({
      errorState: 'rankingUnavailable',
      rankingUnavailable: true,
      defaultRefreshState: 'rankingUnavailable',
    })
  )
  .add(
    'V3 / Explorer — Selfnode unsupported',
    renderExplorerStory({ emptyState: 'selfnode' })
  )
  .add(
    'V3 / Explorer — Refresh failed',
    renderExplorerStory({
      errorState: 'refreshFailed',
      defaultRefreshState: 'failed',
    })
  )
  .add(
    'V3 / Explorer — Refreshing (stale-while-refresh)',
    renderExplorerStory({ defaultRefreshState: 'refreshing' })
  )
  .add(
    'V3 / Detail — On-chain only (Sprint 2)',
    renderExplorerStory({ highlightedDRepId: DREP_FIXTURES[0].cip129 })
  )
  .add(
    'V3 / Detail — Verified anchor preview (Sprint 4)',
    renderExplorerStory({ highlightedDRepId: getVerifiedDRep().cip129 })
  )
  .add(
    'V3 / Detail — Anchor unavailable',
    renderExplorerStory({
      highlightedDRepId: getAnchorUnavailableDRep().cip129,
      anchorUnavailable: true,
    })
  )
  .add(
    'V3 / Explorer — Favorites filter with items',
    renderExplorerStory({
      highlightedDRepId: getFavoriteDReps()[0].cip129,
      favoritesOnly: true,
      activeFilters: ['favorites'],
    })
  )
  .add('V3 / Confirmation — Sprint 2 (ID only)', () => renderConfirmation({}))
  .add('V3 / Confirmation — Sprint 4 preview (verified name + IDs)', () =>
    renderConfirmation({ sprint4Preview: true })
  )
  .add('V3 / HW Confirmation — Disconnected', () =>
    renderConfirmation({
      hardwareMessage:
        'Hardware wallet disconnected. Reconnect and unlock your device to continue.',
      defaultHwDeviceStatus: HwDeviceStatuses.READY,
    })
  )
  .add('V3 / HW Confirmation — Locked', () =>
    renderConfirmation({
      hardwareMessage:
        'Device is locked. Enter your PIN on the device to continue.',
      defaultHwDeviceStatus: HwDeviceStatuses.READY,
    })
  )
  .add('V3 / HW Confirmation — App not open', () =>
    renderConfirmation({
      hardwareMessage: 'Open the Cardano app on your Ledger.',
      defaultHwDeviceStatus: HwDeviceStatuses.LAUNCHING_CARDANO_APP,
    })
  )
  .add('V3 / HW Confirmation — Rejected', () =>
    renderConfirmation({
      hardwareMessage:
        'Transaction rejected on device. No delegation was submitted.',
      defaultHwDeviceStatus: HwDeviceStatuses.VERIFYING_TRANSACTION_FAILED,
    })
  )
  .add('V3 / HW Confirmation — Timeout', () =>
    renderConfirmation({
      hardwareMessage:
        'No response from device. Disconnect and reconnect, then try again.',
      defaultHwDeviceStatus: HwDeviceStatuses.CONNECTING_FAILED,
    })
  );
