import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { FormikProps } from 'formik';
import { SecureRoute, useOktaAuth } from '@okta/okta-react';
import { v4 as uuidv4 } from 'uuid';
import Header from 'components/Header';
import PageNumber from 'components/PageNumber';
import SystemIntakeValidationSchema from 'validations/systemIntakeSchema';
import { AppState } from 'reducers/rootReducer';
import {
  fetchSystemIntake,
  storeSystemIntake
} from 'types/routines';
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
  const pageObj = pages[pageIndex];

  const isLoading = useSelector(
    (state: AppState) => state.systemIntake.isLoading
  );


  // useEffect(() => {
  //   if (systemId === 'new') {
  //     authService.getUser().then((user: any) => {
  //       dispatch(
  //         storeSystemIntake({
  //           id: uuidv4(),
  //           requester: {
  //             name: user.name,
  //             component: ''
  //           }
  //         })
  //       );
  //     });
  //   } else {
  //     dispatch(fetchSystemIntake(systemId));
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  // useEffect(() => {
  //   const pageSlugs: any[] = pages.map(p => p.slug);
  //   if (pageSlugs.includes(formPage)) {
  //     setPageIndex(pageSlugs.indexOf(formPage));
  //   } else {
  //     history.replace(`/system/${systemId}/contact-details`);
  //     setPageIndex(0);
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [pages, systemId, formPage]);

  return (
    <div className="system-intake">
      <Header name="EASi System Intake" />
      <main className="grid-container" role="main">
        {/* {isLoading === false && ( */}
          <>
            <SecureRoute
              path="/system/:systemId/contact-details"
              render={() => <ContactDetails  />}
            />
            <SecureRoute
              path="/system/:systemId/request-details"
              render={() => <RequestDetails  />}
            />
            <SecureRoute
              path="/system/:systemId/review"
              render={() => <Review  />}
            />
          </>
        {/* )} */}
        {/* {pageObj.type === 'FORM' && (
          <PageNumber
            currentPage={pageIndex + 1}
            totalPages={pages.filter(p => p.type === 'FORM').length}
          />
        )} */}
      </main>
    </div>
  );
};

export default SystemIntake;
