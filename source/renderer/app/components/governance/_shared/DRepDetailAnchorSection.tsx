import React from 'react';
import styles from './DRepDetailAnchorSection.scss';
import DRepSourceLabel from './DRepSourceLabel';
import type { DRepFixture } from './fixtures';

type Props = {
  drep: DRepFixture;
  showVerifiedAnchor?: boolean;
};

function getAnchorSourceType(drep: DRepFixture, showVerifiedAnchor: boolean) {
  const { anchor } = drep;
  if (!anchor || !anchor.isAvailable) return 'anchorUnavailable';
  if (showVerifiedAnchor && anchor.isVerified) return 'verified';
  return 'unverified';
}

function DRepDetailAnchorSection({ drep, showVerifiedAnchor = false }: Props) {
  const anchor = drep.anchor;
  const sourceType = getAnchorSourceType(drep, showVerifiedAnchor);
  const headerSourceType = anchor ? 'anchorReference' : 'anchorUnavailable';

  return (
    <section className={styles.component} aria-labelledby="drep-anchor-heading">
      <div className={styles.header}>
        <h3 id="drep-anchor-heading">Anchor</h3>
        <DRepSourceLabel type={headerSourceType} />
      </div>
      {anchor ? (
        <dl className={styles.definitionList}>
          <div>
            <dt>Anchor URL</dt>
            <dd>{anchor.url}</dd>
          </div>
          <div>
            <dt>Anchor hash</dt>
            <dd>{anchor.hash}</dd>
          </div>
          <div>
            <dt>Status</dt>
            <dd>
              <DRepSourceLabel type={sourceType} />
            </dd>
          </div>
        </dl>
      ) : (
        <p className={styles.unavailable}>No on-chain anchor reference.</p>
      )}
      {anchor && showVerifiedAnchor && anchor.isVerified && (
        <div className={styles.verifiedPreview}>
          <div className={styles.verifiedHeader}>
            <strong>{anchor.verifiedName}</strong>
            <DRepSourceLabel type="verified" />
          </div>
          <p>{anchor.objectives}</p>
          <dl>
            <div>
              <dt>Motivations</dt>
              <dd>{anchor.motivations}</dd>
            </div>
            <div>
              <dt>Qualifications</dt>
              <dd>{anchor.qualifications}</dd>
            </div>
            <div>
              <dt>Payment address</dt>
              <dd>{anchor.paymentAddress}</dd>
            </div>
          </dl>
        </div>
      )}
    </section>
  );
}

export default DRepDetailAnchorSection;
