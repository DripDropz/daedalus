import React from 'react';
import styles from './DRepSelectorCompactDetailV2.scss';
import DRepIdDisplay from '../../../governance/_shared/DRepIdDisplay';
import DRepSourceLabel from '../../../governance/_shared/DRepSourceLabel';
import DRepStatusBadge from '../../../governance/_shared/DRepStatusBadge';
import type { DRepFixture } from '../../../governance/_shared/fixtures';
import { formatCompactAda } from '../../../governance/_shared/fixtures';

type Props = {
  drep: DRepFixture;
  showVerifiedAnchor?: boolean;
  onSelectDRep: (drep: DRepFixture) => void;
};

const DRepSelectorCompactDetailV2 = ({
  drep,
  showVerifiedAnchor = false,
  onSelectDRep,
}: Props) => {
  const votingPower = formatCompactAda(drep.votingPower);
  const anchorSource =
    drep.anchor && drep.anchor.isAvailable
      ? showVerifiedAnchor && drep.anchor.isVerified
        ? 'verified'
        : 'anchorReference'
      : 'anchorUnavailable';

  return (
    <aside className={styles.component} aria-label="Highlighted DRep details">
      <div className={styles.header}>
        <h3>{drep.displayName}</h3>
        <DRepStatusBadge
          status={drep.status}
          expiryEpochs={drep.expiryEpochs}
        />
      </div>
      <DRepIdDisplay compact cip129={drep.cip129} cip105={drep.cip105} />
      <dl className={styles.definitionList}>
        <div>
          <dt>Expiry</dt>
          <dd>
            {drep.expiryEpochs === null
              ? 'Not applicable'
              : `${drep.expiryEpochs} epochs`}
          </dd>
        </div>
        <div>
          <dt>Voting power</dt>
          <dd>
            <span aria-label={`Voting power ${votingPower} ada`}>
              {votingPower}
            </span>
          </dd>
        </div>
        <div>
          <dt>Anchor</dt>
          <dd>
            <DRepSourceLabel type={anchorSource} />
          </dd>
        </div>
      </dl>
      <button
        type="button"
        className={styles.selectButton}
        aria-label={`Select ${drep.cip129} and close selector`}
        onClick={() => onSelectDRep(drep)}
      >
        Select & close
      </button>
    </aside>
  );
};

export default DRepSelectorCompactDetailV2;
