import React from 'react';
import styles from './DRepEmptyState.scss';
import type { DRepEmptyStateVariant } from './fixtures';

type Props = {
  variant: DRepEmptyStateVariant;
  onPrimaryAction?: () => void;
};

const emptyStateContent: Record<
  DRepEmptyStateVariant,
  { title: string; body: string; action: string }
> = {
  noResults: {
    title: 'No DReps match your filters',
    body: 'Clear filters or show all DReps to broaden the preview list.',
    action: 'Clear filters',
  },
  selfnode: {
    title: 'DRep data unavailable on selfnode',
    body:
      'The selfnode cluster does not expose DRep directory data in this preview state.',
    action: 'Review setup',
  },
  noSync: {
    title: 'Node is still syncing',
    body: 'DRep data becomes available once the node reaches the chain tip.',
    action: 'Refresh status',
  },
  favoritesEmpty: {
    title: 'No favorites yet',
    body:
      'DReps you favorite from the directory appear here. Favorites are stored on this device only.',
    action: 'Back to directory',
  },
};

function DRepEmptyState({ variant, onPrimaryAction }: Props) {
  const content = emptyStateContent[variant];
  return (
    <div className={styles.component} role="status">
      <div className={styles.marker} aria-hidden="true" />
      <h3>{content.title}</h3>
      <p>{content.body}</p>
      {onPrimaryAction && (
        <button
          type="button"
          className={styles.action}
          onClick={onPrimaryAction}
        >
          {content.action}
        </button>
      )}
    </div>
  );
}

export default DRepEmptyState;
