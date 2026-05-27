import React from 'react';
import styles from './DRepExplorerV3.scss';
import DRepCohortBanner from '../../../governance/_shared/DRepCohortBanner';
import DRepEmptyState from '../../../governance/_shared/DRepEmptyState';
import DRepErrorBanner from '../../../governance/_shared/DRepErrorBanner';
import DRepRefreshIndicator from '../../../governance/_shared/DRepRefreshIndicator';
import type {
  DRepEmptyStateVariant,
  DRepErrorVariant,
  DRepFixture,
  DRepRefreshState,
} from '../../../governance/_shared/fixtures';
import DRepExplorerDetailPaneV3 from './DRepExplorerDetailPaneV3';
import DRepExplorerFilterRailV3 from './DRepExplorerFilterRailV3';
import DRepExplorerListV3 from './DRepExplorerListV3';

type Props = {
  dreps: Array<DRepFixture>;
  highlightedDRepId?: string | null;
  resultCount: number;
  refreshState: DRepRefreshState;
  showAll: boolean;
  showVerifiedAnchor?: boolean;
  activeFilters?: Array<string>;
  favoritesOnly?: boolean;
  emptyState?: DRepEmptyStateVariant;
  errorState?: DRepErrorVariant;
  showSortBiasWarning?: boolean;
  onBackToForm: () => void;
  onFavoriteToggle: (drep: DRepFixture) => void;
  onHighlightDRep: (drep: DRepFixture) => void;
  onSelectDRep: (drep: DRepFixture) => void;
  onRefresh: () => void;
  onShowAll: () => void;
  onReshuffle: () => void;
};

const DRepExplorerV3 = ({
  dreps,
  highlightedDRepId = null,
  resultCount,
  refreshState,
  showAll,
  showVerifiedAnchor = false,
  activeFilters = [],
  favoritesOnly = false,
  emptyState,
  errorState,
  showSortBiasWarning = false,
  onBackToForm,
  onFavoriteToggle,
  onHighlightDRep,
  onSelectDRep,
  onRefresh,
  onShowAll,
  onReshuffle,
}: Props) => {
  const highlightedDRep =
    dreps.find((drep) => drep.cip129 === highlightedDRepId) || null;

  return (
    <div className={styles.component}>
      <header className={styles.header}>
        <button
          type="button"
          className={styles.backButton}
          onClick={onBackToForm}
        >
          Back to delegation form
        </button>
        <div>
          <span className={styles.eyebrow}>Voting / Cardano governance</span>
          <h1>DRep explorer</h1>
        </div>
        <DRepRefreshIndicator
          refreshState={refreshState}
          lastUpdatedLabel="3 minutes ago"
          lastUpdatedAt="2026-05-21T14:18:00Z"
          onRefresh={onRefresh}
        />
      </header>
      <div className={styles.shell}>
        <DRepExplorerFilterRailV3
          activeFilters={activeFilters}
          showAll={showAll}
          favoritesOnly={favoritesOnly}
          onToggleShowAll={onShowAll}
          onReshuffle={onReshuffle}
        />
        <section className={styles.listPane} aria-label="DRep explorer results">
          <div className={styles.listHeader}>
            <h2>DReps ({resultCount} in cohort)</h2>
            <input type="search" placeholder="Search by name or DRep ID" />
          </div>
          {errorState && (
            <DRepErrorBanner variant={errorState} onRetry={onRefresh} />
          )}
          <DRepCohortBanner
            resultCount={resultCount}
            isFilterActive={activeFilters.length > 0 || favoritesOnly}
            showAll={showAll}
            showSortBiasWarning={showSortBiasWarning}
            onShowAll={onShowAll}
            onReshuffle={onReshuffle}
          />
          {emptyState ? (
            <DRepEmptyState variant={emptyState} onPrimaryAction={onShowAll} />
          ) : (
            <DRepExplorerListV3
              dreps={
                favoritesOnly ? dreps.filter((drep) => drep.isFavorite) : dreps
              }
              highlightedDRepId={highlightedDRepId}
              onHighlightDRep={onHighlightDRep}
              onFavoriteToggle={onFavoriteToggle}
            />
          )}
        </section>
        <DRepExplorerDetailPaneV3
          drep={highlightedDRep}
          showVerifiedAnchor={showVerifiedAnchor}
          onFavoriteToggle={onFavoriteToggle}
          onSelectDRep={onSelectDRep}
        />
      </div>
    </div>
  );
};

export default DRepExplorerV3;
