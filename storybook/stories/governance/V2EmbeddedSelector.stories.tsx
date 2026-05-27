/*
Production i18n IDs previewed here:
governance.drepDirectory.heading, governance.drepDirectory.tabs.directory,
governance.drepDirectory.tabs.favorites, governance.drepDirectory.searchPlaceholder,
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
governance.drepDetail.sourceLabel.anchorUnavailable, governance.voting.browseDReps,
governance.drepSelector.selectAndClose, governance.drepSelector.cancel,
governance.drepSelector.escHint, governance.delegationConfirm.hw.caption,
governance.hw.disconnected, governance.hw.locked, governance.hw.appNotOpen,
governance.hw.rejected, governance.hw.timeout
*/
import React from 'react';
import { action } from '@storybook/addon-actions';
import { withState } from '@dump247/storybook-state';
import { boolean, number, select, withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import BigNumber from 'bignumber.js';
import DRepIdDisplay from '../../../source/renderer/app/components/governance/_shared/DRepIdDisplay';
import DRepSourceLabel from '../../../source/renderer/app/components/governance/_shared/DRepSourceLabel';
import type {
  DRepEmptyStateVariant,
  DRepErrorVariant,
  DRepFixture,
  DRepRefreshState,
} from '../../../source/renderer/app/components/governance/_shared/fixtures';
import DRepSelectorOverlayV2 from '../../../source/renderer/app/components/voting/voting-governance/drep-selector/DRepSelectorOverlayV2';
import type { DRepSelectorTab } from '../../../source/renderer/app/components/voting/voting-governance/drep-selector/DRepSelectorOverlayV2';
import VotingPowerDelegationWithSelectorDemo from '../../../source/renderer/app/components/voting/voting-governance/drep-selector/VotingPowerDelegationWithSelectorDemo';
import VotingPowerDelegation from '../../../source/renderer/app/components/voting/voting-governance/VotingPowerDelegation';
import STAKE_POOLS from '../../../source/renderer/app/config/stakingStakePools.dummy.json';
import Wallet, {
  HwDeviceStatus,
  HwDeviceStatuses,
  WalletSyncStateStatuses,
} from '../../../source/renderer/app/domains/Wallet';
import type StakePool from '../../../source/renderer/app/domains/StakePool';
import type { InitializeVPDelegationTxError } from '../../../source/renderer/app/stores/VotingStore';
import { generateWallet } from '../_support/utils';
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

type OverlayStoryOptions = {
  activeTab?: DRepSelectorTab;
  highlightedDRepId?: string | null;
  isOpen?: boolean;
  isLoading?: boolean;
  emptyState?: DRepEmptyStateVariant;
  errorState?: DRepErrorVariant;
  rankingUnavailable?: boolean;
  anchorUnavailable?: boolean;
  defaultRefreshState?: DRepRefreshState;
};

const STAKE_POOLS_LIST = (STAKE_POOLS as unknown) as Array<StakePool>;

const GOVERNANCE_WALLETS = [
  generateWallet(
    'Governance wallet',
    '125000000000',
    undefined,
    0,
    null,
    true,
    WalletSyncStateStatuses.READY,
    false,
    'governance-wallet-v2-1'
  ),
  generateWallet(
    'Ledger governance wallet',
    '58000000000',
    undefined,
    0,
    null,
    false,
    WalletSyncStateStatuses.READY,
    true,
    'governance-wallet-v2-2'
  ),
];

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
  onCloseSelector: action('onCloseSelector'),
  onFavoriteToggle: (drep: DRepFixture) =>
    action('onFavoriteToggle')(drep.cip129),
  onHighlightDRep: (drep: DRepFixture) =>
    action('onHighlightDRep')(drep.cip129),
  onOpenSelector: action('onOpenSelector'),
  onRefresh: action('onRefresh'),
  onReshuffle: action('onReshuffle'),
  onSelectDRep: (drep: DRepFixture) => action('onSelectDRep')(drep.cip129),
  onShowAll: action('onShowAll'),
  onTabChange: (tab: DRepSelectorTab) => action('onTabChange')(tab),
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

const renderGovernanceForm = () => {
  const voteState = resolveCurrentVoteKnob(
    currentVoteKnob('Current vote (mock)')
  );
  const initializeTxErrorOptions: Record<
    string,
    InitializeVPDelegationTxError
  > = {
    Generic: 'generic',
    'Same vote': 'same_vote',
    'No UTxOs available': 'no_utxos_available',
    'Not enough money': 'not_enough_money',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <CurrentVoteSummaryMock state={voteState} />
      <VotingPowerDelegation
        getStakePoolById={(stakePoolId: string) =>
          STAKE_POOLS_LIST.find((stakePool) => stakePool.id === stakePoolId)
        }
        initiateTransaction={async (params: {
          chosenOption: string;
          wallet: Wallet;
        }) => {
          action('initiateTransaction')(params);
          return boolean('Initialization succeeds', true)
            ? { success: true, fees: new BigNumber('0.174257') }
            : {
                success: false,
                errorCode: select(
                  'Initialization error',
                  initializeTxErrorOptions,
                  'same_vote'
                ),
              };
        }}
        onExternalLinkClick={action('onExternalLinkClick')}
        renderConfirmationDialog={() => <div />}
        stakePools={STAKE_POOLS_LIST}
        wallets={GOVERNANCE_WALLETS}
      />
    </div>
  );
};

const renderOverlayStory = (options: OverlayStoryOptions) =>
  withState(
    {
      activeTab: options.activeTab || 'directory',
      highlightedDRepId: options.highlightedDRepId || null,
      isOpen: options.isOpen !== false,
    },
    (store) => {
      const controls = usePreviewControls(options.defaultRefreshState);
      const callbacks = getCallbacks();
      const rows = options.emptyState
        ? []
        : getScenarioDReps({
            resultCount: controls.resultCount,
            showAll: controls.showAll,
            showVerifiedAnchor: controls.showVerifiedAnchor,
            rankingUnavailable:
              options.rankingUnavailable ||
              controls.refreshState === 'rankingUnavailable',
            anchorUnavailable: options.anchorUnavailable,
          });
      const visibleDreps =
        options.emptyState || rows.length ? rows : DREP_FIXTURES.slice(0, 8);

      return (
        <DRepSelectorOverlayV2
          isOpen={store.state.isOpen}
          activeTab={store.state.activeTab as DRepSelectorTab}
          dreps={visibleDreps}
          highlightedDRepId={store.state.highlightedDRepId}
          resultCount={options.emptyState ? 0 : controls.resultCount}
          refreshState={controls.refreshState}
          showAll={controls.showAll}
          showVerifiedAnchor={controls.showVerifiedAnchor}
          isLoading={options.isLoading}
          emptyState={options.emptyState}
          errorState={getErrorState(controls.refreshState, options.errorState)}
          onClose={() => {
            callbacks.onCloseSelector();
            store.set({ isOpen: false });
          }}
          onTabChange={(tab) => {
            callbacks.onTabChange(tab);
            store.set({ activeTab: tab });
          }}
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

storiesOf(
  'Governance / DRep Discovery (UX preview) / V2 Embedded Selector',
  module
)
  .addDecorator(GovernanceWrapper)
  .addDecorator(withKnobs)
  .add(
    'V2 / Voting form with Browse DReps button',
    withState({ isOpen: false }, (store) => {
      usePreviewControls();
      const callbacks = getCallbacks();
      return (
        <VotingPowerDelegationWithSelectorDemo
          isSelectorOpen={store.state.isOpen}
          onOpenSelector={() => {
            callbacks.onOpenSelector();
            store.set({ isOpen: true });
          }}
        >
          {renderGovernanceForm()}
          <DRepSelectorOverlayV2
            isOpen={store.state.isOpen}
            activeTab="directory"
            dreps={DREP_FIXTURES.slice(0, 8)}
            highlightedDRepId={DREP_FIXTURES[0].cip129}
            resultCount={187}
            refreshState="idle"
            showAll={false}
            onClose={() => {
              callbacks.onCloseSelector();
              store.set({ isOpen: false });
            }}
            onTabChange={callbacks.onTabChange}
            onFavoriteToggle={callbacks.onFavoriteToggle}
            onHighlightDRep={callbacks.onHighlightDRep}
            onSelectDRep={callbacks.onSelectDRep}
            onRefresh={callbacks.onRefresh}
            onShowAll={callbacks.onShowAll}
            onReshuffle={callbacks.onReshuffle}
          />
        </VotingPowerDelegationWithSelectorDemo>
      );
    })
  )
  .add('V2 / Selector overlay open — Directory', renderOverlayStory({}))
  .add(
    'V2 / Selector overlay — Detail highlighted',
    renderOverlayStory({ highlightedDRepId: DREP_FIXTURES[0].cip129 })
  )
  .add(
    'V2 / Selector overlay — Favorites tab',
    renderOverlayStory({
      activeTab: 'favorites',
      highlightedDRepId: getFavoriteDReps()[0].cip129,
    })
  )
  .add(
    'V2 / Selector overlay — Loading',
    renderOverlayStory({ isLoading: true, defaultRefreshState: 'refreshing' })
  )
  .add(
    'V2 / Selector overlay — Refresh failed',
    renderOverlayStory({
      errorState: 'refreshFailed',
      defaultRefreshState: 'failed',
    })
  )
  .add('V2 / Directory — Empty', renderOverlayStory({ emptyState: 'noSync' }))
  .add(
    'V2 / Directory — No filter results',
    renderOverlayStory({ emptyState: 'noResults' })
  )
  .add(
    'V2 / Directory — Ranking unavailable',
    renderOverlayStory({
      errorState: 'rankingUnavailable',
      rankingUnavailable: true,
      defaultRefreshState: 'rankingUnavailable',
    })
  )
  .add(
    'V2 / Directory — Selfnode unsupported',
    renderOverlayStory({ emptyState: 'selfnode' })
  )
  .add(
    'V2 / Directory — Refreshing (stale-while-refresh)',
    renderOverlayStory({ defaultRefreshState: 'refreshing' })
  )
  .add(
    'V2 / Detail — On-chain only (Sprint 2)',
    renderOverlayStory({ highlightedDRepId: DREP_FIXTURES[0].cip129 })
  )
  .add(
    'V2 / Detail — Verified anchor preview (Sprint 4)',
    renderOverlayStory({ highlightedDRepId: getVerifiedDRep().cip129 })
  )
  .add(
    'V2 / Detail — Anchor unavailable',
    renderOverlayStory({
      highlightedDRepId: getAnchorUnavailableDRep().cip129,
      anchorUnavailable: true,
    })
  )
  .add(
    'V2 / Favorites — Empty',
    renderOverlayStory({ activeTab: 'favorites', emptyState: 'favoritesEmpty' })
  )
  .add('V2 / Confirmation — Sprint 2 (ID only)', () => renderConfirmation({}))
  .add('V2 / Confirmation — Sprint 4 preview (verified name + IDs)', () =>
    renderConfirmation({ sprint4Preview: true })
  )
  .add('V2 / HW Confirmation — Disconnected', () =>
    renderConfirmation({
      hardwareMessage:
        'Hardware wallet disconnected. Reconnect and unlock your device to continue.',
      defaultHwDeviceStatus: HwDeviceStatuses.READY,
    })
  )
  .add('V2 / HW Confirmation — Locked', () =>
    renderConfirmation({
      hardwareMessage:
        'Device is locked. Enter your PIN on the device to continue.',
      defaultHwDeviceStatus: HwDeviceStatuses.READY,
    })
  )
  .add('V2 / HW Confirmation — App not open', () =>
    renderConfirmation({
      hardwareMessage: 'Open the Cardano app on your Ledger.',
      defaultHwDeviceStatus: HwDeviceStatuses.LAUNCHING_CARDANO_APP,
    })
  )
  .add('V2 / HW Confirmation — Rejected', () =>
    renderConfirmation({
      hardwareMessage:
        'Transaction rejected on device. No delegation was submitted.',
      defaultHwDeviceStatus: HwDeviceStatuses.VERIFYING_TRANSACTION_FAILED,
    })
  )
  .add('V2 / HW Confirmation — Timeout', () =>
    renderConfirmation({
      hardwareMessage:
        'No response from device. Disconnect and reconnect, then try again.',
      defaultHwDeviceStatus: HwDeviceStatuses.CONNECTING_FAILED,
    })
  );
