import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { SystemIntakeReview } from 'components/SystemIntakeReview';
import MainContent from 'components/MainContent';
import Header from 'components/Header';
import { AppState } from 'reducers/rootReducer';
import { fetchSystemIntake, reviewSystemIntake } from 'types/routines';
import { Field, Form, Formik, FormikProps } from 'formik';
import { RadioField } from 'components/shared/RadioField';
import FieldGroup from 'components/shared/FieldGroup';
import HelpText from 'components/shared/HelpText';
import Label from 'components/shared/Label';
import TextAreaField from 'components/shared/TextAreaField';
import Button from 'components/shared/Button';
import { SystemIntakeForm, SystemIntakeStatus } from 'types/systemIntake';
import Alert from 'components/shared/Alert';
import { DateTime } from 'luxon';

export const GRTSystemIntakeReview = () => {
  const { systemId } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchSystemIntake(systemId));
  }, [dispatch, systemId]);
  const systemIntake = useSelector(
    (state: AppState) => state.systemIntake.systemIntake
  );
  const isLoading = useSelector(
    (state: AppState) => state.systemIntake.isLoading
  );
  const error = useSelector((state: AppState) => state.systemIntake.error);
  return (
    <div>
      <Header />
      <MainContent className="grid-container">
        <div className="system-intake__review margin-bottom-7">
          <h1 className="font-heading-xl margin-top-4">CMS System Request</h1>
          {error && (
            <h2 className="font-heading-xl">
              System intake with ID: {systemId} was not found
            </h2>
          )}
          {!isLoading && !error && (
            <SystemIntakeReview systemIntake={systemIntake} />
          )}
        </div>
      </MainContent>
      {!isLoading && !error && (
        <div className="bg-gray-5 padding-top-6 padding-bottom-5">
          <MainContent className="grid-container">
            {systemIntake.status === 'SUBMITTED' && (
              <Formik
                initialValues={systemIntake}
                onSubmit={values => {
                  dispatch(reviewSystemIntake(values));
                }}
              >
                {(formikProps: FormikProps<SystemIntakeForm>) => {
                  const { values, setFieldValue } = formikProps;
                  return (
                    <Form>
                      <h1 className="font-heading-xl margin-top-0">
                        Next steps
                      </h1>
                      <div className="grid-row">
                        <div className="grid-col-4">
                          <FieldGroup>
                            <fieldset className="usa-fieldset">
                              <legend className="usa-label margin-bottom-2">
                                How to proceed?
                              </legend>
                              <Field
                                as={RadioField}
                                checked={values.status === 'APPROVED'}
                                id="GrtIntakeReviewForm-Approved"
                                name="decision"
                                label="Issue Lifecycle ID with no further governance"
                                onChange={() => {
                                  setFieldValue('status', 'APPROVED');
                                }}
                                value
                              />

                              <Field
                                as={RadioField}
                                checked={values.status === 'ACCEPTED'}
                                id="GrtIntakeReviewForm-Accepted"
                                name="decision"
                                label="Governance review process needed"
                                onChange={() => {
                                  setFieldValue('status', 'ACCEPTED');
                                }}
                                value
                              />

                              <Field
                                as={RadioField}
                                checked={values.status === 'CLOSED'}
                                id="GrtIntakeReviewForm-Closed"
                                name="decision"
                                label="Governance not needed (close this request)"
                                onChange={() => {
                                  setFieldValue('status', 'CLOSED');
                                }}
                                value
                              />
                            </fieldset>
                          </FieldGroup>
                          <hr className="border-black border-bottom-0" />
                          <HelpText>
                            If there isn&apos;t enough info on this request,
                            please get in touch with the requester over email
                          </HelpText>
                        </div>
                        <div className="grid-col-2" />
                        <div className="grid-col-6">
                          <FieldGroup scrollElement="emailText">
                            <Label
                              className="margin-bottom-2 margin-top-0"
                              htmlFor="GrtIntakeReviewForm-EmailText"
                            >
                              This email will be sent to the requester
                            </Label>
                            <Field
                              as={TextAreaField}
                              id="GrtIntakeReviewForm-GrtReviewEmailBody"
                              maxLength={2000}
                              name="grtReviewEmailBody"
                              aria-describedby="GrtIntakeReviewForm-GrtReviewEmailBody"
                              className="maxw-full"
                            />
                          </FieldGroup>
                          <Button className="margin-top-3" type="submit">
                            Email Decision and Progress to next step
                          </Button>
                        </div>
                      </div>
                    </Form>
                  );
                }}
              </Formik>
            )}
            {['APPROVED', 'ACCEPTED', 'CLOSED'].includes(
              systemIntake.status
            ) && (
              <div>
                <h1 className="font-heading-xl margin-top-0">Next steps</h1>
                <Alert type="success" heading="Email sent">
                  An email has been sent to {systemIntake.requester.email}
                </Alert>
                <p className="margin-bottom-3">
                  Decision:{' '}
                  {((status: SystemIntakeStatus) => {
                    if (status === 'APPROVED') {
                      return 'Issue Lifecycle ID with no further governance';
                    }
                    if (status === 'ACCEPTED') {
                      return 'Governance review process needed';
                    }
                    if (status === 'CLOSED') {
                      return 'Governance not needed (close this request)';
                    }
                    return '';
                  })(systemIntake.status)}
                </p>
                <p className="text-pre-wrap line-height-body-3 margin-bottom-4">
                  {systemIntake.grtReviewEmailBody}
                </p>
                <i>
                  An email was sent to the requester on{' '}
                  {systemIntake.reviewedAt &&
                    systemIntake.reviewedAt.toLocaleString(
                      DateTime.DATETIME_FULL
                    )}
                </i>
              </div>
            )}
          </MainContent>
        </div>
      )}
    </div>
  );
};

export default GRTSystemIntakeReview;
