import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { SecureRoute, useOktaAuth } from '@okta/okta-react';
import { Button } from '@trussworks/react-uswds';
import MainContent from 'components/MainContent';
import Header from 'components/Header';
import PageNumber from 'components/PageNumber';
import SystemIntakeValidationSchema from 'validations/systemIntakeSchema';
import { AppState } from 'reducers/rootReducer';
import {
  fetchSystemIntake,
  storeSystemIntake,
  clearSystemIntake
} from 'types/routines';
import usePrevious from 'hooks/usePrevious';
import ContactDetails from './ContactDetails';
import RequestDetails from './RequestDetails';
import Review from './Review';
import './index.scss';

export const SystemIntake = () => {
  const pages = [
    {
      type: 'FORM',
      slug: 'contact-details',
      validation: SystemIntakeValidationSchema.contactDetails
    },
    {
      type: 'FORM',
      slug: 'request-details',
      validation: SystemIntakeValidationSchema.requestDetails
    },
    {
      type: 'REVIEW',
      slug: 'review'
    }
  ];

  const history = useHistory();
  const { systemId, formPage } = useParams();
  const { authService } = useOktaAuth();
  const [pageIndex, setPageIndex] = useState(0);
  const dispatch = useDispatch();
  const formikRef: any = useRef();
  const pageObj = pages[pageIndex];

  const systemIntake = useSelector(
    (state: AppState) => state.systemIntake.systemIntake
  );
  const isLoading = useSelector(
    (state: AppState) => state.systemIntake.isLoading
  );
  const isSubmitting = useSelector(
    (state: AppState) => state.systemIntake.isSubmitting
  );

  const error = useSelector((state: AppState) => state.systemIntake.error);
  const prevIsSubmitting = usePrevious(isSubmitting);

  useEffect(() => {
    if (systemIntake.id) {
      history.replace(`/system/${systemIntake.id}/${formPage}`);
    }
  }, [history, systemIntake.id, formPage]);

  useEffect(() => {
    if (systemId === 'new') {
      authService.getUser().then((user: any) => {
        dispatch(
          storeSystemIntake({
            requester: {
              name: user.name,
              component: ''
            }
          })
        );
      });
    } else {
      dispatch(fetchSystemIntake(systemId));
    }
    // This return will clear system intake from store when component is unmounted
    return () => {
      dispatch(clearSystemIntake());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const pageSlugs: any[] = pages.map(p => p.slug);
    if (pageSlugs.includes(formPage)) {
      setPageIndex(pageSlugs.indexOf(formPage));
    } else {
      history.replace(`/system/${systemId}/contact-details`);
      setPageIndex(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pages, systemId, formPage]);

  useEffect(() => {
    if (prevIsSubmitting && !isSubmitting && !error) {
      history.push('/');
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSubmitting]);

  return (
    <div className="system-intake margin-bottom-5">
      <Header name="EASi System Intake" />
      <MainContent className="grid-container">
        {isLoading === false && (
          <>
            <SecureRoute
              path="/system/:systemId/contact-details"
              render={() => (
                <ContactDetails
                  formikRef={formikRef}
                  systemId={systemId}
                  systemIntake={systemIntake}
                />
              )}
            />
            <SecureRoute
              path="/system/:systemId/request-details"
              render={() => (
                <RequestDetails
                  formikRef={formikRef}
                  systemId={systemId}
                  systemIntake={systemIntake}
                />
              )}
            />
            <SecureRoute
              path="/system/:systemId/review"
              render={() => (
                <Review formikRef={formikRef} systemIntake={systemIntake} />
              )}
            />
          </>
        )}
        {pageObj.type === 'FORM' && (
          <PageNumber
            currentPage={pageIndex + 1}
            totalPages={pages.filter(p => p.type === 'FORM').length}
          />
        )}
      </MainContent>
    </div>
  );
};

export default SystemIntake;
