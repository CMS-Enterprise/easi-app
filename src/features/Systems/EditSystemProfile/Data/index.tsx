import React from 'react';
import { SystemProfileLockableSection } from 'gql/generated/graphql';

import { EasiFormProvider, useEasiForm } from 'components/EasiForm';

import SystemProfileFormWrapper from '../_components/SystemProfileFormWrapper';

const Data = () => {
  const form = useEasiForm();

  return (
    <EasiFormProvider {...form}>
      <SystemProfileFormWrapper section={SystemProfileLockableSection.DATA}>
        section content
      </SystemProfileFormWrapper>
    </EasiFormProvider>
  );
};

export default Data;
