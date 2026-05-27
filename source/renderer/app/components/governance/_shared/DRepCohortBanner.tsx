import React from 'react';
import styles from './DRepCohortBanner.scss';

type Props = {
  resultCount: number;
  isFilterActive?: boolean;
  showAll?: boolean;
  showSortBiasWarning?: boolean;
  onShowAll: () => void;
  onReshuffle: () => void;
};

function DRepCohortBanner({
  resultCount,
  isFilterActive = false,
  showAll = false,
  showSortBiasWarning = false,
  onShowAll,
  onReshuffle,
}: Props) {
  return (
    <section className={styles.component} aria-labelledby="drep-cohort-heading">
      <h2 id="drep-cohort-heading" className={styles.hiddenHeading}>
        DRep cohort disclosure
      </h2>
      <p className={styles.copy}>
        {isFilterActive
          ? `Showing ${resultCount} DReps matching your filters. Default randomized order does not apply.`
          : 'Default view shows up to 200 eligible DReps in randomized order, excluding the 35 largest by voting power.'}{' '}
        <button type="button" className={styles.linkButton} onClick={onShowAll}>
          {showAll ? 'Return to default cohort' : 'Show all DReps'}
        </button>{' '}
        or{' '}
        <button
          type="button"
          className={styles.linkButton}
          onClick={onReshuffle}
        >
          Reshuffle order
        </button>
        .
      </p>
      {showSortBiasWarning && (
        <p className={styles.warning}>
          Sorted by voting power. Default randomized order is designed to reduce
          popularity bias — consider returning to default for unbiased browsing.
        </p>
      )}
    </section>
  );
}

export default DRepCohortBanner;
