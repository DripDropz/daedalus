import React from 'react';
import styles from './DRepDetailOnchainSection.scss';
import DRepSourceLabel from './DRepSourceLabel';
import DRepStatusBadge from './DRepStatusBadge';
import type { DRepFixture } from './fixtures';
import { formatExactAda } from './fixtures';

type Props = {
  drep: DRepFixture;
};

function DRepDetailOnchainSection({ drep }: Props) {
  const votingPower = formatExactAda(drep.votingPower);
  const isVotingPowerUnavailable = drep.votingPower === null;
  return (
    <section
      className={styles.component}
      aria-labelledby="drep-onchain-heading"
    >
      <div className={styles.header}>
        <h3 id="drep-onchain-heading">On-chain</h3>
        <DRepSourceLabel type="onchain" />
      </div>
      <dl className={styles.definitionList}>
        <div>
          <dt>Status</dt>
          <dd>
            <DRepStatusBadge
              status={drep.status}
              expiryEpochs={drep.expiryEpochs}
            />
          </dd>
        </div>
        <div>
          <dt>Expires in</dt>
          <dd>
            {drep.expiryEpochs === null
              ? 'Not applicable'
              : `${drep.expiryEpochs} epochs`}
          </dd>
        </div>
        <div>
          <dt>Voting power</dt>
          <dd
            aria-label={`Voting power ${votingPower.ada}`}
            title={
              isVotingPowerUnavailable
                ? 'Stake distribution unavailable this refresh.'
                : undefined
            }
          >
            <strong>{votingPower.ada}</strong>
            {!isVotingPowerUnavailable && <span>{votingPower.lovelace}</span>}
          </dd>
        </div>
        <div>
          <dt>Registered</dt>
          <dd>epoch {drep.registrationEpoch}</dd>
        </div>
        <div>
          <dt>Current votes</dt>
          <dd>
            {drep.currentEpochVotes.yes} Yes · {drep.currentEpochVotes.no} No ·{' '}
            {drep.currentEpochVotes.abstain} Abstain (this epoch)
          </dd>
        </div>
      </dl>
    </section>
  );
}

export default DRepDetailOnchainSection;
