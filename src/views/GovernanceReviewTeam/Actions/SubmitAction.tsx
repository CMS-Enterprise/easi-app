import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useHistory, useLocation, useParams } from 'react-router-dom';
import { DocumentNode, useMutation } from '@apollo/client';
import { Button } from '@trussworks/react-uswds';
import { Field, Form, Formik, FormikProps } from 'formik';

import PageHeading from 'components/PageHeading';
import { ErrorAlert, ErrorAlertMessage } from 'components/shared/ErrorAlert';
import FieldErrorMsg from 'components/shared/FieldErrorMsg';
import FieldGroup from 'components/shared/FieldGroup';
import Label from 'components/shared/Label';
import TextAreaField from 'components/shared/TextAreaField';
import useSystemIntake from 'hooks/useSystemIntake';
import { ActionForm } from 'types/action';
import {
  BasicActionInput,
  EmailNotificationRecipients
} from 'types/graphql-global-types';
import { SystemIntakeContactProps } from 'types/systemIntake';
import flattenErrors from 'utils/flattenErrors';
import { actionSchema } from 'validations/actionSchema';

import CompleteWithoutEmailButton from './CompleteWithoutEmailButton';
import EmailRecipientsFields from './EmailRecipientsFields';

type ActionInput = {
  input: BasicActionInput;
};

type SubmitActionProps = {
  actionName: string;
  query: DocumentNode;
};

const SubmitAction = ({ actionName, query }: SubmitActionProps) => {
  const { systemId } = useParams<{ systemId: string }>();
  const { systemIntake } = useSystemIntake(systemId);
  const { t } = useTranslation('action');
  const history = useHistory();
  const { pathname } = useLocation();
  const [shouldSendEmail, setShouldSendEmail] = useState<boolean>(true);
  const [
    activeContact,
    setActiveContact
  ] = useState<SystemIntakeContactProps | null>(null);

  const [mutate, mutationResult] = useMutation<ActionInput>(query);

  const dispatchSave = (values: ActionForm) => {
    const { feedback } = values;
    mutate({
      variables: {
        input: {
          intakeId: systemId,
          feedback,
          shouldSendEmail
          // TODO: Add recipients here
        }
      }
    }).then(response => {
      if (!response.errors) {
        history.push(`/governance-review-team/${systemId}/intake-request`);
      }
    });
  };

  const initialValues: ActionForm = {
    feedback: '',
    notificationRecipients: {
      regularRecipientEmails: [systemIntake?.requester?.email!],
      shouldNotifyITGovernance: true,
      shouldNotifyITInvestment: pathname.endsWith('/issue-lcid')
    }
  };

  const backLink = `/governance-review-team/${systemId}/actions`;

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={dispatchSave}
      validationSchema={actionSchema}
      validateOnBlur={false}
      validateOnChange={false}
      validateOnMount={false}
    >
      {(formikProps: FormikProps<ActionForm>) => {
        const {
          errors,
          setErrors,
          handleSubmit,
          submitForm,
          setFieldValue,
          values
        } = formikProps;
        const flatErrors = flattenErrors(errors);
        return (
          <>
            {Object.keys(errors).length > 0 && (
              <ErrorAlert
                testId="formik-validation-errors"
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
            {mutationResult && mutationResult.error && (
              <ErrorAlert heading="Error">
                <ErrorAlertMessage
                  message={mutationResult.error.message}
                  errorKey="systemIntake"
                />
              </ErrorAlert>
            )}
            <PageHeading
              data-testid="grt-submit-action-view"
              className="margin-top-0 margin-bottom-3"
            >
              {t('submitAction.heading')}
            </PageHeading>
            <h3 className="margin-top-3 margin-bottom-2">
              {t('submitAction.subheading')}
            </h3>
            <div className="margin-bottom-05 text-bold line-height-body-2">
              {t('extendLcid.selectedAction')}
            </div>
            <div>
              {actionName}&nbsp;
              <Link to={backLink}>{t('submitAction.backLink')}</Link>
            </div>
            <div className="margin-bottom-7">
              <Form
                onSubmit={e => {
                  handleSubmit(e);
                  window.scrollTo(0, 0);
                }}
              >
                <EmailRecipientsFields
                  className="margin-top-3"
                  systemIntakeId={systemId}
                  activeContact={activeContact}
                  setActiveContact={setActiveContact}
                  recipients={values.notificationRecipients}
                  setRecipients={(recipients: EmailNotificationRecipients) =>
                    setFieldValue('notificationRecipients', recipients)
                  }
                />
                <FieldGroup
                  scrollElement="feedback"
                  error={!!flatErrors.feedback}
                  className="margin-top-2"
                >
                  <Label
                    htmlFor="SubmitActionForm-Feedback"
                    className="line-height-body-2 text-normal"
                  >
                    {t('action:submitAction.feedbackLabel')}
                  </Label>
                  <FieldErrorMsg>{flatErrors.businessSolution}</FieldErrorMsg>
                  <Field
                    as={TextAreaField}
                    error={!!flatErrors.feedback}
                    id="SubmitActionForm-Feedback"
                    maxLength={3000}
                    name="feedback"
                  />
                </FieldGroup>
                <div>
                  <Button
                    className="margin-top-2"
                    type="submit"
                    // disabled={isSubmitting}
                    onClick={() => {
                      setErrors({});
                      setShouldSendEmail(true);
                      setFieldValue('skipEmail', false);
                    }}
                    disabled={!!activeContact}
                  >
                    {t('submitAction.submit')}
                  </Button>
                </div>
                <div>
                  <CompleteWithoutEmailButton
                    onClick={() => {
                      setErrors({});
                      setShouldSendEmail(false);
                      setFieldValue('skipEmail', true);
                      // todo hack timeout to propagate skipEmail value to the validator before submission
                      setTimeout(submitForm);
                    }}
                    disabled={!!activeContact}
                  />
                </div>
              </Form>
            </div>
          </>
        );
      }}
    </Formik>
  );
};

export default SubmitAction;
