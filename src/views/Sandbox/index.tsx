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
        .plus({ seconds: 5 })
        .toSeconds()
    )
  };
  tokenManager.add('idToken', newIdToken);

  const accessToken = await tokenManager.get('accessToken');
  const newAccessToken = {
    ...accessToken,
    expiresAt: Math.round(
      DateTime.local()
        .plus({ seconds: 5 })
        .toSeconds()
    )
  };
  tokenManager.add('accessToken', newAccessToken);
};

const logInfo = async (authService: any) => {
  const tokenManager = await authService.getTokenManager();
  await tokenManager.get('idToken');
  await tokenManager.get('accessToken');
};

const Sandbox = () => {
  const { oktaAuth } = useOktaAuth();
  const dispatch = useDispatch();

  return (
    <div>
      <Header />
      <div className="grid-container">
        <ActionBanner
          title="Update activeAt timestamp"
          helpfulText="Do something to be active"
          label="Activate!"
          onClick={() => dispatch(updateLastActiveAt(DateTime.local()))}
          requestType="NEW"
        />
        <ActionBanner
          title="Shorten the life of your token"
          helpfulText="Change expiration to a minute from now"
          label="Do iiiiiit"
          onClick={() => shortenTimeout(oktaAuth)}
          requestType="NEW"
        />
        <ActionBanner
          title="Learn more about your token"
          helpfulText="Console log the current tokens"
          label="Log the thing"
          onClick={() => logInfo(oktaAuth)}
          requestType="NEW"
        />
        <ActionBanner
          title="Update your last active at timestamp"
          helpfulText="Dispatch the thing to do the thing"
          label="Update"
          onClick={() => dispatch(updateLastActiveAt(DateTime.local()))}
          requestType="NEW"
        />
      </div>
    </div>
  );
};

export default Sandbox;
