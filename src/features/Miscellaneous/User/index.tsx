import React from 'react';
import { useSelector } from 'react-redux';
import { useFlags } from 'launchdarkly-react-client-sdk';
import { AppState } from 'stores/reducers/rootReducer';

import PageHeading from 'components/PageHeading';
import user from 'utils/user';

const UserInfo = () => {
  const userGroups = useSelector((state: AppState) => state.auth.groups);
  const isUserSet = useSelector((state: AppState) => state.auth.isUserSet);
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
        <p>User is GRT user: {`${user.isITGovAdmin(userGroups, flags)}`}</p>
        <p>User is TRB Admin: {`${user.isTrbAdmin(userGroups, flags)}`}</p>

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
