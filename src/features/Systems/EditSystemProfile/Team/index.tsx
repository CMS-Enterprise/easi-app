import React from 'react';
import { SystemProfileLockableSection } from 'gql/generated/graphql';

import { EasiFormProvider, useEasiForm } from 'components/EasiForm';

import SystemProfileFormWrapper from '../_components/SystemProfileFormWrapper';

const Team = () => {
  const form = useEasiForm();

  return (
    <EasiFormProvider {...form}>
      <SystemProfileFormWrapper
        section={SystemProfileLockableSection.TEAM}
        percentComplete={0}
      >
        section content
      </SystemProfileFormWrapper>
    </EasiFormProvider>
  );
};

export default Team;
