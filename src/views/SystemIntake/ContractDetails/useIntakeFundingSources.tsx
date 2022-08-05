import { useEffect, useMemo, useState } from 'react';

import {
  FormattedFundingSourcesObject,
  FundingSource,
  MultiFundingSource,
  UpdateActiveFundingSource,
  UpdateFundingSources,
  UseIntakeFundingSources
} from 'types/systemIntake';

// Empty funding source
const emptyFundingSource: MultiFundingSource = {
  fundingNumber: '',
  sources: []
};

// Custom hook for system intake funding source actions
export default function useIntakeFundingSources(
  initialFundingSources: FundingSource[],
  setFieldValue: (field: string, value: any) => void,
  validateField: (field: string) => void
): UseIntakeFundingSources {
  // Format initial funding sources
  const initialFundingSourcesObject = useMemo(() => {
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

  // Funding sources state
  const [
    fundingSources,
    setFundingSources
  ] = useState<FormattedFundingSourcesObject>(initialFundingSourcesObject);

  // Active funding source - used in form
  const [activeFundingSource, setActiveFundingSource] = useState<{
    data: MultiFundingSource;
    action: 'Add' | 'Edit' | 'Reset';
  }>({ data: emptyFundingSource, action: 'Reset' });

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
  ): FundingSource[] => {
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

    // If deleting funding source, delete source
    if (action === 'Delete') {
      delete updatedFundingSources[fundingNumber];
    } else {
      // If editing funding source, delete initial source
      if (action === 'Edit') {
        delete updatedFundingSources[data.initialFundingNumber];
      }
      // If creating or editing funding source, add source
      updatedFundingSources = {
        ...updatedFundingSources,
        [fundingNumber]: data
      };
    }

    // Set funding sources with new values
    setFundingSources(updatedFundingSources);
    // Set funding sources field value
    setFieldValue('fundingSources', formatSourcesForApi(updatedFundingSources));
  }

  // When funding source form is submitted, reset active funding source
  useEffect(() => {
    const hasFundingSources = Object.keys(fundingSources).length > 0;
    if (hasFundingSources) validateField('fundingSources');
    setActiveFundingSource({
      action: 'Reset',
      data: emptyFundingSource
    });
  }, [fundingSources, validateField]);

  return {
    fundingSources: [fundingSources, updateFundingSources],
    activeFundingSource: [
      activeFundingSource?.data,
      updateActiveFundingSource,
      activeFundingSource?.action
    ]
  };
}
