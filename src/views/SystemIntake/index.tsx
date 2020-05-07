import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { Form, Formik, FormikProps } from 'formik';
import { SecureRoute } from '@okta/okta-react';
import { v4 as uuidv4 } from 'uuid';
import Header from 'components/Header';
import Button from 'components/shared/Button';
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
  storeSystemIntakeId
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
      slug: 'request-details'
    }
  ];

  const history = useHistory();
  const { systemId, formPage } = useParams();
  const [page, setPage] = useState(0);
  const dispatch = useDispatch();
  const formikRef: any = useRef();
  const pageObj = pages[page];

  const systemIntake = useSelector(
    (state: AppState) => state.systemIntake.systemIntake
  );
  const isLoading = useSelector(
    (state: AppState) => state.systemIntake.isLoading
  );

  const dispatchSave = () => {
    const currentRef = formikRef.current as FormikProps<SystemIntakeForm>;
    if (currentRef.dirty) {
      dispatch(saveSystemIntake(currentRef.values));
      if (systemId === 'new') {
        history.replace(`/system/${currentRef.values.id}/${pageObj.slug}`);
      }
    }
  };

  useEffect(() => {
    if (systemId === 'new') {
      dispatch(storeSystemIntakeId(uuidv4()));
    } else {
      dispatch(fetchSystemIntake(systemId));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const pageSlugs: any[] = pages.map(p => p.slug);
    if (pageSlugs.includes(formPage)) {
      setPage(pageSlugs.indexOf(formPage));
    } else {
      history.replace(`/system/${systemId}/contact-details`);
      setPage(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pages, formPage]);

  return (
    <div className="system-intake">
      <Header name="EASi System Intake" />
      <main className="grid-container" role="main">
        {isLoading === false && (
          <Formik
            initialValues={systemIntake}
            onSubmit={() => {}}
            validationSchema={pageObj.validation}
            validateOnBlur={false}
            validateOnChange={false}
            validateOnMount={false}
            innerRef={formikRef}
          >
            {(formikProps: FormikProps<SystemIntakeForm>) => {
              const {
                values,
                errors,
                setErrors,
                validateForm,
                isSubmitting
              } = formikProps;
              const flatErrors: any = flattenErrors(errors);

              return (
                <>
                  {Object.keys(errors).length > 0 && (
                    <ErrorAlert
                      classNames="margin-top-3"
                      heading="Please check and fix the following"
                    >
                      {Object.keys(flatErrors).map(key => {
                        return (
                          <ErrorAlertMessage
                            key={`Error.${key}`}
                            message={flatErrors[key]}
                            onClick={() => {
                              const field = document.querySelector(
                                `[data-scroll="${key}"]`
                              );

                              if (field) {
                                field.scrollIntoView();
                              }
                            }}
                          />
                        );
                      })}
                    </ErrorAlert>
                  )}
                  <Form>
                    <SecureRoute
                      path="/system/:systemId/contact-details"
                      render={() => (
                        <ContactDetails formikProps={formikProps} />
                      )}
                    />
                    <SecureRoute
                      path="/system/:systemId/request-details"
                      render={() => (
                        <RequestDetails formikProps={formikProps} />
                      )}
                    />
                    <SecureRoute
                      path="/system/:systemId/review"
                      render={() => <Review formikProps={formikProps} />}
                    />

                    {page > 0 && (
                      <Button
                        type="button"
                        outline
                        onClick={() => {
                          setErrors({});
                          const newUrl = pages[page - 1].slug;
                          history.push(newUrl);
                          window.scrollTo(0, 0);
                        }}
                      >
                        Back
                      </Button>
                    )}
                    {page < pages.length - 1 && (
                      <Button
                        type="button"
                        onClick={() => {
                          if (pageObj.validation) {
                            validateForm().then(err => {
                              if (Object.keys(err).length === 0) {
                                const newUrl = pages[page + 1].slug;
                                history.push(newUrl);
                              }
                              window.scrollTo(0, 0);
                            });
                          }
                        }}
                      >
                        Next
                      </Button>
                    )}
                    {page === pages.length - 1 && (
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        onClick={() => {
                          console.log('Submitting Data: ', values);
                        }}
                      >
                        Send my intake request
                      </Button>
                    )}

                    {pageObj.type === 'FORM' && (
                      <div className="margin-y-3">
                        <Button
                          type="button"
                          unstyled
                          onClick={() => {
                            dispatchSave();
                            history.push('/');
                          }}
                        >
                          <span>
                            <i className="fa fa-angle-left" /> Save & Exit
                          </span>
                        </Button>
                      </div>
                    )}

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
            currentPage={page + 1}
            totalPages={pages.filter(p => p.type === 'FORM').length}
          />
        )}
      </main>
    </div>
  );
};

export default SystemIntake;
