import React from 'react';
import styles from './DRepIdDisplay.scss';
import { truncateMiddle } from './fixtures';

type Props = {
  cip129: string;
  cip105: string;
  compact?: boolean;
  onCopy?: (value: string) => void;
};

function DRepIdDisplay({ cip129, cip105, compact = false, onCopy }: Props) {
  const [announcement, setAnnouncement] = React.useState('');
  const announcementTimeout = React.useRef<ReturnType<
    typeof setTimeout
  > | null>(null);
  const displayCip129 = compact ? truncateMiddle(cip129) : cip129;
  const displayCip105 = compact ? truncateMiddle(cip105) : cip105;

  React.useEffect(
    () => () => {
      if (announcementTimeout.current)
        clearTimeout(announcementTimeout.current);
    },
    []
  );

  const announceCopy = (value: string) => {
    onCopy?.(value);
    setAnnouncement('DRep ID copied');
    if (announcementTimeout.current) clearTimeout(announcementTimeout.current);
    announcementTimeout.current = setTimeout(() => {
      setAnnouncement('');
    }, 2000);
  };

  const handleCopy = async (value: string) => {
    try {
      await navigator.clipboard?.writeText(value);
    } catch {
      announceCopy(value);
      return;
    }
    announceCopy(value);
  };

  const renderRow = (label: string, value: string, displayValue: string) => (
    <div className={styles.row}>
      <span className={styles.label}>{label}</span>
      <code className={styles.value}>{displayValue}</code>
      <button
        type="button"
        className={styles.copyButton}
        aria-label={`Copy ${label} DRep ID`}
        onClick={(event) => {
          event.stopPropagation();
          void handleCopy(value);
        }}
      >
        Copy
      </button>
    </div>
  );

  return (
    <div className={compact ? styles.compact : styles.component}>
      {renderRow('CIP-129', cip129, displayCip129)}
      {renderRow('CIP-105', cip105, displayCip105)}
      <span className={styles.liveRegion} aria-live="polite">
        {announcement}
      </span>
    </div>
  );
}

export default DRepIdDisplay;
