import { FundingSource } from 'types/systemIntake';

import { FormattedFundingSource } from '.';

/** Formats funding sources for API */
export const formatFundingSourcesForApi = (
  fundingSources: FormattedFundingSource[]
): FundingSource[] => {
  return fundingSources
    .map(({ id, projectNumber, investments }) => {
      return investments.map(investment => ({
        __typename: 'SystemIntakeFundingSource' as const,
        id,
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
    (acc, { id, projectNumber, investment }) => {
      const existingSource = acc.find(s => s.projectNumber === projectNumber);

      if (investment && existingSource) {
        existingSource.investments.push(investment);
        return acc;
      }

      return [
        ...acc,
        {
          __typename: 'SystemIntakeFundingSource',
          id,
          projectNumber: projectNumber ?? null,
          investments: investment ? [investment] : []
        }
      ];
    },
    []
  );
};
