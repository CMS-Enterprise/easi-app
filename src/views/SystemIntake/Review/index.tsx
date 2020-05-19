import React, { useEffect, useRef } from 'react';
import { SystemIntakeForm } from 'types/systemIntake';
import { SystemIntakeReview } from 'components/SystemIntakeReview';
import { Form, Formik, FormikProps } from 'formik';
import { ErrorAlert, ErrorAlertMessage } from 'components/shared/ErrorAlert';
import Button from 'components/shared/Button';
import { useHistory, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from 'reducers/rootReducer';
import { fetchSystemIntake } from 'types/routines';
import flattenErrors from 'utils/flattenErrors';

const Review = () => {
  const history = useHistory();
  const { systemId } = useParams();
  const dispatch = useDispatch();
  const formikRef: any = useRef();

  const systemIntake = useSelector(
    (state: AppState) => state.systemIntake.systemIntake
  );
  const isLoading = useSelector(
    (state: AppState) => state.systemIntake.isLoading
  );

  useEffect(() => {
    dispatch(fetchSystemIntake(systemId));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {isLoading === false && (
        <Formik
          initialValues={systemIntake}
          onSubmit={() => {}}
          validateOnBlur={false}
          validateOnChange={false}
          validateOnMount={false}
          innerRef={formikRef}
        >
          {(formikProps: FormikProps<SystemIntakeForm>) => {
            const { values, errors, isSubmitting } = formikProps;
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
                      The Governance Review Admin Team will review and get back
                      to you with <strong>one of these</strong> outcomes:
                    </p>
                    <ul className="usa-list">
                      <li>
                        direct you to go through the Governance Review process
                      </li>
                      <li>or decide there is no further governance needed</li>
                    </ul>
                    <p>They will get back to you in two business days.</p>
                  </div>
                  <Button
                    type="button"
                    outline
                    onClick={() => {
                      const newUrl = `/system/${systemId}/request-details`;
                      history.push(newUrl);
                      window.scrollTo(0, 0);
                    }}
                  >
                    Back
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    onClick={() => {
                      console.log('Submitting Data: ', values);
                    }}
                  >
                    Send my intake request
                  </Button>
                </Form>
              </>
            );
          }}
        </Formik>
      )}
    </>
  );
};

export default Review;
