import React, { useState, useRef, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory, withRouter, RouteComponentProps } from 'react-router-dom';
import { Formik, Form, FormikProps } from 'formik';
import Header from 'components/Header';
import Button from 'components/shared/Button';
import PageNumber from 'components/PageNumber';
import { ErrorAlert, ErrorAlertMessage } from 'components/shared/ErrorAlert';
import { SystemIntakeForm } from 'types/systemIntake';
import SystemIntakeValidationSchema from 'validations/systemIntakeSchema';
import flattenErrors from 'utils/flattenErrors';
import AutoSave from 'components/shared/AutoSave';
import { initialSystemIntakeForm } from 'data/systemIntake';
import { v4 as uuidv4 } from 'uuid';
import { saveSystemIntake } from 'types/routines';
import ContactDetails from './ContactDetails';
import RequestDetails from './RequestDetails';
import Review from './Review';
import './index.scss';

export type SystemIntakeRouterProps = {
  profileId: string;
};
type SystemIntakeProps = RouteComponentProps<SystemIntakeRouterProps> & {};

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
  const [id, setId] = useState('');
  const dispatch = useDispatch();
  const formikRef: any = useRef();
  const pageObj = pages[page - 1];

  useEffect(() => {
    // TODO: Make request to get system intake by id.
    // If it doesn't exist, create a new id.
    setId(uuidv4());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const initialData: SystemIntakeForm = initialSystemIntakeForm;

  const renderPage = (formikProps: FormikProps<SystemIntakeForm>) => {
    const Component = pageObj.view;

    if (Component) {
      return <Component formikProps={formikProps} />;
    }
    return null;
  };

  const dispatchSave = () => {
    if (id && formikRef.current.dirty) {
      dispatch(saveSystemIntake({ formData: formikRef.current.values, id }));
    }
  };

  return (
    <div className="system-intake">
      <Header activeNavListItem={match.params.profileId} name="INTAKE">
        {pageObj.type === 'FORM' && (
          <div className="margin-bottom-3">
            <button
              type="button"
              className="easi-header__save-button usa-button"
              id="save-button"
              onClick={() => {
                dispatchSave();
                history.push('/system/all');
              }}
            >
              <span>Save & Exit</span>
            </button>
          </div>
        )}
      </Header>
      <main className="grid-container" role="main">
        <Formik
          initialValues={initialData}
          // Empty onSubmit so the 'Next' buttons don't accidentally submit the form
          // Form will be manually submitted.
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
                      Send to GRT
                    </Button>
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

export default withRouter(SystemIntake);
