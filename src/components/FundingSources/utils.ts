import { SystemIntakeFundingSourceInput } from 'gql/generated/graphql';

import { FormattedFundingSource, FundingSource } from 'types/systemIntake';

/** Formats funding sources for API */
export const formatFundingSourcesForApi = (
  fundingSources: FormattedFundingSource[]
): Array<SystemIntakeFundingSourceInput> => {
  if (fundingSources.length === 0) return [];

  return fundingSources
    .map(({ projectNumber, investments }) => {
      return investments.map(investment => ({
        projectNumber,
        investment
      }));
    })
    .flat();
};

/** Formats funding sources for app by grouping objects by project number */
export const formatFundingSourcesForApp = (
  fundingSources: FundingSource[]
): FormattedFundingSource[] => {
  return fundingSources.reduce<FormattedFundingSource[]>(
    (acc, { projectNumber, investment }) => {
      const existingSource = acc.find(s => s.projectNumber === projectNumber);

      if (investment && existingSource) {
        existingSource.investments.push(investment);
        return acc;
      }

      return [
        ...acc,
        {
          projectNumber: projectNumber ?? null,
          investments: investment ? [investment] : []
        }
      ];
    },
    []
  );
};
