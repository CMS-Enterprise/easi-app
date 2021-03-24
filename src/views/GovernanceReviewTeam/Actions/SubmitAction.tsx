import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
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
import { ActionForm, ActionType, CreateActionPayload } from 'types/action';
import { BasicActionInput } from 'types/graphql-global-types';
import { postAction } from 'types/routines';
import flattenErrors from 'utils/flattenErrors';
import { actionSchema } from 'validations/actionSchema';

type ActionInput = {
  input: BasicActionInput;
};

type SubmitActionProps = {
  action: ActionType;
  actionName: string;
  query: DocumentNode | null;
};

const SubmitAction = ({ action, actionName, query }: SubmitActionProps) => {
  const { systemId } = useParams<{ systemId: string }>();
  const { t } = useTranslation('action');
  const history = useHistory();
  const dispatch = useDispatch();

  let mutate: any;
  let mutationResult: any;
  if (query) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    [mutate, mutationResult] = useMutation<ActionInput>(query);
  }

  const dispatchSave = (values: ActionForm) => {
    const { feedback } = values;
    if (query) {
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
    } else {
      const payload: CreateActionPayload = {
        intakeId: systemId,
        actionType: action,
        feedback
      };
      dispatch(postAction(payload));
      history.push(`/governance-review-team/${systemId}/intake-request`);
    }
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
            {mutationResult && mutationResult.error && (
              <ErrorAlert heading="Error">
                <ErrorAlertMessage
                  message={mutationResult.error.message}
                  errorKey="systemIntake"
                />
              </ErrorAlert>
            )}
            <PageHeading>{t('submitAction.heading')}</PageHeading>
            <h2>{t('submitAction.subheading')}</h2>
            <p>
              {actionName} &nbsp;
              <Link to={backLink}>{t('submitAction.backLink')}</Link>
            </p>
            <div className="tablet:grid-col-9 margin-bottom-7">
              <Form>
                <FieldGroup
                  scrollElement="feedback"
                  error={!!flatErrors.feedback}
                >
                  <Label htmlFor="SubmitActionForm-Feedback">
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
                <Button
                  className="margin-top-2"
                  type="submit"
                  // disabled={isSubmitting}
                >
                  {t('submitAction.submit')}
                </Button>
              </Form>
            </div>
          </>
        );
      }}
    </Formik>
  );
};

export default SubmitAction;
