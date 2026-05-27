import type {
  DRepEmptyStateVariant,
  DRepErrorVariant,
  DRepFixture,
  DRepRefreshState,
} from '../../../../source/renderer/app/components/governance/_shared/fixtures';
import {
  DREP_FIXTURES,
  VALID_DREP_ID,
} from '../../../../source/renderer/app/components/governance/_shared/fixtures';

export { DREP_FIXTURES, VALID_DREP_ID };
export type {
  DRepEmptyStateVariant,
  DRepErrorVariant,
  DRepFixture,
  DRepRefreshState,
};

export const refreshStateOptions: Array<DRepRefreshState> = [
  'idle',
  'refreshing',
  'failed',
  'rankingUnavailable',
];

export type ScenarioOptions = {
  resultCount: number;
  showAll: boolean;
  showVerifiedAnchor: boolean;
  rankingUnavailable?: boolean;
  anchorUnavailable?: boolean;
  favoritesOnly?: boolean;
};

export const getScenarioDReps = ({
  resultCount,
  showAll,
  showVerifiedAnchor,
  rankingUnavailable = false,
  anchorUnavailable = false,
  favoritesOnly = false,
}: ScenarioOptions): Array<DRepFixture> => {
  const visibleRows = DREP_FIXTURES.filter((drep) => showAll || !drep.isTop35);
  const withFavoriteFilter = favoritesOnly
    ? visibleRows.filter((drep) => drep.isFavorite)
    : visibleRows;
  const withAnchorState = anchorUnavailable
    ? withFavoriteFilter.filter(
        (drep) => drep.anchor && !drep.anchor.isAvailable
      )
    : withFavoriteFilter;
  const rows = showVerifiedAnchor
    ? withAnchorState
    : withAnchorState.map((drep) => ({
        ...drep,
        anchor: drep.anchor
          ? {
              ...drep.anchor,
              isVerified: false,
            }
          : drep.anchor,
      }));

  const rankedRows = rankingUnavailable
    ? rows.map((drep) => ({
        ...drep,
        votingPower: null,
        hasRanking: false,
      }))
    : rows;

  return rankedRows.slice(
    0,
    Math.max(1, Math.min(resultCount, rankedRows.length))
  );
};

export const getAnchorUnavailableDRep = () =>
  DREP_FIXTURES.find((drep) => drep.anchor && !drep.anchor.isAvailable) ||
  DREP_FIXTURES[0];

export const getVerifiedDRep = () =>
  DREP_FIXTURES.find((drep) => drep.anchor?.isVerified) || DREP_FIXTURES[0];

export const getFavoriteDReps = () =>
  DREP_FIXTURES.filter((drep) => drep.isFavorite);
