import React, { useState } from 'react';
import Header from 'components/Header';
import Modal from 'components/Modal';
import Button from 'components/shared/Button';
import { useOktaAuth } from '@okta/okta-react';
import { DateTime } from 'luxon';
import { useDispatch } from 'react-redux';
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
        .plus({ minutes: 1 })
        .toSeconds()
    )
  };
  tokenManager.add('idToken', newIdToken);

  const accessToken = await tokenManager.get('accessToken');
  const newAccessToken = {
    ...accessToken,
    expiresAt: Math.round(
      DateTime.local()
        .plus({ minutes: 1 })
        .toSeconds()
    )
  };
  tokenManager.add('accessToken', newAccessToken);

  console.log('I shortened the thing');
};

const logInfo = async (authService: any) => {
  const tokenManager = await authService.getTokenManager();
  const idToken = await tokenManager.get('idToken');
  console.log('idToken expires at ', idToken.expiresAt);

  const accessToken = await tokenManager.get('accessToken');
  console.log('accessToken expires at ', accessToken.expiresAt);
};

const Sandbox = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const { authService }: { authService: any } = useOktaAuth();
  const dispatch = useDispatch();

  return (
    <div>
      <Header />
      <div className="grid-container">
        <button type="button" onClick={() => setModalOpen(true)}>
          Open modal
        </button>
        {/* So we can test that it doesn't scroll when modal open */}
        <h1>Sandbox</h1>
        <h1>Sandbox</h1>
        <h1>Sandbox</h1>
        <h1>Sandbox</h1>
        <h1>Sandbox</h1>
        <h1>Sandbox</h1>
        <h1>Sandbox</h1>
        <h1>Sandbox</h1>
        <h1>Sandbox</h1>
        <h1>Sandbox</h1>
        <h1>Sandbox</h1>
        <h1>Sandbox</h1>
        <h1>Sandbox</h1>
        <h1>Sandbox</h1>
        <h1>Sandbox</h1>
        <h1>Sandbox</h1>
        <h1>Sandbox</h1>
        <Modal
          title="EASi"
          isOpen={isModalOpen}
          closeModal={() => setModalOpen(false)}
        >
          <h1 style={{ margin: 0 }}>
            Your access to EASi is about to expire in 5 minutes
          </h1>
          <p>Your data has already been saved.</p>
          <p>
            If you do not do anything on this page you will be signed out in 5
            minutes and will need to sign back in. We do this to keep your
            information secure.
          </p>
          <Button type="button" onClick={() => setModalOpen(false)}>
            Return to EASi
          </Button>
        </Modal>
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
