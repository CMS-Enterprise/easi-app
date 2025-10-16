import React from 'react';

import { EasiFormProvider, useEasiForm } from 'components/EasiForm';

import SystemProfileFormWrapper from '../_components/SystemProfileFormWrapper';

const FundingAndBudget = () => {
  const form = useEasiForm();

  return (
    <EasiFormProvider {...form}>
      <SystemProfileFormWrapper section="FUNDING_AND_BUDGET" readOnly>
        section content
      </SystemProfileFormWrapper>
    </EasiFormProvider>
  );
};

export default FundingAndBudget;
