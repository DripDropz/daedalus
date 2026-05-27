/*
Mock DRep identities sourced from CIP-119 test vectors:
- SIPO (mainnet)              https://sipo.tokyo/drep/SIPO.jsonld
- Cardano Academy (preprod)   https://raw.githubusercontent.com/cardano-foundation/cardano-academy/refs/heads/main/Cardano%20Academy.jsonld
- CIP-119 example             https://github.com/cardano-foundation/CIPs/blob/master/CIP-0119/examples/drep.jsonld
Real CIP-105 (drep_vkh1...) forms are placeholders - visual layout only, not for production wiring.
*/

import React from 'react';
import { action } from '@storybook/addon-actions';
import { select } from '@storybook/addon-knobs';
import DRepIdDisplay from '../../../../source/renderer/app/components/governance/_shared/DRepIdDisplay';
import DRepSourceLabel from '../../../../source/renderer/app/components/governance/_shared/DRepSourceLabel';

export type CurrentVoteKind =
  | 'noDelegation'
  | 'drep'
  | 'abstain'
  | 'no_confidence';

export type CurrentVoteKnobValue =
  | 'noDelegation'
  | 'drepVerified'
  | 'drepUnverified'
  | 'abstain'
  | 'noConfidence';

export const CURRENT_VOTE_OPTIONS: Record<string, CurrentVoteKnobValue> = {
  'Not delegated (warning)': 'noDelegation',
  'DRep — verified anchor': 'drepVerified',
  'DRep — unverified anchor': 'drepUnverified',
  Abstain: 'abstain',
  'No Confidence': 'noConfidence',
};

export type MockDRepIdentity = {
  cip129: string;
  cip105: string;
  givenName: string;
  anchorUrl: string;
  viewDetailsHref: string;
};

export const MOCK_DREP_SIPO: MockDRepIdentity = {
  cip129: 'drep120m237kstm7pzywv5nwtjm8gj8dl55j9nupwlkapz77mgv7zu7l',
  // Placeholder: real CIP-105 form would be derived from the same credential.
  cip105: 'drep_vkh1mocksipoplaceholder0000000000000000000000000000000000',
  givenName: 'SIPO',
  anchorUrl: 'https://sipo.tokyo/drep/SIPO.jsonld',
  viewDetailsHref:
    '#/voting/governance/drep/drep120m237kstm7pzywv5nwtjm8gj8dl55j9nupwlkapz77mgv7zu7l',
};

const MOCK_DREP_CARDANO_ACADEMY_CIP129 =
  'drep1mockcardanoacademypreprod0000000000000000000000000000';

export const MOCK_DREP_CARDANO_ACADEMY: MockDRepIdentity = {
  // Placeholder: preprod test-vector metadata, not a production DRep id.
  cip129: MOCK_DREP_CARDANO_ACADEMY_CIP129,
  // Placeholder: real CIP-105 form would be derived from the same credential.
  cip105:
    'drep_vkh1mockcardanoacademypreprod0000000000000000000000000000',
  givenName: 'Cardano Academy Course',
  anchorUrl:
    'https://raw.githubusercontent.com/cardano-foundation/cardano-academy/refs/heads/main/Cardano%20Academy.jsonld',
  viewDetailsHref: `#/voting/governance/drep/${MOCK_DREP_CARDANO_ACADEMY_CIP129}`,
};

const MOCK_DREP_CIP119_EXAMPLE_CIP129 =
  'drep1mockcip119example0000000000000000000000000000000000';

export const MOCK_DREP_CIP119_EXAMPLE: MockDRepIdentity = {
  cip129: MOCK_DREP_CIP119_EXAMPLE_CIP129,
  // Placeholder: real CIP-105 form would be derived from the same credential.
  cip105: 'drep_vkh1mockcip119example0000000000000000000000000000000',
  givenName: 'CIP-119 example DRep',
  anchorUrl:
    'https://github.com/cardano-foundation/CIPs/blob/master/CIP-0119/examples/drep.jsonld',
  viewDetailsHref: `#/voting/governance/drep/${MOCK_DREP_CIP119_EXAMPLE_CIP129}`,
};

export type CurrentVoteMockState =
  | { kind: 'noDelegation' }
  | {
      kind: 'drep';
      identity: MockDRepIdentity;
      source: 'verified' | 'unverified';
    }
  | { kind: 'abstain' }
  | { kind: 'no_confidence' };

type CurrentVoteMockTarget = Exclude<
  CurrentVoteMockState,
  { kind: 'noDelegation' }
>;

export function resolveCurrentVoteKnob(
  value: CurrentVoteKnobValue
): CurrentVoteMockState {
  switch (value) {
    case 'noDelegation':
      return { kind: 'noDelegation' };
    case 'drepVerified':
      return {
        kind: 'drep',
        identity: MOCK_DREP_SIPO,
        source: 'verified',
      };
    case 'drepUnverified':
      return {
        kind: 'drep',
        identity: MOCK_DREP_CIP119_EXAMPLE,
        source: 'unverified',
      };
    case 'abstain':
      return { kind: 'abstain' };
    case 'noConfidence':
      return { kind: 'no_confidence' };
    default:
      return { kind: 'noDelegation' };
  }
}

export const currentVoteKnob = (
  label = 'Current vote (mock)',
  defaultValue: CurrentVoteKnobValue = 'noDelegation'
): CurrentVoteKnobValue =>
  select(label, CURRENT_VOTE_OPTIONS, defaultValue) as CurrentVoteKnobValue;

const chooseDelegationAction = action('chooseDelegation');

