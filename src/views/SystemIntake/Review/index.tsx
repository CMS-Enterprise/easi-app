import React, { useEffect, useRef, useState } from 'react';
import { SystemIntakeForm } from 'types/systemIntake';
import { SystemIntakeReview } from 'components/SystemIntakeReview';
import { Form, Formik, FormikProps } from 'formik';
import { ErrorAlert, ErrorAlertMessage } from 'components/shared/ErrorAlert';
import Button from 'components/shared/Button';
import AutoSave from 'components/shared/AutoSave';
import SystemIntakeValidationSchema from 'validations/systemIntakeSchema';
import { useHistory, useParams } from 'react-router-dom';
import { SecureRoute, useOktaAuth } from '@okta/okta-react';
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from 'reducers/rootReducer';
import {
  fetchSystemIntake,
  saveSystemIntake,
  storeSystemIntake
} from 'types/routines';
import { v4 as uuidv4 } from 'uuid';
import flattenErrors from 'utils/flattenErrors';


const Review = () => {
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

  const dispatchSave = () => {
    // const { current }: { current: FormikProps<SystemIntakeForm> } = formikRef;
    // if (current.dirty && current.values.id) {
    //   dispatch(saveSystemIntake(current.values));
    //   current.resetForm({ values: current.values });
    //   if (systemId === 'new') {
    //     history.replace(`/system/${current.values.id}/${pageObj.slug}`);
    //   }
    // }
  };

  useEffect(() => {
    if (systemId === 'new') {
      authService.getUser().then((user: any) => {
        dispatch(
          storeSystemIntake({
            id: uuidv4(),
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

  return (
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
    <div className="system-intake__review margin-bottom-7">
      <h1 className="font-heading-xl margin-top-4">
        Check your answers before sending
      </h1>
      <SystemIntakeReview systemIntake={values} />
      <hr className="system-intake__hr" />
      <h2 className="font-heading-xl">What happens next?</h2>
      <p>
        The Governance Review Admin Team will review and get back to you with{' '}
        <strong>one of these</strong> outcomes:
      </p>
      <ul className="usa-list">
        <li>direct you to go through the Governance Review process</li>
        <li>or decide there is no further governance needed</li>
      </ul>
      <p>They will get back to you in two business days.</p>
    </div>
    {pageIndex > 0 && (
                      <Button
                        type="button"
                        outline
                        onClick={() => {
                          setErrors({});
                          const newUrl = pages[pageIndex - 1].slug;
                          history.push(newUrl);
                          window.scrollTo(0, 0);
                        }}
                      >
                        Back
                      </Button>
                    )}
                    {pageIndex < pages.length - 1 && (
                      <Button
                        type="button"
                        onClick={() => {
                          if (pageObj.validation) {
                            validateForm().then(err => {
                              if (Object.keys(err).length === 0) {
                                const newUrl = pages[pageIndex + 1].slug;
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
                    {pageIndex === pages.length - 1 && (
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
    )
  }}
  </Formik>
  );
};

export default Review;
