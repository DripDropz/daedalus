/*
Production i18n IDs previewed here:
governance.nav.label, governance.drepDirectory.heading,
governance.drepDirectory.tabs.directory, governance.drepDirectory.tabs.favorites,
governance.drepDirectory.backToDirectory, governance.drepFavorites.empty.title,
governance.drepFavorites.empty.body, governance.drepDirectory.searchPlaceholder,
governance.drepDirectory.cohortBanner, governance.drepDirectory.cohortBanner.showAll,
governance.drepDirectory.cohortBanner.reshuffle, governance.drepDirectory.lastUpdated,
governance.drepDirectory.refresh, governance.drepDirectory.empty.noResults,
governance.drepDirectory.empty.selfnode, governance.drepDirectory.empty.noSync,
governance.drepDirectory.error.refresh, governance.drepDirectory.error.rankingUnavailable,
governance.drepDirectory.card.status.active, governance.drepDirectory.card.status.inactive,
governance.drepDirectory.card.status.expiring, governance.drepDirectory.card.status.retired,
governance.drepDirectory.card.votingPower, governance.drepDirectory.card.viewDetails,
governance.drepDirectory.card.select, governance.drepDirectory.card.favorite.add,
governance.drepDirectory.card.favorite.remove, governance.drepDetail.sourceLabel.onchain,
governance.drepDetail.sourceLabel.verified, governance.drepDetail.sourceLabel.unverified,
governance.drepDetail.sourceLabel.anchorUnavailable, governance.drepDetail.copyIdToast,
governance.delegationConfirm.hw.caption, governance.hw.disconnected,
governance.hw.locked, governance.hw.appNotOpen, governance.hw.rejected,
governance.hw.timeout, governance.drepDirectory.showAll.sortBiasWarning
*/
import React from 'react';
import { action } from '@storybook/addon-actions';
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
import DRepDetailV1 from '../../../source/renderer/app/components/governance/v1-dedicated/DRepDetailV1';
import DRepDirectoryV1 from '../../../source/renderer/app/components/governance/v1-dedicated/DRepDirectoryV1';
import DRepFavoritesV1 from '../../../source/renderer/app/components/governance/v1-dedicated/DRepFavoritesV1';
import GovernanceWithNavigation from '../../../source/renderer/app/components/governance/v1-dedicated/GovernanceWithNavigation';
import type { GovernanceTab } from '../../../source/renderer/app/components/governance/v1-dedicated/GovernanceWithNavigation';
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

const payloadStyle: React.CSSProperties = {
  background: 'rgba(15, 23, 42, 0.04)',
  borderRadius: 4,
  fontSize: 12,
  margin: 0,
  overflowWrap: 'anywhere',
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
  onBack: action('onBack'),
  onFavoriteToggle: (drep: DRepFixture) =>
    action('onFavoriteToggle')(drep.cip129),
  onRefresh: action('onRefresh'),
  onReshuffle: action('onReshuffle'),
  onSelectDRep: (drep: DRepFixture) => action('onSelectDRep')(drep.cip129),
  onShowAll: action('onShowAll'),
  onTabClick: (tab: GovernanceTab) => action('onTabClick')(tab),
  onViewDetails: (drep: DRepFixture) => action('onViewDetails')(drep.cip129),
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

const renderFrame = (activeTab: GovernanceTab, children: React.ReactNode) => {
  const callbacks = getCallbacks();
  return (
    <GovernanceWithNavigation
      activeTab={activeTab}
      onTabClick={callbacks.onTabClick}
    >
      {children}
    </GovernanceWithNavigation>
  );
};

const renderDirectory = ({
  emptyState,
  errorState,
  rankingUnavailable = false,
  defaultRefreshState = 'idle',
  isFilterActive = false,
  showSortBiasWarning = false,
}: {
  emptyState?: DRepEmptyStateVariant;
  errorState?: DRepErrorVariant;
  rankingUnavailable?: boolean;
  defaultRefreshState?: DRepRefreshState;
  isFilterActive?: boolean;
  showSortBiasWarning?: boolean;
}) => {
  const voteState = resolveCurrentVoteKnob(
    currentVoteKnob('Current vote (mock)')
  );
  const controls = usePreviewControls(defaultRefreshState);
  const callbacks = getCallbacks();
  const rows = emptyState
    ? []
    : getScenarioDReps({
        resultCount: controls.resultCount,
        showAll: controls.showAll,
        showVerifiedAnchor: controls.showVerifiedAnchor,
        rankingUnavailable:
          rankingUnavailable || controls.refreshState === 'rankingUnavailable',
      });

  return renderFrame(
    'directory',
    <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
          maxWidth: 960,
          width: '100%',
        }}
      >
        <CurrentVoteSummaryMock state={voteState} />
        <DRepDirectoryV1
          dreps={rows}
          resultCount={emptyState ? 0 : controls.resultCount}
          refreshState={controls.refreshState}
          showAll={controls.showAll}
          showVerifiedAnchor={controls.showVerifiedAnchor}
          emptyState={emptyState}
          errorState={getErrorState(controls.refreshState, errorState)}
          isFilterActive={isFilterActive}
          showSortBiasWarning={showSortBiasWarning}
          onFavoriteToggle={callbacks.onFavoriteToggle}
          onViewDetails={callbacks.onViewDetails}
          onSelectDRep={callbacks.onSelectDRep}
          onRefresh={callbacks.onRefresh}
          onShowAll={callbacks.onShowAll}
          onReshuffle={callbacks.onReshuffle}
        />
      </div>
    </div>
  );
};

