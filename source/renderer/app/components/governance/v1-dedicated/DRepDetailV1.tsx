import React from 'react';
import styles from './DRepDetailV1.scss';
import DRepDetailAnchorSection from '../_shared/DRepDetailAnchorSection';
import DRepDetailOnchainSection from '../_shared/DRepDetailOnchainSection';
import DRepIdDisplay from '../_shared/DRepIdDisplay';
import type { DRepFixture } from '../_shared/fixtures';

type Props = {
  drep: DRepFixture;
  showVerifiedAnchor?: boolean;
  onBack: () => void;
  onFavoriteToggle: (drep: DRepFixture) => void;
  onSelectDRep: (drep: DRepFixture) => void;
};

function DRepDetailV1({
  drep,
  showVerifiedAnchor = false,
  onBack,
  onFavoriteToggle,
  onSelectDRep,
}: Props) {
  return (
    <section className={styles.component} aria-label="DRep detail">
      <button type="button" className={styles.backButton} onClick={onBack}>
        Back to directory
      </button>
      <div className={styles.identityBlock}>
        <div className={styles.avatar} aria-hidden="true">
          {drep.displayName.slice(0, 2).toUpperCase()}
        </div>
        <div className={styles.identityCopy}>
          <h2>{drep.displayName}</h2>
          <DRepIdDisplay cip129={drep.cip129} cip105={drep.cip105} />
        </div>
        <button
          type="button"
          className={styles.favoriteButton}
          aria-pressed={drep.isFavorite}
          onClick={() => onFavoriteToggle(drep)}
        >
          {drep.isFavorite ? '★ Favorited' : '☆ Favorite'}
        </button>
      </div>
      <div className={styles.detailGrid}>
        <DRepDetailOnchainSection drep={drep} />
        <DRepDetailAnchorSection
          drep={drep}
          showVerifiedAnchor={showVerifiedAnchor}
        />
      </div>
      <button
        type="button"
        className={styles.selectButton}
        aria-label={`Select ${drep.cip129} for delegation`}
        onClick={() => onSelectDRep(drep)}
      >
        Select for delegation
      </button>
    </section>
  );
}

export default DRepDetailV1;
