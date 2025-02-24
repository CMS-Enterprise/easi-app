import React, { useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';
import { useOktaAuth } from '@okta/okta-react';
import GetCurrentUserQuery from 'gql/legacyGQL/GetCurrentUserQuery';
import { GetCurrentUser } from 'gql/legacyGQL/types/GetCurrentUser';
import { asyncWithLDProvider } from 'launchdarkly-react-client-sdk';

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
    if (data) {
      (async () => {
        const provider = await asyncWithLDProvider({
          clientSideID: import.meta.env.VITE_LD_CLIENT_ID as string,
          context: {
            kind: 'user',
            key: data?.currentUser?.launchDarkly.userKey
          },
          options: {
            hash: data?.currentUser?.launchDarkly.signedHash
          },
          flags: {
            atoProcessList: false,
            downgradeGovTeam: false,
            downgradeTrbAdmin: false,
            systemProfileHiddenFields: false,
            systemWorkspace: false,
            systemWorkspaceRequestsCard: false,
            systemWorkspaceTeam: false,
            grbReviewTab: false,
            showAtoColumn: false
          }
        });

        setLDProvider(() => () => provider({ children }));
      })();
    }
  }, [data, children]);

  return <LDProvider>{children}</LDProvider>;
};

const FlagsWrapper = ({ children }: WrapperProps) => {
  const { authState } = useOktaAuth();
  const Container = authState?.isAuthenticated
    ? UserTargetingWrapper
    : React.Fragment;

  return <Container>{children}</Container>;
};

export default FlagsWrapper;