const panelStyle: React.CSSProperties = {
  background: '#ffffff',
  border: '1px solid rgba(61, 78, 117, 0.16)',
  borderRadius: 6,
  color: '#1f2937',
  display: 'flex',
  flexDirection: 'column',
  gap: 12,
  padding: 16,
};

const sectionStyle: React.CSSProperties = {
  background: 'rgba(15, 23, 42, 0.03)',
  border: '1px solid rgba(61, 78, 117, 0.14)',
  borderRadius: 4,
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
  minWidth: 0,
  padding: 12,
};

const sectionHeaderStyle: React.CSSProperties = {
  color: '#4b5563',
  fontSize: 11,
  fontWeight: 600,
  letterSpacing: '0.04em',
  margin: 0,
  textTransform: 'uppercase',
};

const badgeStyle: React.CSSProperties = {
  alignItems: 'center',
  background: 'rgba(49, 84, 163, 0.1)',
  border: '1px solid rgba(49, 84, 163, 0.3)',
  borderRadius: 999,
  color: '#1d3a8a',
  display: 'inline-flex',
  fontSize: 12,
  fontWeight: 600,
  gap: 6,
  padding: '4px 10px',
  width: 'fit-content',
};

const captionStyle: React.CSSProperties = {
  color: '#6b7280',
  fontSize: 11,
  lineHeight: 1.45,
  margin: 0,
};

const linkRowStyle: React.CSSProperties = {
  alignItems: 'center',
  display: 'flex',
  flexWrap: 'wrap',
  gap: 10,
};

const linkStyle: React.CSSProperties = {
  color: '#3154a3',
  fontSize: 12,
  fontWeight: 600,
  textDecoration: 'none',
};

const mockNoteStyle: React.CSSProperties = {
  color: '#9ca3af',
  fontSize: 10,
  fontStyle: 'italic',
  margin: 0,
};

const primaryButtonStyle: React.CSSProperties = {
  background: '#3154a3',
  border: 0,
  borderRadius: 4,
  color: '#ffffff',
  cursor: 'pointer',
  fontSize: 12,
  fontWeight: 600,
  padding: '8px 12px',
  width: 'fit-content',
};

const warningStyle: React.CSSProperties = {
  background: 'rgba(254, 240, 138, 0.25)',
  border: '1px solid rgba(202, 138, 4, 0.4)',
  borderRadius: 4,
  color: '#854d0e',
  fontSize: 12,
  fontWeight: 600,
  lineHeight: 1.45,
  margin: 0,
  padding: 12,
};

function renderDRepTarget(
  target: Extract<CurrentVoteMockState, { kind: 'drep' }>
) {
  const { identity, source } = target;
  return (
    <>
      <span style={badgeStyle}>● Delegated to DRep</span>
      <strong style={{ fontSize: 14 }}>{identity.givenName}</strong>
      <DRepSourceLabel type={source} />
      <DRepIdDisplay
        cip129={identity.cip129}
        cip105={identity.cip105}
        compact
      />
      <div style={linkRowStyle}>
        <a href={identity.viewDetailsHref} style={linkStyle}>
          View details
        </a>
        <a
          href={identity.anchorUrl}
          rel="noopener noreferrer"
          style={linkStyle}
          target="_blank"
        >
          Anchor metadata ↗
        </a>
      </div>
    </>
  );
}

function renderTarget(target: CurrentVoteMockTarget) {
  if (target.kind === 'abstain') {
    return (
      <>
        <span style={badgeStyle}>⊘ Abstain</span>
        <p style={captionStyle}>
          Your stake is recorded on chain as not participating in governance.
          Rewards can be withdrawn.
        </p>
      </>
    );
  }

  if (target.kind === 'no_confidence') {
    return (
      <>
        <span style={badgeStyle}>✕ No Confidence</span>
        <p style={captionStyle}>
          Your stake counts as Yes on every motion of no-confidence. Rewards can
          be withdrawn.
        </p>
      </>
    );
  }

  return renderDRepTarget(target);
}

type CurrentVoteSummaryMockProps = {
  state: CurrentVoteMockState;
};

export function CurrentVoteSummaryMock({ state }: CurrentVoteSummaryMockProps) {
  return (
    <div style={panelStyle}>
      <p style={mockNoteStyle}>
        Storybook mock — preview of proposed CurrentVoteSummary. Not wired to
        production data.
      </p>
      {state.kind === 'noDelegation' && (
        <div style={sectionStyle}>
          <p style={sectionHeaderStyle}>No governance delegation</p>
          <p style={warningStyle}>
            Your staking rewards cannot be withdrawn until you delegate this
            wallet&apos;s voting power to a DRep, Abstain, or No Confidence.
          </p>
          <p style={captionStyle}>
            Daedalus will not pick a DRep for you — choose how you want your
            voting power to participate in Cardano governance.
          </p>
          <button
            onClick={chooseDelegationAction}
            style={primaryButtonStyle}
            type="button"
          >
            Choose a delegation
          </button>
        </div>
      )}
      {state.kind === 'drep' && (
        <div style={sectionStyle}>
          <p style={sectionHeaderStyle}>Current delegation</p>
          {renderTarget(state)}
        </div>
      )}
      {state.kind === 'abstain' && (
        <div style={sectionStyle}>
          <p style={sectionHeaderStyle}>Current delegation</p>
          {renderTarget(state)}
        </div>
      )}
      {state.kind === 'no_confidence' && (
        <div style={sectionStyle}>
          <p style={sectionHeaderStyle}>Current delegation</p>
          {renderTarget(state)}
        </div>
      )}
    </div>
  );
}

export default CurrentVoteSummaryMock;