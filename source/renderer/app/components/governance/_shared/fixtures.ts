import BigNumber from 'bignumber.js';

export type DRepStatus =
  | 'active'
  | 'inactive'
  | 'expiring'
  | 'retired'
  | 'top35Excluded'
  | 'selfnodeUnavailable';

export type DRepSourceType =
  | 'onchain'
  | 'anchorReference'
  | 'verified'
  | 'unverified'
  | 'anchorUnavailable';

export type DRepRefreshState =
  | 'idle'
  | 'refreshing'
  | 'failed'
  | 'rankingUnavailable';

export type DRepEmptyStateVariant =
  | 'noResults'
  | 'selfnode'
  | 'noSync'
  | 'favoritesEmpty';

export type DRepErrorVariant = 'refreshFailed' | 'rankingUnavailable';

export type DRepAnchor = {
  url: string;
  hash: string;
  isAvailable: boolean;
  isVerified: boolean;
  verifiedName?: string;
  objectives?: string;
  motivations?: string;
  qualifications?: string;
  paymentAddress?: string;
};

export type DRepVoteTally = {
  yes: number;
  no: number;
  abstain: number;
};

export type DRepFixture = {
  cip129: string;
  cip105: string;
  credentialHex: string;
  displayName: string;
  status: DRepStatus;
  expiryEpochs: number | null;
  registrationEpoch: number;
  votingPower: BigNumber | null;
  currentEpochVotes: DRepVoteTally;
  anchor: DRepAnchor | null;
  isFavorite: boolean;
  isTop35: boolean;
  hasRanking: boolean;
};

type DRepFixtureSpec = {
  displayName: string;
  status: DRepStatus;
  votingPower: string | null;
  expiryEpochs?: number | null;
  registrationEpoch: number;
  isFavorite?: boolean;
  isTop35?: boolean;
  hasRanking?: boolean;
  anchor?: Partial<DRepAnchor> | null;
  currentEpochVotes?: Partial<DRepVoteTally>;
};

const ADA_LOVELACE = new BigNumber(1000000);

const CIP129_SEEDS = [
  'g7svuv02gh9j2q574jv06l4xnzwyp63effljze28qe993caj8ras',
  'tfn6m2t8qfpxdl4z5luea62ajf4704m9k3pa5q2l7egaf3n5y',
  '2t3tky83r9f4z0aeqz3dqfy5y64nd76e6pdvyx8k3aawgyv7',
  'kd9s5s5e93psrk7r6hazqnccyyx3nyfp9lkry6sql7xrcsw2k',
  '95mglw0y0qzq50vtp9d2hl06s6c39g2g5lvd8lqk8mq6s6q4p',
  'h6zkljvmsrf2y84cl4lfqa3q6u0dvq0vt0v8tg2a4qz66mnqj',
  'xl0ml4z4l7v4pp4023zpqr5q2g0vtpyf9n9y3gnlhm4m6wlxw',
  '38rxv9v9gr5lrnavggsy7r20nwvr2x7avz9cx8sgexf3l7pcg',
];

const CIP105_SEEDS = [
  '85r8rr6j9evjsjhjw8p7q5k3f9m43qq5mkjv6jtfl4uutaz3',
  'ykh7szh5vp7qfpmp9sekhc83rq8k5hdpczn7pajxv4cvp07k',
  'x2d58fd3ltv9qulkxwtnnr2y47k0plx2egc2y5cpw6mt49k7',
  'grsfwy0xh7x9s5d2epm6h6ezr7kq6q45d9fdrqwq78u5ypak',
  't4jjcd4vc5d8p2xm82u7r8lmq6f3a0z70p5gyvgv3pe8u6qz',
  'u3sqle0n2n4jqy2mrkzhjff89zhv26a76t4w5p87n8rlf0z7',
  '4ee3sj9plpdmn6lh5e8s5x6h8ap99jz5whs5r3ckzvywk6xa',
  'pahdlxjk3z3t2sl0q0pk0kglj0ml86c59p2jw6nq3c46nzye',
];

const makeCredentialHex = (index: number) =>
  `${(index + 1).toString(16).padStart(2, '0')}`.repeat(28);

const makeCip129 = (index: number) =>
  `drep1y${CIP129_SEEDS[index % CIP129_SEEDS.length]}${index
    .toString(36)
    .padStart(2, '0')}`;

const makeCip105 = (index: number) =>
  `drep1${CIP105_SEEDS[index % CIP105_SEEDS.length]}${index
    .toString(36)
    .padStart(2, '0')}`;

