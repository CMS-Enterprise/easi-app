import React from 'react';
import { SystemProfileLockableSection } from 'gql/generated/graphql';

import { EasiFormProvider, useEasiForm } from 'components/EasiForm';

import SystemProfileFormWrapper from '../_components/SystemProfileFormWrapper';

const BusinessInformation = () => {
  const form = useEasiForm();

  return (
    <EasiFormProvider {...form}>
      <SystemProfileFormWrapper
        section={SystemProfileLockableSection.BUSINESS_INFORMATION}
      >
        section content
      </SystemProfileFormWrapper>
    </EasiFormProvider>
  );
};

export default BusinessInformation;
