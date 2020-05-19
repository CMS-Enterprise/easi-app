import React from 'react';
import { SecureRoute } from '@okta/okta-react';
import Header from 'components/Header';
import ContactDetails from './ContactDetails';
import RequestDetails from './RequestDetails';
import Review from './Review';
import './index.scss';

export const SystemIntake = () => {
  return (
    <div className="system-intake">
      <Header name="EASi System Intake" />
      <main className="grid-container" role="main">
        <>
          <SecureRoute
            path="/system/:systemId/contact-details"
            render={() => <ContactDetails />}
          />
          <SecureRoute
            path="/system/:systemId/request-details"
            render={() => <RequestDetails />}
          />
          <SecureRoute
            path="/system/:systemId/review"
            render={() => <Review />}
          />
        </>
      </main>
    </div>
  );
};

export default SystemIntake;
