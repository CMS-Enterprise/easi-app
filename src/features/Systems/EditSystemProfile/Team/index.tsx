import React from 'react';
import { SystemProfileLockableSection } from 'gql/generated/graphql';

import { EasiFormProvider, useEasiForm } from 'components/EasiForm';

import SystemProfileFormWrapper from '../_components/SystemProfileFormWrapper';

const Team = () => {
  const form = useEasiForm();

  return (
    <EasiFormProvider {...form}>
      <SystemProfileFormWrapper section={SystemProfileLockableSection.TEAM}>
        team fields here
      </SystemProfileFormWrapper>
    </EasiFormProvider>
  );
};

export default Team;
