import React from 'react';
import styles from './DRepErrorBanner.scss';
import type { DRepErrorVariant } from './fixtures';

type Props = {
  variant: DRepErrorVariant;
  lastUpdatedLabel?: string;
  onRetry?: () => void;
};

function DRepErrorBanner({
  variant,
  lastUpdatedLabel = '3 minutes ago',
  onRetry,
}: Props) {
  const isRefreshFailure = variant === 'refreshFailed';
  return (
    <div className={styles.component} role="alert">
      <strong>
        {isRefreshFailure
          ? "Couldn't refresh DRep data."
          : 'Voting power data unavailable this refresh.'}
      </strong>
      <span>
        {isRefreshFailure
          ? ` Showing last successful snapshot from ${lastUpdatedLabel}.`
          : ' Ranking-based filters disabled.'}
      </span>
      {onRetry && (
        <button type="button" className={styles.retry} onClick={onRetry}>
          Retry
        </button>
      )}
    </div>
  );
}

export default DRepErrorBanner;
