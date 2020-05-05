import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RouteComponentProps, useHistory } from 'react-router-dom';
import { Form, Formik, FormikProps } from 'formik';
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

export type SystemIDRouterProps = {
  systemId: string;
};

export type SystemIntakeProps = RouteComponentProps<SystemIDRouterProps>;

export const SystemIntake = ({ match }: SystemIntakeProps) => {
  const pages = [
    {
      type: 'FORM',
      validation: SystemIntakeValidationSchema.contactDetails,
      view: ContactDetails
    },
    {
      type: 'FORM',
      validation: SystemIntakeValidationSchema.requestDetails,
      view: RequestDetails
    },
    {
      type: 'REVIEW',
      view: Review
    }
  ];
  const history = useHistory();
  const [page, setPage] = useState(1);
  const dispatch = useDispatch();
  const formikRef: any = useRef();
  const pageObj = pages[page - 1];

  const systemIntake = useSelector(
    (state: AppState) => state.systemIntake.systemIntake
  );
  const isLoading = useSelector(
    (state: AppState) => state.systemIntake.isLoading
  );

  const renderPage = (formikProps: FormikProps<SystemIntakeForm>) => {
    const Component = pageObj.view;

    if (Component) {
      return <Component formikProps={formikProps} />;
    }
    return null;
  };

  const dispatchSave = () => {
    const { current } = formikRef;
    if (current.dirty) {
      dispatch(saveSystemIntake(current.values));
      current.dirty = false;
      if (!match.params.systemId) {
        history.replace(`/system/${current.values.id}`);
      }
    }
  };

  useEffect(() => {
    if (match.params.systemId) {
      dispatch(fetchSystemIntake(match.params.systemId));
    } else {
      dispatch(storeSystemIntakeId(uuidv4()));
    }
  }, [dispatch, match.params.systemId]);

  return (
    <div className="system-intake">
      <Header name="EASi System Intake" />
      <main className="grid-container" role="main">
        {isLoading === false && (
          <Formik
            initialValues={systemIntake}
            // Empty onSubmit so the 'Next' buttons don't accidentally submit the form
            // Form will be manually submitted.
            onSubmit={() => {}}
            validationSchema={pageObj.validation}
            validateOnBlur={false}
            validateOnChange={false}
            validateOnMount={false}
            innerRef={formikRef}
            enableReinitialize
          >
            {(formikProps: FormikProps<SystemIntakeForm>) => {
              const {
                values,
                errors,
                validateForm,
                setErrors,
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
                    {renderPage(formikProps)}
                    {/* validateForm needs to be called from inside of Form component and it cannot be type="button"; it must be type="submit" */}
                    {page > 1 && (
                      <Button
                        type="button"
                        outline
                        onClick={() => {
                          setPage(prev => prev - 1);
                          setErrors({});
                          window.scrollTo(0, 0);
                        }}
                      >
                        Back
                      </Button>
                    )}

                    {page < pages.length && (
                      <Button
                        type="button"
                        onClick={() => {
                          if (pageObj.validation) {
                            validateForm().then(err => {
                              if (Object.keys(err).length === 0) {
                                setPage(prev => prev + 1);
                              }
                              window.scrollTo(0, 0);
                            });
                          }
                        }}
                      >
                        Next
                      </Button>
                    )}

                    {page === pages.length && (
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
            currentPage={page}
            totalPages={pages.filter(p => p.type === 'FORM').length}
          />
        )}
      </main>
    </div>
  );
};

export default SystemIntake;
