import React from 'react';
import { SystemProfileLockableSection } from 'gql/generated/graphql';

import { EasiFormProvider, useEasiForm } from 'components/EasiForm';

import SystemProfileFormWrapper from '../_components/SystemProfileFormWrapper';

const ToolsAndSoftware = () => {
  const form = useEasiForm();

  return (
    <EasiFormProvider {...form}>
      <SystemProfileFormWrapper
        section={SystemProfileLockableSection.TOOLS_AND_SOFTWARE}
      >
        section content
      </SystemProfileFormWrapper>
    </EasiFormProvider>
  );
};

export default ToolsAndSoftware;
