import { FundingSource } from 'types/systemIntake';

import { FormattedFundingSource } from '.';

/** Formats funding sources for API */
export const formatFundingSourcesForApi = (
  fundingSources: FormattedFundingSource[]
): FundingSource[] => {
  return fundingSources
    .map(({ id, fundingNumber, sources }) => {
      return sources.map(source => ({
        __typename: 'SystemIntakeFundingSource' as const,
        id,
        projectNumber: fundingNumber,
        investment: source
      }));
    })
    .flat();
};

/** Formats funding sources for app by grouping objects by funding number */
export const formatFundingSourcesForApp = (
  fundingSources: FundingSource[]
): FormattedFundingSource[] => {
  return fundingSources.reduce<FormattedFundingSource[]>(
    (acc, { id, projectNumber, investment }) => {
      const existingSource = acc.find(s => s.fundingNumber === projectNumber);

      if (investment && existingSource) {
        existingSource.sources.push(investment);
        return acc;
      }

      return [
        ...acc,
        {
          __typename: 'SystemIntakeFundingSource',
          id,
          fundingNumber: projectNumber ?? null,
          sources: investment ? [investment] : []
        }
      ];
    },
    []
  );
};
