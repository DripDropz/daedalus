import React from 'react';
import { action } from '@storybook/addon-actions';
import StoryDecorator from '../../_support/StoryDecorator';
import StoryProvider from '../../_support/StoryProvider';
import Navigation from '../../../../source/renderer/app/components/navigation/Navigation';
import BorderedBox from '../../../../source/renderer/app/components/widgets/BorderedBox';
import Sidebar from '../../../../source/renderer/app/components/sidebar/Sidebar';
import type { SidebarMenus } from '../../../../source/renderer/app/components/sidebar/types';
import SidebarLayout from '../../../../source/renderer/app/components/layout/SidebarLayout';
import TopBar from '../../../../source/renderer/app/components/layout/TopBar';
import VotingInfo from '../../../../source/renderer/app/components/voting/voting-info/VotingInfo';
import { VotingFooterLinks } from '../../../../source/renderer/app/components/voting/VotingFooterLinks';
import {
  CATEGORIES_BY_NAME,
  SidebarCategoryInfo,
} from '../../../../source/renderer/app/config/sidebarConfig';
import {
  DATE_ENGLISH_OPTIONS,
  LANGUAGE_OPTIONS,
  TIME_OPTIONS,
} from '../../../../source/renderer/app/config/profileConfig';
import type { CatalystFund } from '../../../../source/renderer/app/api/voting/types';
import { TESTNET } from '../../../../source/common/types/environment.types';
import type { Locale } from '../../../../source/common/types/locales.types';
import { ROUTES } from '../../../../source/renderer/app/routes-config';
import { FundPhase } from '../../../../source/renderer/app/stores/VotingStore';
import { DREP_FIXTURES } from './fixtures';

const GOVERNANCE_FIXTURE_CONTEXT_VALUE = {
  dreps: DREP_FIXTURES,
};

export const GovernanceFixtureContext = React.createContext(
  GOVERNANCE_FIXTURE_CONTEXT_VALUE
);

type GovernanceStoryShellProps = {
  children: React.ReactNode;
};

type GovernanceStoryShellState = {
  activeSidebarCategory: string;
  activeVotingRoute: string;
  currentContentRoute: string;
};

const VOTING_NAV_ITEMS = [
  {
    id: ROUTES.VOTING.GOVERNANCE,
    label: 'Governance',
  },
  {
    id: ROUTES.VOTING.REGISTRATION,
    label: 'Catalyst Voting',
  },
];

const GOVERNANCE_SIDEBAR_CATEGORIES: Array<SidebarCategoryInfo> = [
  CATEGORIES_BY_NAME.WALLETS,
  CATEGORIES_BY_NAME.STAKING,
  CATEGORIES_BY_NAME.VOTING,
  CATEGORIES_BY_NAME.SETTINGS,
  CATEGORIES_BY_NAME.NETWORK_INFO,
];

const EMPTY_SIDEBAR_MENUS: SidebarMenus = {
  wallets: null,
};

const mockFundInfo: CatalystFund = {
  current: {
    number: 7,
    startTime: new Date('Jan 20, 2022, 11:00 UTC'),
    endTime: new Date('Feb 3, 2022, 11:00 UTC'),
    resultsTime: new Date('Feb 10, 2022'),
    registrationSnapshotTime: new Date('Jan 6, 2022, 11:00 UTC'),
  },
  next: {
    number: 8,
    startTime: new Date('Apr 6, 2022, 11:00 UTC'),
    registrationSnapshotTime: new Date('Apr 7, 2022, 11:00 UTC'),
  },
};

const locale = LANGUAGE_OPTIONS[0].value as Locale;

const CONNECTED_FLOW_STYLE: React.CSSProperties = {
  height: '100vh',
  minHeight: 820,
};

const FLOW_CONTENT_STYLE: React.CSSProperties = {
  padding: 32,
};

const FLOW_SECTION_STYLE: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 24,
};

const STORY_BODY_STYLE: React.CSSProperties = {
  minWidth: 0,
};

const renderNonVotingPlaceholder = (activeSidebarCategory: string) => (
  <BorderedBox>
    <h1 style={{ marginTop: 0 }}>Navigation Context</h1>
    <p style={{ marginBottom: 0 }}>
      Active sidebar route: {activeSidebarCategory}. Use the Voting icon to
      return to the governance DRep discovery previews.
    </p>
  </BorderedBox>
);

