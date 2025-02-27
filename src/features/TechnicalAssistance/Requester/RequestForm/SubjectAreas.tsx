import React, { useCallback, useEffect, useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { ApolloError } from '@apollo/client';
import {
  ErrorMessage,
  Form,
  FormGroup,
  Grid,
  Label
} from '@trussworks/react-uswds';
import {
  TRBSubjectAreaOption,
  useUpdateTRBFormMutation
} from 'gql/generated/graphql';
import { isEqual, pick } from 'lodash';

import Alert from 'components/Alert';
import { ErrorAlertMessage } from 'components/ErrorAlert';
import TextAreaField from 'components/TextAreaField';
import nullFillObject from 'utils/nullFillObject';

import Pager from './Pager';
import { FormStepComponentProps, StepSubmit } from '.';

export const subjectAreasBlankValues = {
  subjectAreaOptions: [],
  subjectAreaOptionOther: ''
};

/**
 * Uses enum `TRBSubjectAreaOption` to render form fields.
 */
function SubjectAreas({
  request,
  stepUrl,
  taskListUrl,
  refetchRequest,
  setStepSubmit,
  setIsStepSubmitting,
  setFormAlert
}: FormStepComponentProps) {
  const history = useHistory();

  const { t } = useTranslation('technicalAssistance');

  const [updateForm] = useUpdateTRBFormMutation();

  const initialValues = nullFillObject(request.form, subjectAreasBlankValues);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty, dirtyFields },
    watch
  } = useForm({
    defaultValues: initialValues
  });

  const hasErrors = Object.keys(errors).length > 0;

  const subjectData = watch();

  /**
   * Switch submit button between next (true) and continue (false)
   */
  const unfilled: boolean = useMemo(
    () => isEqual(subjectData, subjectAreasBlankValues),
    [subjectData]
  );

  useEffect(() => {
    if (hasErrors) {
      const err = document.querySelector('.trb-fields-error');
      err?.scrollIntoView();
    }
  }, [errors, hasErrors]);

  const submit = useCallback<StepSubmit>(
    callback =>
      handleSubmit(async formData => {
        try {
          if (isDirty) {
            const input: any = pick(formData, Object.keys(dirtyFields));

            Object.entries(input).forEach(([key, value]) => {
              if (value === '') input[key] = null;
            });

            await updateForm({
              variables: {
                input: {
                  trbRequestId: request.id,
                  ...input
                }
              }
            });

            await refetchRequest();
          }

          callback?.();
        } catch (e) {
          if (e instanceof ApolloError) {
            setFormAlert({
              type: 'error',
              heading: t('errors.somethingWrong'),
              message: t('basic.errors.submit')
            });
          }
        }
      })(),
    [
      dirtyFields,
      handleSubmit,
      isDirty,
      refetchRequest,
      request.id,
      updateForm,
      setFormAlert,
      t
    ]
  );

  useEffect(() => {
    setStepSubmit(() => submit);
  }, [setStepSubmit, submit]);

  useEffect(() => {
    setIsStepSubmitting(isSubmitting);
  }, [setIsStepSubmitting, isSubmitting]);

  return (
    <Form
      className="trb-form-subject maxw-full"
      onSubmit={e => e.preventDefault()}
    >
      {/* Validation errors summary */}
      {hasErrors && (
        <Alert
          heading={t('errors.checkFix')}
          type="error"
          className="trb-fields-error margin-y-2"
          slim={false}
        >
          {Object.keys(errors).map(fieldName => {
            let msg: string;
            if (fieldName.endsWith('Other')) {
              msg = `${t(
                `subject.labels.${fieldName.replace(/Other$/, '')}`
              )}: ${t('subject.labels.other')}`;
            } else {
              msg = t(`subject.labels.${fieldName}`);
            }
            return (
              <ErrorAlertMessage
                key={fieldName}
                errorKey={fieldName}
                message={msg}
              />
            );
          })}
        </Alert>
      )}

      <Controller
        name="subjectAreaOptions"
        control={control}
        render={({ field, fieldState: { error } }) => {
          return (
            <FormGroup>
              <Grid
                row
                gap={2}
                desktop={{ col: 12 }}
                className="flex-column subject-container-height"
              >
                {Object.keys(TRBSubjectAreaOption).map(key => (
                  <Grid desktop={{ col: 4 }} key={key}>
                    {error && (
                      <ErrorMessage>{t('errors.makeSelection')}</ErrorMessage>
                    )}
                    <div className="usa-checkbox">
                      <input
                        type="checkbox"
                        className="usa-checkbox__input usa-checkbox__input--tile"
                        id={key}
                        value={key}
                        name="subjectAreaOptions"
                        onChange={e => {
                          const returnValues = [...field?.value];
                          if (e.target.checked) {
                            returnValues?.push(key);
                          } else {
                            const removeIndex = returnValues?.indexOf(key);
                            if (
                              typeof removeIndex === 'number' &&
                              removeIndex > -1
                            ) {
                              returnValues?.splice(removeIndex, 1);
                            }
                          }
                          return field.onChange(returnValues);
                        }}
                        checked={field.value?.includes(key)}
                        onBlur={() => null}
                      />
                      <label className="usa-checkbox__label" htmlFor={key}>
                        {t(`subject.labels.${key}`)}
                      </label>
                    </div>
                  </Grid>
                ))}
              </Grid>
            </FormGroup>
          );
        }}
      />

      <Grid desktop={{ col: 12 }} className="padding-top-1">
        <Controller
          name="subjectAreaOptionOther"
          control={control}
          // eslint-disable-next-line @typescript-eslint/no-shadow
          render={({ field, fieldState: { error } }) => (
            <FormGroup className="margin-top-1">
              <Label
                htmlFor="subjectAreaOptionOther"
                hint={<div>{t('subject.otherHint')}</div>}
                error={!!error}
                className="text-normal"
              >
                <div className="text-bold">{t(`subject.other`)}</div>
              </Label>
              {error && <ErrorMessage>{t('errors.fillBlank')}</ErrorMessage>}
              <TextAreaField
                {...field}
                ref={null}
                id="subjectAreaOptionOther"
                data-testid="subjectAreaOptionOther"
              />
            </FormGroup>
          )}
        />
      </Grid>

      <Pager
        className="margin-top-5"
        back={{
          disabled: isSubmitting,
          onClick: () => {
            submit(() => {
              history.push(stepUrl.back);
            });
          }
        }}
        next={{
          disabled: isSubmitting,
          onClick: () => {
            submit(() => {
              history.push(stepUrl.next);
            });
          },
          text: unfilled ? t('subject.continueWithoutAdding') : undefined,
          outline: unfilled
        }}
        saveExitDisabled={isSubmitting}
        submit={submit}
        taskListUrl={taskListUrl}
      />
    </Form>
  );
}

export default SubjectAreas;
