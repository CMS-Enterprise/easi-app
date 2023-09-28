import React, { useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';
import { useOktaAuth } from '@okta/okta-react';
import {
  AsyncProviderConfig,
  asyncWithLDProvider
} from 'launchdarkly-react-client-sdk';

import GetCurrentUserQuery from 'queries/GetCurrentUserQuery';
import { GetCurrentUser } from 'queries/types/GetCurrentUser';

type WrapperProps = {
  children: React.ReactNode;
};

const LDWrapper = ({ children }: WrapperProps) => {
  // wrapping initial value in function to get around useState and setState thinking
  // the functional component is a function to be evaluated.
  const [LDProvider, setLDProvider] = useState<React.FunctionComponent>(
    () => () => <div />
  );

  const { data } = useQuery<GetCurrentUser>(GetCurrentUserQuery);

  useEffect(() => {
    const ldConfig: AsyncProviderConfig = {
      clientSideID: import.meta.env.VITE_LD_CLIENT_ID as string,
      flags: {
        sandbox: true,
        downgradeGovTeam: false,
        downgrade508User: false,
        downgrade508Tester: false,
        downgradeTrbAdmin: false,
        itGovV2Enabled: false,
        systemProfile: true,
        systemProfileHiddenFields: false,
        cedar508Requests: false,
        technicalAssistance: true,
        hide508Workflow: true,
        serviceAlertEnabled: false
      }
    };

    if (data) {
      ldConfig.context = {
        kind: 'user',
        key: data?.currentUser?.launchDarkly.userKey
      };
      ldConfig.options = {
        hash: data?.currentUser?.launchDarkly.signedHash
      };
    }

    (async () => {
      const provider = await asyncWithLDProvider(ldConfig);

      setLDProvider(() => () => provider({ children }));
    })();
  }, [data, children]);

  return <LDProvider>{children}</LDProvider>;
};

const FlagsWrapper = ({ children }: WrapperProps) => {
  const { authState } = useOktaAuth();
  const Container = authState?.isAuthenticated ? LDWrapper : LDWrapper;

  return <Container>{children}</Container>;
};

export default FlagsWrapper;
