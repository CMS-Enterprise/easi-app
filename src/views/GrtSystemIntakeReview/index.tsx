import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Button } from '@trussworks/react-uswds';
import { Field, Form, Formik, FormikProps } from 'formik';
import { DateTime } from 'luxon';

import Footer from 'components/Footer';
import Header from 'components/Header';
import MainContent from 'components/MainContent';
import PageWrapper from 'components/PageWrapper';
import Alert from 'components/shared/Alert';
import FieldGroup from 'components/shared/FieldGroup';
import HelpText from 'components/shared/HelpText';
import Label from 'components/shared/Label';
import { RadioField } from 'components/shared/RadioField';
import TextAreaField from 'components/shared/TextAreaField';
import { SystemIntakeReview } from 'components/SystemIntakeReview';
import { AppState } from 'reducers/rootReducer';
import { fetchSystemIntake, reviewSystemIntake } from 'types/routines';
import { SystemIntakeForm, SystemIntakeStatus } from 'types/systemIntake';

export const GrtSystemIntakeReview = () => {
  const { systemId } = useParams();
  const dispatch = useDispatch();
  const { t } = useTranslation('governanceReviewTeam');

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
    <PageWrapper>
      <Header />
      <MainContent>
        <div className="grid-container">
          <div className="system-intake__review margin-bottom-7">
            <h1 className="font-heading-xl margin-top-4">
              {t('review:page_title')}
            </h1>
            {error && (
              <h2 className="font-heading-xl">
                {t('review:intake_not_found', {
                  intakeId: systemId
                })}
              </h2>
            )}
            {!isLoading && !error && (
              <SystemIntakeReview systemIntake={systemIntake} />
            )}
          </div>
        </div>
        {!isLoading &&
          !error &&
          ['local', 'dev', 'impl'].includes(
            process.env.REACT_APP_APP_ENV || ''
          ) && (
            <div className="bg-gray-5 padding-top-6 padding-bottom-5">
              <div className="grid-container">
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
                            {t('review:next_steps')}
                          </h1>
                          <div className="grid-row flex-justify">
                            <div className="grid-col-4">
                              <FieldGroup>
                                <fieldset className="usa-fieldset">
                                  <legend className="usa-label margin-bottom-2">
                                    {t('review:how_to_proceed')}
                                  </legend>
                                  <Field
                                    as={RadioField}
                                    checked={values.status === 'APPROVED'}
                                    id="GrtIntakeReviewForm-Approved"
                                    name="decision"
                                    label={t('review:approved_label')}
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
                                    label={t('review:accepted_label')}
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
                                    label={t('review:closed_label')}
                                    onChange={() => {
                                      setFieldValue('status', 'CLOSED');
                                    }}
                                    value
                                  />
                                </fieldset>
                              </FieldGroup>
                              <hr className="border-black border-bottom-0" />
                              <HelpText>{t('review:radio_help')}</HelpText>
                            </div>
                            <div className="grid-col-6">
                              <FieldGroup scrollElement="emailText">
                                <Label
                                  className="margin-bottom-2 margin-top-0"
                                  htmlFor="GrtIntakeReviewForm-EmailText"
                                >
                                  {t('review:email_field_label')}
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
                                {t('review:submit_button')}
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
                    <h1 className="font-heading-xl margin-top-0">
                      {t('review:next_steps')}
                    </h1>
                    <Alert type="success" heading={t('review:alert_header')}>
                      {t('review:alert_body', {
                        address: systemIntake.requester.email
                      })}
                    </Alert>
                    <p className="margin-bottom-3">
                      Decision:{' '}
                      {((status: SystemIntakeStatus) => {
                        if (status === 'APPROVED') {
                          return t('review:approved_label');
                        }
                        if (status === 'ACCEPTED') {
                          return t('review:accepted_label');
                        }
                        if (status === 'CLOSED') {
                          return t('review:closed_label');
                        }
                        return '';
                      })(systemIntake.status)}
                    </p>
                    <p className="text-pre-wrap line-height-body-3 margin-bottom-4">
                      {systemIntake.grtReviewEmailBody}
                    </p>
                    {systemIntake.decidedAt && (
                      <i>
                        {t('review:closed_label', {
                          date: systemIntake.decidedAt.toLocaleString(
                            DateTime.DATETIME_FULL
                          )
                        })}
                      </i>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
      </MainContent>
      <Footer />
    </PageWrapper>
  );
};

export default GrtSystemIntakeReview;
