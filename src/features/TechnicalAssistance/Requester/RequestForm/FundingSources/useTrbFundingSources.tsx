/**
 * This hook was previously used for both the system intake and TRB forms, and will be
 * deprecated when `/components/FundingSources` is refactored to work with both forms.
 */

import { useEffect, useMemo, useState } from 'react';
import { GetTRBRequestQuery } from 'gql/generated/graphql';

import {
  ExistingFundingSource,
  FormattedFundingSourcesObject,
  MultiFundingSource,
  UpdateActiveFundingSource,
  UpdateFundingSources
} from 'types/technicalAssistance';

type FundingSource = GetTRBRequestQuery['trbRequest']['form']['fundingSources'];

/** useIntakeFundingSources hook return type */
export type UseTrbFundingSources = {
  fundingSources: [
    fundingSources: FormattedFundingSourcesObject,
    updateFundingSources: ({ action, data }: UpdateFundingSources) => void
  ];
  activeFundingSource: [
    activeFundingSource: MultiFundingSource,
    updateActiveFundingSource: (payload: UpdateActiveFundingSource) => void,
    action: 'Add' | 'Edit' | null
  ];
};

type GenericFundingSourceQueryType = {
  fundingNumber: string;
  source: string;
};

// Empty funding source
const emptyFundingSource: MultiFundingSource = {
  fundingNumber: '',
  sources: []
};

export const formatFundingSourcesForRender = (
  initialFundingSources: GenericFundingSourceQueryType[]
): MultiFundingSource[] => {
  const condenseadSources = initialFundingSources.reduce(
    (acc: any, { fundingNumber, source }) => {
      acc[fundingNumber] ??= {
        fundingNumber,
        sources: []
      };
      acc[fundingNumber].sources.push(source);

      return acc;
    },
    {}
  );
  return Object.entries(condenseadSources).map(
    entry => entry[1]
  ) as MultiFundingSource[];
};

/** Custom hook for funding sources functionality in TRB request form */
export default function useTrbFundingSources(
  initialFundingSources: Omit<FundingSource, 'id'>[],
  setFieldValue: (value: any) => void,
  combinedFields?: boolean
): UseTrbFundingSources {
  // Format initial funding sources
  const fundingSources = useMemo(() => {
    // If no initial funding sources, return empty object
    if (!initialFundingSources) return {};
    // Return formatted initial funding sources object
    return initialFundingSources.reduce<FormattedFundingSourcesObject>(
      (acc, fundingSource) => {
        const { fundingNumber, source } = fundingSource as {
          fundingNumber: string;
          source: string;
        };
        // Get array of funding sources
        const sourcesArray = acc[fundingNumber]
          ? [...acc[fundingNumber].sources, source]
          : [source];
        // Return formatted object of funding sources
        return {
          ...acc,
          [fundingNumber]: {
            fundingNumber,
            sources: sourcesArray
          }
        };
      },
      {}
    );
  }, [initialFundingSources]);

  // Active funding source - used in form
  const [activeFundingSource, setActiveFundingSource] = useState<{
    data: MultiFundingSource;
    action: 'Add' | 'Edit' | null;
  }>({ data: emptyFundingSource, action: null });

  // Update active funding source - used in form
  const updateActiveFundingSource = ({
    action,
    data
  }: UpdateActiveFundingSource) => {
    // If no data provided, set to empty funding source
    setActiveFundingSource({
      data: data || emptyFundingSource,
      action
    });
  };

  // Format funding sources for API
  const formatSourcesForApi = (
    sourcesObject: FormattedFundingSourcesObject
  ): Omit<FundingSource, 'id' | '__typename'>[] => {
    return Object.values(sourcesObject)
      .map(sourceObj => {
        const { fundingNumber, sources } = sourceObj;
        return sources.map(source => ({ fundingNumber, source }));
      })
      .flat();
  };

  // Update funding sources in system intake form
  function updateFundingSources({ action, data }: UpdateFundingSources): void {
    const { fundingNumber } = data;
    let updatedFundingSources = { ...fundingSources };

    if (!combinedFields) {
      // If deleting funding source, delete source
      if (action === 'Delete') {
        delete updatedFundingSources[fundingNumber];
      } else {
        // If editing funding source, delete initial source
        if (action === 'Edit') {
          delete updatedFundingSources[
            (data as ExistingFundingSource).initialFundingNumber
          ];
        }
        // If creating or editing funding source, add source
        updatedFundingSources = {
          ...updatedFundingSources,
          [fundingNumber]: data
        };
      }

      // Set funding sources field value
      setFieldValue(formatSourcesForApi(updatedFundingSources));
    } else if (action === 'Delete') {
      // Set funding number as value to delete
      setFieldValue({ delete: fundingNumber });
    } else {
      // Set funding sources field value for a single combined source
      setFieldValue(data);
    }
  }

  // When funding source form is submitted, reset active funding source
  useEffect(() => {
    setActiveFundingSource({
      action: null,
      data: emptyFundingSource
    });
  }, [fundingSources]);

  return {
    fundingSources: [fundingSources, updateFundingSources],
    activeFundingSource: [
      activeFundingSource?.data,
      updateActiveFundingSource,
      activeFundingSource?.action
    ]
  };
}
