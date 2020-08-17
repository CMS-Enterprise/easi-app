import React from 'react';
import { useDispatch } from 'react-redux';
import { useOktaAuth } from '@okta/okta-react';
import { DateTime } from 'luxon';

import Header from 'components/Header';
import { updateLastActiveAt } from 'reducers/authReducer';

import ActionBanner from '../../components/shared/ActionBanner/index';

// This view can be deleted whenever we're ready
// This is just a sandbox page for us to test things out

const shortenTimeout = async (authService: any) => {
  const tokenManager = await authService.getTokenManager();
  const idToken = await tokenManager.get('idToken');
  const newIdToken = {
    ...idToken,
    expiresAt: Math.round(
      DateTime.local()
        .plus({ seconds: 15 })
        .toSeconds()
    )
  };
  tokenManager.add('idToken', newIdToken);

  const accessToken = await tokenManager.get('accessToken');
  const newAccessToken = {
    ...accessToken,
    expiresAt: Math.round(
      DateTime.local()
        .plus({ seconds: 15 })
        .toSeconds()
    )
  };
  console.log(newAccessToken);
  tokenManager.add('accessToken', newAccessToken);

  console.log('I shortened the thing');
};

const logInfo = async (authService: any) => {
  const tokenManager = await authService.getTokenManager();
  const idToken = await tokenManager.get('idToken');
  console.log('idToken expires at ', idToken.expiresAt);

  const accessToken = await tokenManager.get('accessToken');
  console.log('accessToken expires at ', accessToken.value);
  console.log('accessToken expires at ', accessToken.expiresAt);
};

const Sandbox = () => {
  const { authService }: { authService: any } = useOktaAuth();
  const dispatch = useDispatch();

  return (
    <div>
      <Header />
      <div className="grid-container">
        <ActionBanner
          title="Shorten the life of your token"
          helpfulText="Change expiration to a minute from now"
          label="Do iiiiiit"
          onClick={() => shortenTimeout(authService)}
        />
        <ActionBanner
          title="Learn more about your token"
          helpfulText="Console log the current tokens"
          label="Log the thing"
          onClick={() => logInfo(authService)}
        />
        <ActionBanner
          title="Update your last active at timestamp"
          helpfulText="Dispatch the thing to do the thing"
          label="Update"
          onClick={() => dispatch(updateLastActiveAt)}
        />
      </div>
    </div>
  );
};

export default Sandbox;
