import React from 'react';

import { EasiFormProvider, useEasiForm } from 'components/EasiForm';

import SystemProfileFormWrapper from '../_components/SystemProfileFormWrapper';

const Contracts = () => {
  const form = useEasiForm();

  return (
    <EasiFormProvider {...form}>
      <SystemProfileFormWrapper
        section="CONTRACTS"
        readOnly
        hasExternalData={false}
      >
        section content
      </SystemProfileFormWrapper>
    </EasiFormProvider>
  );
};

export default Contracts;
