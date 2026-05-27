import React from 'react';
import styles from './DRepDirectoryV1.scss';
import DRepCard from '../_shared/DRepCard';
import DRepCohortBanner from '../_shared/DRepCohortBanner';
import DRepEmptyState from '../_shared/DRepEmptyState';
import DRepErrorBanner from '../_shared/DRepErrorBanner';
import DRepRefreshIndicator from '../_shared/DRepRefreshIndicator';
import type {
  DRepEmptyStateVariant,
  DRepErrorVariant,
  DRepFixture,
  DRepRefreshState,
} from '../_shared/fixtures';

type Props = {
  dreps: Array<DRepFixture>;
  resultCount: number;
  refreshState: DRepRefreshState;
  showAll: boolean;
  showVerifiedAnchor?: boolean;
  emptyState?: DRepEmptyStateVariant;
  errorState?: DRepErrorVariant;
  isFilterActive?: boolean;
  showSortBiasWarning?: boolean;
  onFavoriteToggle: (drep: DRepFixture) => void;
  onViewDetails: (drep: DRepFixture) => void;
  onSelectDRep: (drep: DRepFixture) => void;
  onRefresh: () => void;
  onShowAll: () => void;
  onReshuffle: () => void;
};

function DRepDirectoryV1({
  dreps,
  resultCount,
  refreshState,
  showAll,
  showVerifiedAnchor = false,
  emptyState,
  errorState,
  isFilterActive = false,
  showSortBiasWarning = false,
  onFavoriteToggle,
  onViewDetails,
  onSelectDRep,
  onRefresh,
  onShowAll,
  onReshuffle,
}: Props) {
  return (
    <section className={styles.component} aria-label="DRep directory">
      <div className={styles.toolbar}>
        <div>
          <h2>DRep directory</h2>
          <p>{resultCount} DReps in the current preview cohort</p>
        </div>
        <DRepRefreshIndicator
          refreshState={refreshState}
          lastUpdatedLabel="3 minutes ago"
          lastUpdatedAt="2026-05-21T14:18:00Z"
          onRefresh={onRefresh}
        />
      </div>
      {errorState && (
        <DRepErrorBanner
          variant={errorState}
          lastUpdatedLabel="3 minutes ago"
          onRetry={onRefresh}
        />
      )}
      <DRepCohortBanner
        resultCount={resultCount}
        isFilterActive={isFilterActive}
        showAll={showAll}
        showSortBiasWarning={showSortBiasWarning}
        onShowAll={onShowAll}
        onReshuffle={onReshuffle}
      />
      <div className={styles.controls}>
        <label className={styles.searchLabel} htmlFor="drep-directory-search">
          Search
        </label>
        <input
          id="drep-directory-search"
          type="search"
          placeholder="Search by name or DRep ID"
          aria-describedby="drep-search-help"
        />
        <span id="drep-search-help" className={styles.searchHelp}>
          Enter at least 8 characters to search by ID.
        </span>
        <button type="button" className={styles.filterButton}>
          Filters (1)
        </button>
      </div>
      {emptyState ? (
        <DRepEmptyState variant={emptyState} onPrimaryAction={onShowAll} />
      ) : (
        <div className={styles.list}>
          {dreps.map((drep) => (
            <DRepCard
              key={drep.cip129}
              drep={drep}
              showVerifiedAnchor={showVerifiedAnchor}
              onFavoriteToggle={onFavoriteToggle}
              onViewDetails={onViewDetails}
              onSelect={onSelectDRep}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default DRepDirectoryV1;
