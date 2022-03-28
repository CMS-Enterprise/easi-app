import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useHistory, useParams } from 'react-router-dom';
import { DocumentNode, useMutation } from '@apollo/client';
import { Button } from '@trussworks/react-uswds';
import { Field, Form, Formik, FormikProps } from 'formik';

import PageHeading from 'components/PageHeading';
import { ErrorAlert, ErrorAlertMessage } from 'components/shared/ErrorAlert';
import FieldErrorMsg from 'components/shared/FieldErrorMsg';
import FieldGroup from 'components/shared/FieldGroup';
import Label from 'components/shared/Label';
import TextAreaField from 'components/shared/TextAreaField';
import { ActionForm } from 'types/action';
import { BasicActionInput } from 'types/graphql-global-types';
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
  const { t } = useTranslation('action');
  const history = useHistory();

  const [mutate, mutationResult] = useMutation<ActionInput>(query);

  const dispatchSave = (values: ActionForm) => {
    const { feedback } = values;
    mutate({
      variables: {
        input: {
          intakeId: systemId,
          feedback
        }
      }
    }).then(response => {
      if (!response.errors) {
        history.push(`/governance-review-team/${systemId}/intake-request`);
      }
    });
  };

  const initialValues: ActionForm = {
    feedback: ''
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
        const { errors, setErrors, handleSubmit } = formikProps;
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
            <div className="tablet:grid-col-9 margin-bottom-7">
              <Form
                onSubmit={e => {
                  handleSubmit(e);
                  window.scrollTo(0, 0);
                }}
              >
                <EmailRecipientsFields optional className="margin-top-3" />
                <FieldGroup
                  scrollElement="feedback"
                  error={!!flatErrors.feedback}
                  className="margin-top-2"
                >
                  <Label
                    htmlFor="SubmitActionForm-Feedback"
                    className="text-normal"
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
                    onClick={() => setErrors({})}
                  >
                    {t('submitAction.submit')}
                  </Button>
                </div>
                <div>
                  <CompleteWithoutEmailButton
                    onClick={() => {
                      // todo
                    }}
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
