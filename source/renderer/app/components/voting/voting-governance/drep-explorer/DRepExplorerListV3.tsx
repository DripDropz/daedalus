import React from 'react';
import styles from './DRepExplorerListV3.scss';
import DRepIdDisplay from '../../../governance/_shared/DRepIdDisplay';
import DRepStatusBadge from '../../../governance/_shared/DRepStatusBadge';
import type { DRepFixture } from '../../../governance/_shared/fixtures';
import { formatCompactAda } from '../../../governance/_shared/fixtures';

type Props = {
  dreps: Array<DRepFixture>;
  highlightedDRepId?: string | null;
  onHighlightDRep: (drep: DRepFixture) => void;
  onFavoriteToggle: (drep: DRepFixture) => void;
};

const DRepExplorerListV3 = ({
  dreps,
  highlightedDRepId = null,
  onHighlightDRep,
  onFavoriteToggle,
}: Props) => {
  const rowRefs = React.useRef<Array<HTMLDivElement | null>>([]);
  const highlightedIndex = dreps.findIndex(
    (drep) => drep.cip129 === highlightedDRepId
  );
  const focusIndex = highlightedIndex >= 0 ? highlightedIndex : 0;

  const highlightByIndex = (index: number) => {
    const drep = dreps[index];
    if (!drep) return;
    onHighlightDRep(drep);
    rowRefs.current[index]?.focus();
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const interactiveTarget = (event.target as HTMLElement).closest(
      'button, a, input, textarea, select'
    );
    if (interactiveTarget) return;
    if (!dreps.length) return;

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      highlightByIndex((focusIndex + 1) % dreps.length);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      highlightByIndex((focusIndex - 1 + dreps.length) % dreps.length);
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      highlightByIndex(focusIndex);
    }
  };

  return (
    <div
      className={styles.component}
      role="listbox"
      aria-label="DRep results"
      onKeyDown={handleKeyDown}
    >
      {dreps.map((drep, index) => {
        const highlighted = highlightedDRepId === drep.cip129;
        const votingPower = formatCompactAda(drep.votingPower);
        return (
          <div
            key={drep.cip129}
            className={highlighted ? styles.highlightedRow : styles.row}
            role="option"
            aria-selected={highlighted}
            tabIndex={index === focusIndex ? 0 : -1}
            ref={(element) => {
              rowRefs.current[index] = element;
            }}
            onClick={() => onHighlightDRep(drep)}
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
              onClick={(event) => {
                event.stopPropagation();
                onFavoriteToggle(drep);
              }}
            >
              {drep.isFavorite ? '★' : '☆'}
            </button>
            <div className={styles.rowContent}>
              <span className={styles.nameRow}>
                <strong>{drep.displayName}</strong>
                <DRepStatusBadge
                  status={drep.status}
                  expiryEpochs={drep.expiryEpochs}
                />
              </span>
              <DRepIdDisplay
                compact
                cip129={drep.cip129}
                cip105={drep.cip105}
              />
              <span
                className={styles.votingPower}
                aria-label={`Voting power ${votingPower} ada`}
              >
                {votingPower}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DRepExplorerListV3;
