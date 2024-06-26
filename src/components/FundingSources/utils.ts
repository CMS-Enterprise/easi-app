import { FundingSource } from 'types/systemIntake';

import { FormattedFundingSource } from '.';

/** Formats funding sources for API */
export const formatFundingSourcesForApi = (
  fundingSources: FormattedFundingSource[]
): FundingSource[] => {
  return fundingSources
    .map(({ id, fundingNumber, sources }) => {
      return sources.map(source => ({
        id,
        fundingNumber,
        source
      }));
    })
    .flat();
};

/** Formats funding sources for app by grouping objects by funding number */
export const formatFundingSourcesForApp = (
  fundingSources: FundingSource[]
): FormattedFundingSource[] => {
  return fundingSources.reduce<FormattedFundingSource[]>(
    (acc, { id, fundingNumber, source }) => {
      const existingSource = acc.find(s => s.fundingNumber === fundingNumber);

      if (source && existingSource) {
        existingSource.sources.push(source);
        return acc;
      }

      return [
        ...acc,
        {
          id,
          fundingNumber,
          sources: source ? [source] : []
        }
      ];
    },
    []
  );
};
