import React from 'react';
import styles from './GovernanceWithNavigation.scss';

export type GovernanceTab = 'directory' | 'favorites';

type Props = {
  activeTab: GovernanceTab;
  children: React.ReactNode;
  onTabClick: (tab: GovernanceTab) => void;
};

const tabs: Array<{ id: GovernanceTab; label: string }> = [
  { id: 'directory', label: 'Directory' },
  { id: 'favorites', label: 'Favorites' },
];

function GovernanceWithNavigation({ activeTab, children, onTabClick }: Props) {
  const activeIndex = tabs.findIndex(({ id }) => id === activeTab);

  return (
    <div className={styles.component}>
      <header className={styles.header}>
        <div>
          <span className={styles.eyebrow}>Governance</span>
          <h1>DRep discovery</h1>
        </div>
        <nav className={styles.tabs} aria-label="Governance section">
          {tabs.map((tab, index) => (
            <button
              key={tab.id}
              type="button"
              className={activeTab === tab.id ? styles.activeTab : styles.tab}
              aria-current={activeTab === tab.id ? 'page' : undefined}
              onClick={() => onTabClick(tab.id)}
              onKeyDown={(event) => {
                if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') {
                  return;
                }
                event.preventDefault();
                const direction = event.key === 'ArrowRight' ? 1 : -1;
                const nextIndex =
                  (activeIndex + direction + tabs.length) % tabs.length;
                onTabClick(tabs[nextIndex].id);
              }}
              tabIndex={activeTab === tab.id || index === 0 ? 0 : -1}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </header>
      <main className={styles.page}>{children}</main>
    </div>
  );
}

export default GovernanceWithNavigation;
