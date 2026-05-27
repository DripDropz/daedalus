import React from 'react';
import styles from './DRepRefreshIndicator.scss';
import type { DRepRefreshState } from './fixtures';

type Props = {
  refreshState: DRepRefreshState;
  lastUpdatedLabel: string;
  lastUpdatedAt: string;
  onRefresh: () => void;
};

function DRepRefreshIndicator({
  refreshState,
  lastUpdatedLabel,
  lastUpdatedAt,
  onRefresh,
}: Props) {
  return (
    <div className={styles.component}>
      <span className={styles.timestamp} title={lastUpdatedAt}>
        Last updated {lastUpdatedLabel}
      </span>
      {refreshState === 'refreshing' && (
        <span className={styles.spinner} aria-label="Refreshing DRep data" />
      )}
      <button
        type="button"
        className={styles.refreshButton}
        onClick={onRefresh}
        aria-label="Refresh DRep data"
      >
        Refresh
      </button>
      <span className={styles.liveRegion} aria-live="polite">
        {refreshState === 'refreshing' ? 'Refreshing DRep list' : ''}
      </span>
    </div>
  );
}

export default DRepRefreshIndicator;
