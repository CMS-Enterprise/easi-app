import React from 'react';
import { SystemProfileLockableSection } from 'gql/generated/graphql';

import { EasiFormProvider, useEasiForm } from 'components/EasiForm';

import SystemProfileFormWrapper from '../_components/SystemProfileFormWrapper';

const SubSystems = () => {
  const form = useEasiForm();

  return (
    <EasiFormProvider {...form}>
      <SystemProfileFormWrapper
        section={SystemProfileLockableSection.SUB_SYSTEMS}
      >
        section content
      </SystemProfileFormWrapper>
    </EasiFormProvider>
  );
};

export default SubSystems;