const makeAnchor = (
  index: number,
  displayName: string,
  anchor?: Partial<DRepAnchor> | null
): DRepAnchor | null => {
  if (anchor === null) return null;
  const isAvailable = anchor?.isAvailable ?? true;
  const isVerified = anchor?.isVerified ?? false;
  return {
    url:
      anchor?.url ??
      `https://governance-preview.example.org/dreps/${index + 1}.json`,
    hash:
      anchor?.hash ??
      `b5e2${(index + 1).toString(16).padStart(4, '0')}f3a1${makeCredentialHex(
        index
      ).slice(0, 24)}`,
    isAvailable,
    isVerified,
    verifiedName: anchor?.verifiedName ?? displayName,
    objectives:
      anchor?.objectives ??
      'Keep treasury decisions legible, pragmatic, and accountable to long-term protocol health.',
    motivations:
      anchor?.motivations ??
      'Independent governance analysis, transparent vote rationales, and regular community office hours.',
    qualifications:
      anchor?.qualifications ??
      'Protocol governance contributor with experience reviewing parameter-change and treasury proposals.',
    paymentAddress:
      anchor?.paymentAddress ??
      'addr1q9previewstakeholderdemofixturepaymentaddress0000000000000000',
  };
};

const createFixture = (spec: DRepFixtureSpec, index: number): DRepFixture => ({
  cip129: makeCip129(index),
  cip105: makeCip105(index),
  credentialHex: makeCredentialHex(index),
  displayName: spec.displayName,
  status: spec.status,
  expiryEpochs: getExpiryEpochs(spec, index),
  registrationEpoch: spec.registrationEpoch,
  votingPower: spec.votingPower ? new BigNumber(spec.votingPower) : null,
  currentEpochVotes: {
    yes: spec.currentEpochVotes?.yes ?? index % 5,
    no: spec.currentEpochVotes?.no ?? (index + 2) % 4,
    abstain: spec.currentEpochVotes?.abstain ?? (index + 1) % 3,
  },
  anchor: makeAnchor(index, spec.displayName, spec.anchor),
  isFavorite: spec.isFavorite ?? index % 6 === 0,
  isTop35: spec.isTop35 ?? false,
  hasRanking: spec.hasRanking ?? spec.votingPower !== null,
});

const DREP_SPECS: Array<DRepFixtureSpec> = [
  {
    displayName: 'Ada Commons Guild',
    status: 'active',
    votingPower: '688964123456',
    registrationEpoch: 502,
    isFavorite: true,
    currentEpochVotes: { yes: 2, no: 1, abstain: 0 },
  },
  {
    displayName: 'Ledger Policy Lab',
    status: 'active',
    votingPower: '23137980123456',
    registrationEpoch: 498,
    anchor: { isVerified: true },
  },
  {
    displayName: 'Voltaire Workshop',
    status: 'expiring',
    votingPower: '2300456000000',
    registrationEpoch: 486,
    expiryEpochs: 3,
  },
  {
    displayName: 'Civic Parameters Collective',
    status: 'active',
    votingPower: '12345678901234567890',
    registrationEpoch: 470,
    isTop35: true,
  },
  {
    displayName: 'Protocol Stewards Forum',
    status: 'inactive',
    votingPower: '140000000000',
    registrationEpoch: 451,
    anchor: null,
  },
  {
    displayName: 'Treasury Review Circle',
    status: 'retired',
    votingPower: '0',
    registrationEpoch: 421,
    expiryEpochs: null,
    anchor: { isAvailable: false },
  },
  {
    displayName: 'Open Source Governance Desk',
    status: 'active',
    votingPower: null,
    registrationEpoch: 509,
    hasRanking: false,
  },
  {
    displayName: 'Research Methods DRep',
    status: 'active',
    votingPower: '940045000000',
    registrationEpoch: 503,
    isFavorite: true,
  },
  {
    displayName: 'Community Moderation Bench',
    status: 'inactive',
    votingPower: '35000000000',
    registrationEpoch: 499,
  },
  {
    displayName: 'Constitution Readers Group',
    status: 'active',
    votingPower: '8123000000000',
    registrationEpoch: 512,
    anchor: { isVerified: true },
  },
  {
    displayName: 'Metadata Reliability Lab',
    status: 'expiring',
    votingPower: '784000000000',
    registrationEpoch: 477,
    expiryEpochs: 6,
  },
  {
    displayName: 'Budget Transparency DRep',
    status: 'active',
    votingPower: '4100000000000',
    registrationEpoch: 490,
  },
  {
    displayName: 'Local Nodes Caucus',
    status: 'active',
    votingPower: '196500000000',
    registrationEpoch: 505,
    isFavorite: true,
  },
  {
    displayName: 'Operator Experience Council',
    status: 'active',
    votingPower: '15000000000000',
    registrationEpoch: 468,
    isTop35: true,
  },
  {
    displayName: 'Education Grants Review',
    status: 'inactive',
    votingPower: '9900000000',
    registrationEpoch: 459,
  },
  {
    displayName: 'Latin America Delegation Desk',
    status: 'active',
    votingPower: '1777000000000',
    registrationEpoch: 492,
    anchor: { isVerified: true },
  },
  {
    displayName: 'Japan Governance Study Group',
    status: 'active',
    votingPower: '622340000000',
    registrationEpoch: 487,
  },
  {
    displayName: 'Africa Builders Assembly',
    status: 'active',
    votingPower: '934500000000',
    registrationEpoch: 489,
  },
  {
    displayName: 'Cardano Civics Library',
    status: 'expiring',
    votingPower: '214900000000',
    registrationEpoch: 500,
    expiryEpochs: 2,
  },
  {
    displayName: 'Wallet UX Advisory Seat',
    status: 'active',
    votingPower: '365000000000',
    registrationEpoch: 511,
    isFavorite: true,
  },
  {
    displayName: 'Audit Trail Advocates',
    status: 'active',
    votingPower: '725000000000',
    registrationEpoch: 504,
  },
  {
    displayName: 'Public Goods Review Board',
    status: 'retired',
    votingPower: '0',
    registrationEpoch: 420,
    expiryEpochs: null,
  },
  {
    displayName: 'Plutus Impact Desk',
    status: 'active',
    votingPower: '5790000000000',
    registrationEpoch: 494,
    isTop35: true,
  },
  {
    displayName: 'SPO Governance Roundtable',
    status: 'active',
    votingPower: '1094500000000',
    registrationEpoch: 485,
  },
  {
    displayName: 'Small Wallet Coalition',
    status: 'active',
    votingPower: '84500000000',
    registrationEpoch: 506,
  },
  {
    displayName: 'Anchor Integrity Preview',
    status: 'active',
    votingPower: '430000000000',
    registrationEpoch: 510,
    anchor: { isAvailable: false },
  },
  {
    displayName: 'CIP Editors Watch',
    status: 'inactive',
    votingPower: '512000000000',
    registrationEpoch: 493,
  },
  {
    displayName: 'Parameter Change Desk',
    status: 'active',
    votingPower: '3120000000000',
    registrationEpoch: 488,
  },
  {
    displayName: 'Community Treasury Ombuds',
    status: 'active',
    votingPower: '271000000000',
    registrationEpoch: 507,
    isFavorite: true,
  },
  {
    displayName: 'Selfnode Preview Placeholder',
    status: 'selfnodeUnavailable',
    votingPower: null,
    registrationEpoch: 0,
    expiryEpochs: null,
    hasRanking: false,
    anchor: null,
  },
];

