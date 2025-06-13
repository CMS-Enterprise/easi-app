import React, { useEffect, useState } from 'react';
import { useOktaAuth } from '@okta/okta-react';
import { useGetCurrentUserQuery } from 'gql/generated/graphql';
import { asyncWithLDProvider } from 'launchdarkly-react-client-sdk';

type WrapperProps = {
  children: React.ReactNode;
};

const UserTargetingWrapper = ({ children }: WrapperProps) => {
  // wrapping initial value in function to get around useState and setState thinking
  // the functional component is a function to be evaluated.
  const [LDProvider, setLDProvider] = useState<
    React.FC<{ children: React.ReactNode }>
  >(() => () => null);

  const { data } = useGetCurrentUserQuery();

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

        setLDProvider(() => provider);
      })();
    }
  }, [data]);

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
