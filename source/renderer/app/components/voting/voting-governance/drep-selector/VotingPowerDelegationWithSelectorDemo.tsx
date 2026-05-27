import React from 'react';
import styles from './VotingPowerDelegationWithSelectorDemo.scss';

type Props = {
  children: React.ReactNode;
  isSelectorOpen?: boolean;
  onOpenSelector: () => void;
};

const VotingPowerDelegationWithSelectorDemo = ({
  children,
  isSelectorOpen = false,
  onOpenSelector,
}: Props) => (
  <div className={styles.component}>
    <div className={styles.demoToolbar}>
      <div>
        <h2>Cardano governance</h2>
        <p>Stakeholder demo wrapper around the existing delegation form.</p>
      </div>
      <button
        type="button"
        className={styles.browseButton}
        aria-expanded={isSelectorOpen}
        onClick={onOpenSelector}
      >
        Browse DReps
      </button>
    </div>
    <div className={styles.formShell}>{children}</div>
  </div>
);

export default VotingPowerDelegationWithSelectorDemo;
