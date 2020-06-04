import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { Form, Formik, FormikProps } from 'formik';
import { SecureRoute, useOktaAuth } from '@okta/okta-react';
import { Button } from '@trussworks/react-uswds';
import MainContent from 'components/MainContent';
import Header from 'components/Header';
import PageNumber from 'components/PageNumber';
import { ErrorAlert, ErrorAlertMessage } from 'components/shared/ErrorAlert';
import { SystemIntakeForm } from 'types/systemIntake';
import SystemIntakeValidationSchema from 'validations/systemIntakeSchema';
import flattenErrors from 'utils/flattenErrors';
import AutoSave from 'components/shared/AutoSave';
import { AppState } from 'reducers/rootReducer';
import {
  fetchSystemIntake,
  saveSystemIntake,
  postSystemIntake,
  storeSystemIntake,
  submitSystemIntake,
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
  const isSaving = useSelector(
    (state: AppState) => state.systemIntake.isSaving
  );

  const error = useSelector((state: AppState) => state.systemIntake.error);
  const prevIsSubmitting = usePrevious(isSubmitting);

  const dispatchSave = () => {
    const { current }: { current: FormikProps<SystemIntakeForm> } = formikRef;
    if (current && current.dirty && !isSaving) {
      if (systemId === 'new') {
        dispatch(postSystemIntake(current.values));
      } else if (current.values.id) {
        dispatch(saveSystemIntake(current.values));
      }
      current.resetForm({ values: current.values, errors: current.errors });
    }
  };

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
          <Formik
            initialValues={systemIntake}
            onSubmit={values => {
              dispatch(submitSystemIntake(values));
            }}
            validationSchema={pageObj.validation}
            validateOnBlur={false}
            validateOnChange={false}
            validateOnMount={false}
            innerRef={formikRef}
            enableReinitialize
          >
            {(formikProps: FormikProps<SystemIntakeForm>) => {
              const { values, errors } = formikProps;
              const flatErrors: any = flattenErrors(errors);
              return (
                <>
                  {Object.keys(errors).length > 0 && (
                    <ErrorAlert
                      testId="system-intake-errors"
                      classNames="margin-top-3"
                      heading="Please check and fix the following"
                    >
                      {Object.keys(flatErrors).map(key => {
                        return (
                          <ErrorAlertMessage
                            key={`Error.${key}`}
                            errorKey={key}
                            message={flatErrors[key]}
                          />
                        );
                      })}
                    </ErrorAlert>
                  )}
                  <Form>
                    <SecureRoute
                      path="/system/:systemId/contact-details"
                      render={() => (
                        <ContactDetails
                          formikProps={formikProps}
                          formikRef={formikRef}
                          systemId={systemId}
                        />
                      )}
                    />
                    <SecureRoute
                      path="/system/:systemId/request-details"
                      render={() => (
                        <RequestDetails
                          formikProps={formikProps}
                          formikRef={formikRef}
                          systemId={systemId}
                        />
                      )}
                    />
                    <SecureRoute
                      path="/system/:systemId/review"
                      render={() => <Review formikProps={formikProps} />}
                    />
                    <AutoSave
                      values={values}
                      onSave={dispatchSave}
                      debounceDelay={1000}
                    />
                  </Form>
                </>
              );
            }}
          </Formik>
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
