/*
 * shared-design-tokens.md §10 flags overlay focus-trap risk.
 * Full overlay-unmount-before-HW-modal sequencing remains binding AC-V2-1
 * and is not demonstrated in this stub.
 */
import React from 'react';
import styles from './DRepSelectorOverlayV2.scss';
import DRepCard from '../../../governance/_shared/DRepCard';
import DRepCohortBanner from '../../../governance/_shared/DRepCohortBanner';
import DRepEmptyState from '../../../governance/_shared/DRepEmptyState';
import DRepErrorBanner from '../../../governance/_shared/DRepErrorBanner';
import DRepRefreshIndicator from '../../../governance/_shared/DRepRefreshIndicator';
import type {
  DRepEmptyStateVariant,
  DRepErrorVariant,
  DRepFixture,
  DRepRefreshState,
} from '../../../governance/_shared/fixtures';
import DRepSelectorCompactDetailV2 from './DRepSelectorCompactDetailV2';

export type DRepSelectorTab = 'directory' | 'favorites';

type Props = {
  isOpen: boolean;
  activeTab: DRepSelectorTab;
  dreps: Array<DRepFixture>;
  highlightedDRepId?: string | null;
  resultCount: number;
  refreshState: DRepRefreshState;
  showAll: boolean;
  showVerifiedAnchor?: boolean;
  isLoading?: boolean;
  emptyState?: DRepEmptyStateVariant;
  errorState?: DRepErrorVariant;
  onClose: () => void;
  onTabChange: (tab: DRepSelectorTab) => void;
  onFavoriteToggle: (drep: DRepFixture) => void;
  onHighlightDRep: (drep: DRepFixture) => void;
  onSelectDRep: (drep: DRepFixture) => void;
  onRefresh: () => void;
  onShowAll: () => void;
  onReshuffle: () => void;
};

