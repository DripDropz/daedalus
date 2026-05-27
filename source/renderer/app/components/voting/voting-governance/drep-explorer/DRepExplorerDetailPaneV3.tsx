import React from 'react';
import styles from './DRepExplorerDetailPaneV3.scss';
import DRepDetailAnchorSection from '../../../governance/_shared/DRepDetailAnchorSection';
import DRepDetailOnchainSection from '../../../governance/_shared/DRepDetailOnchainSection';
import DRepIdDisplay from '../../../governance/_shared/DRepIdDisplay';
import type { DRepFixture } from '../../../governance/_shared/fixtures';

type Props = {
  drep?: DRepFixture | null;
  showVerifiedAnchor?: boolean;
  onFavoriteToggle: (drep: DRepFixture) => void;
  onSelectDRep: (drep: DRepFixture) => void;
};

const DRepExplorerDetailPaneV3 = ({
  drep = null,
  showVerifiedAnchor = false,
  onFavoriteToggle,
  onSelectDRep,
}: Props) => {
  if (!drep) {
    return (
      <section className={styles.component} aria-label="DRep detail pane">
        <div className={styles.initialState} role="status">
          <h3>Select a DRep to see details</h3>
          <p>
            Highlight a row in the middle pane to review on-chain fields, anchor
            status, and the current-epoch vote tally.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.component} aria-label="DRep detail pane">
      <div className={styles.identityBlock}>
        <h2>{drep.displayName}</h2>
        <DRepIdDisplay compact cip129={drep.cip129} cip105={drep.cip105} />
      </div>
      <div className={styles.sections}>
        <DRepDetailOnchainSection drep={drep} />
        <DRepDetailAnchorSection
          drep={drep}
          showVerifiedAnchor={showVerifiedAnchor}
        />
      </div>
      <div className={styles.actions}>
        <button
          type="button"
          className={styles.favoriteButton}
          aria-pressed={drep.isFavorite}
          onClick={() => onFavoriteToggle(drep)}
        >
          {drep.isFavorite ? '★ Favorited' : '☆ Favorite'}
        </button>
        <button
          type="button"
          className={styles.selectButton}
          aria-label={`Select ${drep.cip129} for delegation`}
          onClick={() => onSelectDRep(drep)}
        >
          Select for delegation
        </button>
      </div>
      <span className={styles.liveRegion} aria-live="polite">
        Showing details for {drep.cip129}
      </span>
    </section>
  );
};

export default DRepExplorerDetailPaneV3;
