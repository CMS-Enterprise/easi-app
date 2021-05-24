import React, { useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';
import { useOktaAuth } from '@okta/okta-react';
import { asyncWithLDProvider } from 'launchdarkly-react-client-sdk';
import GetCurrentUserQuery from 'queries/GetCurrentUserQuery';
import { GetCurrentUser } from 'queries/types/GetCurrentUser';

type WrapperProps = {
  children: React.ReactNode;
};

const UserTargetingWrapper = ({ children }: WrapperProps) => {
  // wrapping initial value in function to get around useState and setState thinking
  // the functional component is a function to be evaluated.
  const [LDProvider, setLDProvider] = useState<React.FunctionComponent>(
    () => () => <div />
  );

  const { data } = useQuery<GetCurrentUser>(GetCurrentUserQuery);

  useEffect(() => {
    (async () => {
      const provider = await asyncWithLDProvider({
        clientSideID: process.env.REACT_APP_LD_CLIENT_ID as string,
        user: {
          key: data?.currentUser?.launchDarkly.userKey
        },
        options: {
          hash: data?.currentUser?.launchDarkly.signedHash
        },
        flags: {
          sandbox: true,
          pdfExport: true,
          prototype508: true,
          fileUploads: true,
          prototypeTRB: true,
          downgradeGovTeam: false,
          downgrade508User: false,
          downgrade508Tester: false,
          add508Request: false
        }
      });

      setLDProvider(() => provider);
    })();
  }, [data]);

  return <LDProvider>{children}</LDProvider>;
};

const FlagsWrapper = ({ children }: WrapperProps) => {
  const { authState } = useOktaAuth();
  const Container = authState.isAuthenticated
    ? UserTargetingWrapper
    : React.Fragment;

  return <Container>{children}</Container>;
};

export default FlagsWrapper;