const renderDetail = (drep: DRepFixture, forceVerifiedAnchor = false) => {
  const controls = usePreviewControls();
  const callbacks = getCallbacks();
  return renderFrame(
    'directory',
    <DRepDetailV1
      drep={drep}
      showVerifiedAnchor={forceVerifiedAnchor || controls.showVerifiedAnchor}
      onBack={callbacks.onBack}
      onFavoriteToggle={callbacks.onFavoriteToggle}
      onSelectDRep={callbacks.onSelectDRep}
    />
  );
};

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
      <p style={{ margin: 0 }}>You are delegating your voting power to:</p>
      {sprint4Preview && drep.anchor?.verifiedName && (
        <div style={messageStyle}>
          <strong>{drep.anchor.verifiedName}</strong>{' '}
          <DRepSourceLabel type="verified" />
        </div>
      )}
      <DRepIdDisplay cip129={drep.cip129} cip105={drep.cip105} />
      <pre
        style={payloadStyle}
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

storiesOf(
  'Governance / DRep Discovery (UX preview) / V1 Dedicated Section',
  module
)
  .addDecorator(GovernanceWrapper)
  .addDecorator(withKnobs)
  .add('V1 / Directory — Loaded', () => renderDirectory({}))
  .add('V1 / Directory — Empty', () =>
    renderDirectory({ emptyState: 'noSync' })
  )
  .add('V1 / Directory — No filter results', () =>
    renderDirectory({ emptyState: 'noResults', isFilterActive: true })
  )
  .add('V1 / Directory — Ranking unavailable', () =>
    renderDirectory({
      errorState: 'rankingUnavailable',
      rankingUnavailable: true,
      defaultRefreshState: 'rankingUnavailable',
    })
  )
  .add('V1 / Directory — Selfnode unsupported', () =>
    renderDirectory({ emptyState: 'selfnode' })
  )
  .add('V1 / Directory — Refresh failed', () =>
    renderDirectory({
      errorState: 'refreshFailed',
      defaultRefreshState: 'failed',
    })
  )
  .add('V1 / Directory — Refreshing (stale-while-refresh)', () =>
    renderDirectory({ defaultRefreshState: 'refreshing' })
  )
  .add('V1 / Detail — On-chain only (Sprint 2)', () =>
    renderDetail(DREP_FIXTURES[0], false)
  )
  .add('V1 / Detail — Verified anchor preview (Sprint 4)', () =>
    renderDetail(getVerifiedDRep(), true)
  )
  .add('V1 / Detail — Anchor unavailable', () =>
    renderDetail(getAnchorUnavailableDRep(), false)
  )
  .add('V1 / Favorites — With items', () => {
    const controls = usePreviewControls();
    const callbacks = getCallbacks();
    return renderFrame(
      'favorites',
      <DRepFavoritesV1
        dreps={getFavoriteDReps()}
        showVerifiedAnchor={controls.showVerifiedAnchor}
        onBackToDirectory={callbacks.onBack}
        onFavoriteToggle={callbacks.onFavoriteToggle}
        onViewDetails={callbacks.onViewDetails}
        onSelectDRep={callbacks.onSelectDRep}
      />
    );
  })
  .add('V1 / Favorites — Empty', () => {
    const controls = usePreviewControls();
    const callbacks = getCallbacks();
    return renderFrame(
      'favorites',
      <DRepFavoritesV1
        dreps={[]}
        showVerifiedAnchor={controls.showVerifiedAnchor}
        onBackToDirectory={callbacks.onBack}
        onFavoriteToggle={callbacks.onFavoriteToggle}
        onViewDetails={callbacks.onViewDetails}
        onSelectDRep={callbacks.onSelectDRep}
      />
    );
  })
  .add('V1 / Confirmation — Sprint 2 (ID only)', () => renderConfirmation({}))
  .add('V1 / Confirmation — Sprint 4 preview (verified name + IDs)', () =>
    renderConfirmation({ sprint4Preview: true })
  )
  .add('V1 / HW Confirmation — Disconnected', () =>
    renderConfirmation({
      hardwareMessage:
        'Hardware wallet disconnected. Reconnect and unlock your device to continue.',
      defaultHwDeviceStatus: HwDeviceStatuses.READY,
    })
  )
  .add('V1 / HW Confirmation — Locked', () =>
    renderConfirmation({
      hardwareMessage:
        'Device is locked. Enter your PIN on the device to continue.',
      defaultHwDeviceStatus: HwDeviceStatuses.READY,
    })
  )
  .add('V1 / HW Confirmation — App not open', () =>
    renderConfirmation({
      hardwareMessage: 'Open the Cardano app on your Ledger.',
      defaultHwDeviceStatus: HwDeviceStatuses.LAUNCHING_CARDANO_APP,
    })
  )
  .add('V1 / HW Confirmation — Rejected', () =>
    renderConfirmation({
      hardwareMessage:
        'Transaction rejected on device. No delegation was submitted.',
      defaultHwDeviceStatus: HwDeviceStatuses.VERIFYING_TRANSACTION_FAILED,
    })
  )
  .add('V1 / HW Confirmation — Timeout', () =>
    renderConfirmation({
      hardwareMessage:
        'No response from device. Disconnect and reconnect, then try again.',
      defaultHwDeviceStatus: HwDeviceStatuses.CONNECTING_FAILED,
    })
  );