function getExpiryEpochs(spec: DRepFixtureSpec, index: number): number | null {
  if (spec.expiryEpochs !== undefined) return spec.expiryEpochs;
  if (spec.status === 'expiring') return 4;
  return 34 + (index % 28);
}

export const DREP_FIXTURES: Array<DRepFixture> = DREP_SPECS.map(createFixture);

export const VALID_DREP_ID =
  'drep1ygqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq7vlc9n';

export const formatCompactAda = (lovelace: BigNumber | null): string => {
  if (!lovelace) return '—';
  const ada = lovelace.dividedBy(ADA_LOVELACE);
  if (ada.isZero()) return '₳ 0';
  if (ada.isGreaterThanOrEqualTo(1000000000)) {
    return `₳ ${ada.dividedBy(1000000000).toFormat(1)}B`;
  }
  if (ada.isGreaterThanOrEqualTo(1000000)) {
    return `₳ ${ada.dividedBy(1000000).toFormat(1)}M`;
  }
  if (ada.isGreaterThanOrEqualTo(1000)) {
    return `₳ ${ada.dividedBy(1000).toFormat(0)}K`;
  }
  return `₳ ${ada.toFormat(0)}`;
};

export const formatExactAda = (
  lovelace: BigNumber | null
): { ada: string; lovelace: string } => {
  if (!lovelace) {
    return {
      ada: '—',
      lovelace: 'Stake distribution unavailable this refresh.',
    };
  }
  const ada = lovelace.dividedBy(ADA_LOVELACE);
  return {
    ada: `₳ ${ada.toFormat(6)}`,
    lovelace: `(${lovelace.toFormat(0)} lovelace)`,
  };
};

export const truncateMiddle = (value: string, head = 12, tail = 6): string => {
  if (value.length <= head + tail + 1) return value;
  return `${value.slice(0, head)}…${value.slice(-tail)}`;
};

export const statusLabels: Record<DRepStatus, string> = {
  active: 'Active',
  inactive: 'Inactive',
  expiring: 'Expiring',
  retired: 'Retired',
  top35Excluded: 'Excluded from default cohort',
  selfnodeUnavailable: 'DRep data unavailable on selfnode',
};

export const sourceLabels: Record<DRepSourceType, string> = {
  onchain: 'On-chain',
  anchorReference: 'On-chain anchor reference',
  verified: 'Verified off-chain content',
  unverified: 'Unverified anchor',
  anchorUnavailable: 'Anchor unavailable',
};
