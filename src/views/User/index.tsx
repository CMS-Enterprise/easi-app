import React from 'react';
import { useSelector } from 'react-redux';

import PageHeading from 'components/PageHeading';
import { AppState } from 'reducers/rootReducer';
import user from 'utils/user';

const UserInfo = () => {
  const userGroups = useSelector((state: AppState) => state.auth.groups);
  const isUserSet = useSelector((state: AppState) => state.auth.isUserSet);

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
        <p>User is basic user: {`${user.isBasicUser(userGroups)}`}</p>
        <p>User is GRT user: {`${user.isGrtReviewer(userGroups)}`}</p>
        <p>User is 508 user: {`${user.isAccessibilityTeam(userGroups)}`}</p>
        <p>User is 508 admin: {`${user.isAccessibilityAdmin(userGroups)}`}</p>
        <p>User is 508 tester: {`${user.isAccessibilityTester(userGroups)}`}</p>

        <h2>Raw Access Token Claims</h2>
        <pre>
          {JSON.stringify(
            JSON.parse(window.localStorage['okta-token-storage'])?.accessToken
              ?.claims,
            null,
            2
          )}
        </pre>
      </>
    );
  }

  return <p>Loading...</p>;
};

export default UserInfo;
