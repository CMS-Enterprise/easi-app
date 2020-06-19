import React, { useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { SecureRoute } from '@okta/okta-react';
import MainContent from 'components/MainContent';
import Header from 'components/Header';
import ContactDetails from './ContactDetails';
import RequestDetails from './RequestDetails';
import Review from './Review';
import './index.scss';

export const SystemIntake = () => {
  const history = useHistory();
  const { systemId, formPage } = useParams();

  useEffect(() => {
    // If a user tries to visit a form page we don't have, send them to contact details
    const currentPage = String(formPage);
    const pageSlugs = ['contact-details', 'request-details', 'review'];
    if (!pageSlugs.includes(currentPage)) {
      history.replace(`/system/${systemId}/contact-details`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [systemId, formPage]);

  return (
    <div className="system-intake margin-bottom-5">
      <Header name="EASi System Intake" />
      <MainContent className="grid-container">
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
      </MainContent>
    </div>
  );
};

export default SystemIntake;
