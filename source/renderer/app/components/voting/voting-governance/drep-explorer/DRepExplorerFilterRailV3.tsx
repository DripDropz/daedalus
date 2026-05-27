import React from 'react';
import styles from './DRepExplorerFilterRailV3.scss';

type Props = {
  activeFilters: Array<string>;
  showAll: boolean;
  favoritesOnly: boolean;
  onToggleShowAll: () => void;
  onReshuffle: () => void;
};

const DRepExplorerFilterRailV3 = ({
  activeFilters,
  showAll,
  favoritesOnly,
  onToggleShowAll,
  onReshuffle,
}: Props) => (
  <aside className={styles.component} aria-label="DRep explorer filters">
    <div className={styles.section}>
      <h3>Status</h3>
      {['Active', 'Inactive', 'Retired'].map((label) => (
        <label key={label} className={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={activeFilters.includes(label.toLowerCase())}
            readOnly
          />
          {label}
        </label>
      ))}
    </div>
    <div className={styles.section}>
      <h3>Metadata</h3>
      {['Has anchor', 'Verified preview'].map((label) => (
        <label key={label} className={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={activeFilters.includes(label.toLowerCase())}
            readOnly
          />
          {label}
        </label>
      ))}
    </div>
    <div className={styles.section}>
      <h3>Cohort</h3>
      <label className={styles.checkboxLabel}>
        <input type="checkbox" checked={showAll} readOnly />
        Show all
      </label>
      <label className={styles.checkboxLabel}>
        <input type="checkbox" checked={favoritesOnly} readOnly />
        Favorites
      </label>
    </div>
    <div className={styles.actions}>
      <button type="button" onClick={onToggleShowAll}>
        {showAll ? 'Default cohort' : 'Show all'}
      </button>
      <button type="button" onClick={onReshuffle}>
        Reshuffle
      </button>
    </div>
    <span className={styles.liveRegion} aria-live="polite">
      Filter rail updated
    </span>
  </aside>
);

export default DRepExplorerFilterRailV3;
