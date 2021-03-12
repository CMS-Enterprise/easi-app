import React from 'react';
import { useSelector } from 'react-redux';

import { AppState } from 'reducers/rootReducer';
import user from 'utils/user';

const UserInfo = () => {
  const userGroups = useSelector((state: AppState) => state.auth.groups);
  const isUserSet = useSelector((state: AppState) => state.auth.isUserSet);

  if (isUserSet) {
    return (
      <>
        <p>Job codes: {userGroups.join(', ')}</p>
        <p>User is basic user: {`${user.isBasicUser(userGroups)}`}</p>
        <p>User is GRT user: {`${user.isGrtReviewer(userGroups)}`}</p>
        <p>User is 508 user: {`${user.isAccessibilityTeam(userGroups)}`}</p>
        <p>User is 508 admin: {`${user.isAccessibilityAdmin(userGroups)}`}</p>
        <p>User is 508 tester: {`${user.isAccessibilityTester(userGroups)}`}</p>
      </>
    );
  }

  return <p>Loading...</p>;
};

export default UserInfo;
