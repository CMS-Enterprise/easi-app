import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useHistory, useParams } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { Button } from '@trussworks/react-uswds';
import { Field, Form, Formik, FormikProps } from 'formik';
import AddGRTFeedbackQuery from 'queries/AddGRTFeedbackQuery';
import {
  AddGRTFeedback,
  AddGRTFeedbackVariables
} from 'queries/types/AddGRTFeedback';

import { ErrorAlert, ErrorAlertMessage } from 'components/shared/ErrorAlert';
import FieldErrorMsg from 'components/shared/FieldErrorMsg';
import FieldGroup from 'components/shared/FieldGroup';
import HelpText from 'components/shared/HelpText';
import Label from 'components/shared/Label';
import TextAreaField from 'components/shared/TextAreaField';
import { ActionType, ProvideGRTFeedbackForm } from 'types/action';
import { ActionType as GQLActionType } from 'types/graphql-global-types';
import flattenErrors from 'utils/flattenErrors';
import { provideGRTFeedbackSchema } from 'validations/actionSchema';

type ProvideGRTFeedbackProps = {
  action: ActionType;
  actionName: string;
};

const ProvideGRTFeedback = ({
  action,
  actionName
}: ProvideGRTFeedbackProps) => {
  const { systemId } = useParams<{ systemId: string }>();
  const history = useHistory();
  const { t } = useTranslation('action');
  const [mutate] = useMutation<AddGRTFeedback, AddGRTFeedbackVariables>(
    AddGRTFeedbackQuery
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
          intakeID: systemId,
          actionType: action as GQLActionType
        }
      }
    }).then(() => {
      history.push(`/governance-review-team/${systemId}/intake-request`);
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
        const { errors } = formikProps;
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
            <h1>{t('submitAction.heading')}</h1>
            <h2>{t('submitAction.subheading')}</h2>
            <p>
              {actionName} &nbsp;
              <Link to={backLink}>{t('submitAction.backLink')}</Link>
            </p>
            <div className="tablet:grid-col-9 margin-bottom-7">
              <Form>
                <FieldGroup
                  scrollElement="grtFeedback"
                  error={!!flatErrors.grtFeedback}
                >
                  <Label htmlFor="ProvideGRTFeedbackForm-GRTFeedback">
                    {t('provideGRTFeedback.grtFeedbackLabel')}
                  </Label>
                  <HelpText>
                    {t('provideGRTFeedback.grtFeedbackHelpText')}
                  </HelpText>
                  <FieldErrorMsg>{flatErrors.grtFeedback}</FieldErrorMsg>
                  <Field
                    as={TextAreaField}
                    error={!!flatErrors.grtFeedback}
                    id="ProvideGRTFeedbackForm-GRTFeedback"
                    maxLength={2000}
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

export default ProvideGRTFeedback;
