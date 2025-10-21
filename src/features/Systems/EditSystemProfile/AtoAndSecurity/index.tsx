import React from 'react';

import { EasiFormProvider, useEasiForm } from 'components/EasiForm';

import SystemProfileFormWrapper from '../_components/SystemProfileFormWrapper';

const AtoAndSecurity = () => {
  const form = useEasiForm();

  return (
    <EasiFormProvider {...form}>
      <SystemProfileFormWrapper
        section="ATO_AND_SECURITY"
        readOnly
        hasExternalData={false}
      >
        section content
      </SystemProfileFormWrapper>
    </EasiFormProvider>
  );
};

export default AtoAndSecurity;
