import React, { Fragment, useEffect, useRef } from 'react';
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

  const LDProvider = useRef<any>(() => <>{children}</>);

  const { authState } = useOktaAuth();

  const { data } = useQuery<GetCurrentUser>(GetCurrentUserQuery, {
    skip: !authState?.isAuthenticated
  });

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

    // if (data) {
    ldConfig.context = {
      kind: 'user',
      key: data?.currentUser?.launchDarkly.userKey
    };

    ldConfig.options = {
      hash: data?.currentUser?.launchDarkly.signedHash
    };

    (async () => {
      const provider = await asyncWithLDProvider(ldConfig);

      LDProvider.current = () => provider({ children });
    })();
  }, [data, children]);

  const LDProviderWrapper = LDProvider.current;

  return <LDProviderWrapper>{children}</LDProviderWrapper>;
};

const FlagsWrapper = ({ children }: WrapperProps) => {
  return <LDWrapper>{children}</LDWrapper>;
};

export default FlagsWrapper;
