import React from 'react';
import styles from './DRepCard.scss';
import DRepIdDisplay from './DRepIdDisplay';
import DRepSourceLabel from './DRepSourceLabel';
import DRepStatusBadge from './DRepStatusBadge';
import type { DRepFixture } from './fixtures';
import { formatCompactAda, statusLabels } from './fixtures';

type Props = {
  drep: DRepFixture;
  showVerifiedAnchor?: boolean;
  isHighlighted?: boolean;
  onFavoriteToggle: (drep: DRepFixture) => void;
  onViewDetails: (drep: DRepFixture) => void;
  onSelect: (drep: DRepFixture) => void;
  onCopyId?: (value: string) => void;
};

function getAnchorLabel(drep: DRepFixture, showVerifiedAnchor: boolean) {
  if (!drep.anchor || !drep.anchor.isAvailable) return 'anchorUnavailable';
  if (showVerifiedAnchor && drep.anchor.isVerified) return 'verified';
  return 'anchorReference';
}

function DRepCard({
  drep,
  showVerifiedAnchor = false,
  isHighlighted = false,
  onFavoriteToggle,
  onViewDetails,
  onSelect,
  onCopyId,
}: Props) {
  const votingPower = formatCompactAda(drep.votingPower);
  const anchorLabel = getAnchorLabel(drep, showVerifiedAnchor);
  const roundingHintId = `drep-card-rounding-${drep.credentialHex}`;

  return (
    <article
      className={isHighlighted ? styles.highlighted : styles.component}
      role="group"
      aria-label={`${drep.cip129}, ${
        statusLabels[drep.status]
      }, voting power ${votingPower}`}
    >
      <button
        type="button"
        className={styles.favoriteButton}
        aria-pressed={drep.isFavorite}
        aria-label={
          drep.isFavorite
            ? 'Remove DRep from favorites'
            : 'Add DRep to favorites'
        }
        onClick={() => onFavoriteToggle(drep)}
      >
        {drep.isFavorite ? '★' : '☆'}
      </button>
      <div className={styles.identity}>
        <div className={styles.nameRow}>
          <strong>{drep.displayName}</strong>
          <DRepStatusBadge
            status={drep.status}
            expiryEpochs={drep.expiryEpochs}
          />
          {drep.isTop35 && <DRepStatusBadge status="top35Excluded" />}
        </div>
        <DRepIdDisplay
          compact
          cip129={drep.cip129}
          cip105={drep.cip105}
          onCopy={onCopyId}
        />
      </div>
      <div className={styles.metrics}>
        <span className={styles.metricLabel}>Voting power</span>
        <span
          className={styles.metricValue}
          aria-label={`Voting power ${votingPower} ada`}
          aria-describedby={roundingHintId}
        >
          {votingPower}
        </span>
        <DRepSourceLabel type="onchain" />
        <DRepSourceLabel type={anchorLabel} />
      </div>
      <div className={styles.actions}>
        <button
          type="button"
          className={styles.secondaryButton}
          onClick={() => onViewDetails(drep)}
        >
          View details
        </button>
        <button
          type="button"
          className={styles.primaryButton}
          aria-label={`Select ${drep.cip129} for delegation`}
          onClick={() => onSelect(drep)}
        >
          Select for delegation
        </button>
      </div>
      <span id={roundingHintId} className={styles.srOnly}>
        rounded display, exact value in detail view
      </span>
    </article>
  );
}

export default DRepCard;
