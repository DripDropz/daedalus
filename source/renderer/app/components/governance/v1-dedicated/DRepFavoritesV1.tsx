import React from 'react';
import styles from './DRepFavoritesV1.scss';
import DRepCard from '../_shared/DRepCard';
import DRepEmptyState from '../_shared/DRepEmptyState';
import type { DRepFixture } from '../_shared/fixtures';

type Props = {
  dreps: Array<DRepFixture>;
  showVerifiedAnchor?: boolean;
  onBackToDirectory: () => void;
  onFavoriteToggle: (drep: DRepFixture) => void;
  onViewDetails: (drep: DRepFixture) => void;
  onSelectDRep: (drep: DRepFixture) => void;
};

function DRepFavoritesV1({
  dreps,
  showVerifiedAnchor = false,
  onBackToDirectory,
  onFavoriteToggle,
  onViewDetails,
  onSelectDRep,
}: Props) {
  return (
    <section className={styles.component} aria-label="Favorite DReps">
      <div className={styles.header}>
        <div>
          <h2>Favorite DReps</h2>
          <p>
            {dreps.length} DReps you&apos;ve favorited. Favorites are stored on
            this device only.
          </p>
        </div>
        <button
          type="button"
          className={styles.backButton}
          onClick={onBackToDirectory}
        >
          Back to directory
        </button>
      </div>
      {dreps.length === 0 ? (
        <DRepEmptyState
          variant="favoritesEmpty"
          onPrimaryAction={onBackToDirectory}
        />
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

export default DRepFavoritesV1;
