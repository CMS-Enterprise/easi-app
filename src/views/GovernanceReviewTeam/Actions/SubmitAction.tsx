import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { Button } from '@trussworks/react-uswds';
import { Field, Form, Formik, FormikProps } from 'formik';

import { ErrorAlert, ErrorAlertMessage } from 'components/shared/ErrorAlert';
import FieldErrorMsg from 'components/shared/FieldErrorMsg';
import FieldGroup from 'components/shared/FieldGroup';
import Label from 'components/shared/Label';
import TextAreaField from 'components/shared/TextAreaField';
import { Action, ActionForm, ActionType } from 'types/action';
import { postSystemIntakeAction } from 'types/routines';
import flattenErrors from 'utils/flattenErrors';
import { actionSchema } from 'validations/actionSchema';

type SubmitActionProps = {
  action: ActionType;
  actionName: string;
};

const SubmitAction = ({ action, actionName }: SubmitActionProps) => {
  const { systemId } = useParams();
  const { t } = useTranslation('action');
  const dispatch = useDispatch();

  const dispatchSave = (values: ActionForm) => {
    const { feedback } = values;
    const payload: Action = {
      intakeId: systemId,
      actionType: action,
      feedback
    };
    dispatch(postSystemIntakeAction(payload));
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
            <h1>{t('submitAction.heading')}</h1>
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
                    maxLength={2000}
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
