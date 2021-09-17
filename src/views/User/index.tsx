import React from 'react';
import { useOktaAuth } from '@okta/okta-react';
import { useFlags } from 'launchdarkly-react-client-sdk';

import PageHeading from 'components/PageHeading';
import user, { EasiAuthState } from 'utils/user';

const UserInfo = () => {
  const { authState }: { authState: EasiAuthState | null } = useOktaAuth();

  const userGroups = authState?.groups || [];
  const isUserSet = authState?.isAuthenticated;
  const flags = useFlags();

  if (isUserSet) {
    return (
      <>
        <PageHeading>
          {
            JSON.parse(window.localStorage['okta-token-storage'])?.idToken
              ?.claims?.preferred_username
          }
        </PageHeading>
        <p>Job codes</p>
        <ul>
          {userGroups.map(group => (
            <li key={group}>{group}</li>
          ))}
        </ul>
        <p>User is basic user: {`${user.isBasicUser(userGroups, flags)}`}</p>
        <p>User is GRT user: {`${user.isGrtReviewer(userGroups, flags)}`}</p>
        <p>
          User is 508 user: {`${user.isAccessibilityTeam(userGroups, flags)}`}
        </p>
        <p>
          User is 508 admin: {`${user.isAccessibilityAdmin(userGroups, flags)}`}
        </p>
        <p>
          User is 508 tester:{' '}
          {`${user.isAccessibilityTester(userGroups, flags)}`}
        </p>

        <h2>Raw Access Token Claims</h2>
        <pre>
          {JSON.stringify(
            JSON.parse(window.localStorage['okta-token-storage'])?.accessToken
              ?.claims,
            null,
            2
          )}
        </pre>

        <h2>Raw LaunchDarkly Flags</h2>
        <pre>{JSON.stringify(flags, null, 2)}</pre>
      </>
    );
  }

  return <p>Loading...</p>;
};

export default UserInfo;