const DRepSelectorOverlayV2 = ({
  isOpen,
  activeTab,
  dreps,
  highlightedDRepId = null,
  resultCount,
  refreshState,
  showAll,
  showVerifiedAnchor = false,
  isLoading = false,
  emptyState,
  errorState,
  onClose,
  onTabChange,
  onFavoriteToggle,
  onHighlightDRep,
  onSelectDRep,
  onRefresh,
  onShowAll,
  onReshuffle,
}: Props) => {
  const overlayRef = React.useRef<HTMLDivElement>(null);
  const closeButtonRef = React.useRef<HTMLButtonElement>(null);
  const previouslyFocusedRef = React.useRef<Element | null>(null);

  const getFocusableElements = React.useCallback(() => {
    if (!overlayRef.current) return [];
    return Array.from(
      overlayRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, [tabindex]:not([tabindex="-1"])'
      )
    ).filter(
      (element) =>
        !element.hasAttribute('disabled') &&
        element.getAttribute('aria-hidden') !== 'true'
    );
  }, []);

  React.useEffect(() => {
    if (!isOpen) return undefined;
    previouslyFocusedRef.current = document.activeElement;
    const focusableElements = getFocusableElements();
    const firstFocusableElement =
      closeButtonRef.current || focusableElements[0];
    firstFocusableElement?.focus();

    return () => {
      const previouslyFocused = previouslyFocusedRef.current;
      if (
        previouslyFocused instanceof HTMLElement &&
        document.contains(previouslyFocused)
      ) {
        previouslyFocused.focus();
      }
      previouslyFocusedRef.current = null;
    };
  }, [getFocusableElements, isOpen]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape') {
      onClose();
      return;
    }
    if (event.key !== 'Tab') return;

    const focusableElements = getFocusableElements();
    if (!focusableElements.length) {
      event.preventDefault();
      return;
    }

    const firstFocusableElement = focusableElements[0];
    const lastFocusableElement =
      focusableElements[focusableElements.length - 1];
    const activeElement = document.activeElement;

    if (event.shiftKey && activeElement === firstFocusableElement) {
      event.preventDefault();
      lastFocusableElement.focus();
    } else if (!event.shiftKey && activeElement === lastFocusableElement) {
      event.preventDefault();
      firstFocusableElement.focus();
    }
  };

  if (!isOpen) return null;

  const highlightedDRep =
    dreps.find((drep) => drep.cip129 === highlightedDRepId) || null;
  const visibleDReps =
    activeTab === 'favorites' ? dreps.filter((drep) => drep.isFavorite) : dreps;

  return (
    <div
      ref={overlayRef}
      className={styles.backdrop}
      role="dialog"
      aria-modal="true"
      aria-labelledby="drep-selector-title"
      data-testid="drep-selector-overlay"
      tabIndex={-1}
      onKeyDown={handleKeyDown}
    >
      <section className={styles.component}>
        <header className={styles.header}>
          <div>
            <h2 id="drep-selector-title">Browse DReps</h2>
            <p>Choose a DRep without leaving the voting form.</p>
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            className={styles.closeButton}
            onClick={onClose}
          >
            Close
          </button>
        </header>
        <div
          className={styles.tabs}
          role="tablist"
          aria-label="DRep selector tabs"
        >
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'directory'}
            className={
              activeTab === 'directory' ? styles.activeTab : styles.tab
            }
            onClick={() => onTabChange('directory')}
          >
            Directory
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'favorites'}
            className={
              activeTab === 'favorites' ? styles.activeTab : styles.tab
            }
            onClick={() => onTabChange('favorites')}
          >
            Favorites ({dreps.filter((drep) => drep.isFavorite).length})
          </button>
        </div>
        <div className={styles.metaRow}>
          <DRepRefreshIndicator
            refreshState={refreshState}
            lastUpdatedLabel="3 minutes ago"
            lastUpdatedAt="2026-05-21T14:18:00Z"
            onRefresh={onRefresh}
          />
        </div>
        {errorState && (
          <DRepErrorBanner variant={errorState} onRetry={onRefresh} />
        )}
        <DRepCohortBanner
          resultCount={resultCount}
          showAll={showAll}
          onShowAll={onShowAll}
          onReshuffle={onReshuffle}
        />
        <div className={styles.controls}>
          <input type="search" placeholder="Search by name or DRep ID" />
          <button type="button">Filters (1)</button>
        </div>
        <div className={highlightedDRep ? styles.splitContent : styles.content}>
          <div className={styles.listPane}>
            {isLoading ? (
              <div className={styles.loading} aria-live="polite">
                Loading DRep directory…
              </div>
            ) : emptyState ? (
              <DRepEmptyState
                variant={emptyState}
                onPrimaryAction={onShowAll}
              />
            ) : (
              <div className={styles.list}>
                {visibleDReps.map((drep) => (
                  <DRepCard
                    key={drep.cip129}
                    drep={drep}
                    isHighlighted={highlightedDRepId === drep.cip129}
                    showVerifiedAnchor={showVerifiedAnchor}
                    onFavoriteToggle={onFavoriteToggle}
                    onViewDetails={onHighlightDRep}
                    onSelect={onSelectDRep}
                  />
                ))}
              </div>
            )}
          </div>
          {highlightedDRep && (
            <DRepSelectorCompactDetailV2
              drep={highlightedDRep}
              showVerifiedAnchor={showVerifiedAnchor}
              onSelectDRep={onSelectDRep}
            />
          )}
        </div>
        <footer className={styles.footer}>
          <span>Press Esc to cancel</span>
          <div className={styles.footerActions}>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="button"
              className={styles.selectButton}
              disabled={!highlightedDRep}
              onClick={() => highlightedDRep && onSelectDRep(highlightedDRep)}
            >
              Select & close
            </button>
          </div>
        </footer>
      </section>
    </div>
  );
};

export default DRepSelectorOverlayV2;