const renderCatalystPanel = () => (
  <div style={FLOW_SECTION_STYLE}>
    <VotingInfo
      currentLocale={locale}
      currentDateFormat={DATE_ENGLISH_OPTIONS[0].value}
      currentTimeFormat={TIME_OPTIONS[0].value}
      fundPhase={FundPhase.SNAPSHOT}
      fundInfo={mockFundInfo}
      onRegisterToVoteClick={action('onRegisterToVoteClick')}
      onExternalLinkClick={action('onExternalLinkClick')}
    />
    <VotingFooterLinks onClickExternalLink={action('onExternalLinkClick')} />
  </div>
);

class GovernanceStoryShell extends React.Component<
  GovernanceStoryShellProps,
  GovernanceStoryShellState
> {
  state = {
    activeSidebarCategory: ROUTES.VOTING.GOVERNANCE,
    activeVotingRoute: ROUTES.VOTING.GOVERNANCE,
    currentContentRoute: ROUTES.VOTING.GOVERNANCE,
  };

  handleSidebarCategory = (category: string) => {
    action('onActivateCategory')(category);

    if (category.indexOf(ROUTES.VOTING.ROOT) === 0) {
      this.setState({
        activeSidebarCategory: ROUTES.VOTING.GOVERNANCE,
        activeVotingRoute: ROUTES.VOTING.GOVERNANCE,
        currentContentRoute: ROUTES.VOTING.GOVERNANCE,
      });
      return;
    }

    this.setState({
      activeSidebarCategory: category,
      currentContentRoute: category,
    });
  };

  handleVotingNavItemClick = (navItemId: string) => {
    action('onNavItemClick')(navItemId);
    this.setState({
      activeSidebarCategory: ROUTES.VOTING.GOVERNANCE,
      activeVotingRoute: navItemId,
      currentContentRoute: navItemId,
    });
  };

  render() {
    const { children } = this.props;
    const {
      activeSidebarCategory,
      activeVotingRoute,
      currentContentRoute,
    } = this.state;
    const isVotingSection =
      currentContentRoute.indexOf(ROUTES.VOTING.ROOT) === 0;
    const activeVotingItem = VOTING_NAV_ITEMS.find(
      ({ id }) => id === activeVotingRoute
    );

    return (
      <div style={CONNECTED_FLOW_STYLE}>
        <SidebarLayout
          sidebar={
            <Sidebar
              menus={EMPTY_SIDEBAR_MENUS}
              categories={GOVERNANCE_SIDEBAR_CATEGORIES}
              activeSidebarCategory={activeSidebarCategory}
              isShowingSubMenus={false}
              pathname={currentContentRoute}
              network={TESTNET}
              onActivateCategory={this.handleSidebarCategory}
              onAddWallet={action('onAddWallet')}
              isShelleyActivated
            />
          }
          topbar={<TopBar isShelleyActivated />}
        >
          <div style={FLOW_CONTENT_STYLE}>
            {isVotingSection ? (
              <div style={FLOW_SECTION_STYLE}>
                <Navigation
                  items={VOTING_NAV_ITEMS}
                  activeItem={activeVotingItem?.label || 'Governance'}
                  isActiveNavItem={(navItemId: string) =>
                    navItemId === activeVotingRoute
                  }
                  onNavItemClick={this.handleVotingNavItemClick}
                />
                {activeVotingRoute === ROUTES.VOTING.GOVERNANCE ? (
                  <div style={STORY_BODY_STYLE}>{children}</div>
                ) : (
                  renderCatalystPanel()
                )}
              </div>
            ) : (
              renderNonVotingPlaceholder(activeSidebarCategory)
            )}
          </div>
        </SidebarLayout>
      </div>
    );
  }
}

export default function GovernanceWrapper(story: () => React.ReactNode) {
  return (
    <StoryProvider>
      <StoryDecorator propsForChildren={GOVERNANCE_FIXTURE_CONTEXT_VALUE}>
        <GovernanceFixtureContext.Provider
          value={GOVERNANCE_FIXTURE_CONTEXT_VALUE}
        >
          <GovernanceStoryShell>{story()}</GovernanceStoryShell>
        </GovernanceFixtureContext.Provider>
      </StoryDecorator>
    </StoryProvider>
  );
}
