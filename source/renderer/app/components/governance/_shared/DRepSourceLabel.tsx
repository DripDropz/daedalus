import React from 'react';
import classNames from 'classnames';
import styles from './DRepSourceLabel.scss';
import type { DRepSourceType } from './fixtures';
import { sourceLabels } from './fixtures';

type Props = {
  type: DRepSourceType;
};

const sourceTooltips: Record<DRepSourceType, string> = {
  onchain: 'Read directly from the Cardano ledger by your local node.',
  anchorReference:
    'The anchor URL and hash recorded on-chain. Content is not fetched or verified at this label.',
  verified: 'Fetched from the anchor host and hash-matched on-chain.',
  unverified:
    'Anchor content fetched but not yet hash-verified. Treat as untrusted.',
  anchorUnavailable:
    'The anchor URL could not be retrieved or did not match the on-chain hash.',
};

const sourceIcons: Record<DRepSourceType, string> = {
  onchain: 'chain',
  anchorReference: 'link',
  verified: 'shield',
  unverified: 'pending',
  anchorUnavailable: 'warn',
};

function DRepSourceLabel({ type }: Props) {
  return (
    <span
      className={classNames(styles.component, styles[type])}
      aria-label={sourceTooltips[type]}
      title={sourceTooltips[type]}
    >
      <span className={styles.icon} aria-hidden="true">
        {sourceIcons[type]}
      </span>
      {sourceLabels[type]}
    </span>
  );
}

export default DRepSourceLabel;
