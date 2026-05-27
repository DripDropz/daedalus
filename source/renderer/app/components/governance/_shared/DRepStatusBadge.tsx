import React from 'react';
import classNames from 'classnames';
import styles from './DRepStatusBadge.scss';
import type { DRepStatus } from './fixtures';
import { statusLabels } from './fixtures';

type Props = {
  status: DRepStatus;
  expiryEpochs?: number | null;
};

const statusIcons: Record<DRepStatus, string> = {
  active: '●',
  inactive: '○',
  expiring: '⚠',
  retired: '–',
  top35Excluded: 'i',
  selfnodeUnavailable: '⚠',
};

function DRepStatusBadge({ status, expiryEpochs }: Props) {
  const label =
    status === 'expiring' && expiryEpochs !== null && expiryEpochs !== undefined
      ? `Expiring in ${expiryEpochs} epochs`
      : statusLabels[status];

  return (
    <span
      className={classNames(styles.component, styles[status])}
      aria-label={label}
      title={label}
    >
      <span className={styles.icon} aria-hidden="true">
        {statusIcons[status]}
      </span>
      {label}
    </span>
  );
}

export default DRepStatusBadge;
