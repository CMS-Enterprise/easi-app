import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useHistory, useParams } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { Button } from '@trussworks/react-uswds';
import { Field, Form, Formik, FormikProps } from 'formik';

import MandatoryFieldsAlert from 'components/MandatoryFieldsAlert';
import { ErrorAlert, ErrorAlertMessage } from 'components/shared/ErrorAlert';
import FieldErrorMsg from 'components/shared/FieldErrorMsg';
import FieldGroup from 'components/shared/FieldGroup';
import HelpText from 'components/shared/HelpText';
import Label from 'components/shared/Label';
import TextAreaField from 'components/shared/TextAreaField';
import MarkReadyForGRBQuery from 'queries/MarkReadyForGRBQuery';
import {
  AddGRTFeedback,
  AddGRTFeedbackVariables
} from 'queries/types/AddGRTFeedback';
import { ProvideGRTFeedbackForm } from 'types/action';
import flattenErrors from 'utils/flattenErrors';
import { provideGRTFeedbackSchema } from 'validations/actionSchema';

const ProvideGRTRecommendationsToGRB = () => {
  const { systemId } = useParams<{ systemId: string }>();
  const history = useHistory();
  const { t } = useTranslation('action');
  const [mutate] = useMutation<AddGRTFeedback, AddGRTFeedbackVariables>(
    MarkReadyForGRBQuery
  );

  const backLink = `/governance-review-team/${systemId}/actions`;

  const initialValues: ProvideGRTFeedbackForm = {
    grtFeedback: '',
    emailBody: ''
  };

  const onSubmit = (values: ProvideGRTFeedbackForm) => {
    const { grtFeedback, emailBody } = values;
    mutate({
      variables: {
        input: {
          emailBody,
          feedback: grtFeedback,
          intakeID: systemId
        }
      }
    }).then(() => {
      history.push(`/governance-review-team/${systemId}/notes`);
    });
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
      validationSchema={provideGRTFeedbackSchema}
      validateOnBlur={false}
      validateOnChange={false}
      validateOnMount={false}
    >
      {(formikProps: FormikProps<ProvideGRTFeedbackForm>) => {
        const { errors, handleSubmit } = formikProps;
        const flatErrors = flattenErrors(errors);
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
            <h1 data-testid="ready-for-grb">{t('submitAction.heading')}</h1>
            <h2>{t('submitAction.subheading')}</h2>
            <p>
              {t('actions.readyForGrb')} &nbsp;
              <Link to={backLink}>{t('submitAction.backLink')}</Link>
            </p>
            <div className="tablet:grid-col-6">
              <MandatoryFieldsAlert />
            </div>
            <div className="tablet:grid-col-9 margin-bottom-7">
              <Form
                onSubmit={e => {
                  handleSubmit(e);
                  window.scrollTo(0, 0);
                }}
              >
                <FieldGroup
                  scrollElement="grtFeedback"
                  error={!!flatErrors.grtFeedback}
                >
                  <Label htmlFor="ProvideGRTFeedbackForm-GRTFeedback">
                    {t('grbRecommendations.recommendationLabel')}
                  </Label>
                  <HelpText>
                    {t('grbRecommendations.recommendationHelpText')}
                  </HelpText>
                  <FieldErrorMsg>{flatErrors.grtFeedback}</FieldErrorMsg>
                  <Field
                    as={TextAreaField}
                    error={!!flatErrors.grtFeedback}
                    id="ProvideGRTFeedbackForm-GRTFeedback"
                    maxLength={3000}
                    name="grtFeedback"
                  />
                </FieldGroup>
                <FieldGroup
                  scrollElement="emailBody"
                  error={!!flatErrors.emailBody}
                >
                  <Label htmlFor="ProvideGRTFeedbackForm-EmailBody">
                    {t('submitAction.feedbackLabel')}
                  </Label>
                  <FieldErrorMsg>{flatErrors.emailBody}</FieldErrorMsg>
                  <Field
                    as={TextAreaField}
                    error={!!flatErrors.emailBody}
                    id="ProvideGRTFeedbackForm-EmailBody"
                    maxLength={2000}
                    name="emailBody"
                  />
                </FieldGroup>
                <Button className="margin-top-2" type="submit">
                  {t('provideGRTFeedback.submit')}
                </Button>
              </Form>
            </div>
          </>
        );
      }}
    </Formik>
  );
};

export default ProvideGRTRecommendationsToGRB;
