import React, { useCallback, useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { ApolloError, useMutation } from '@apollo/client';
import { yupResolver } from '@hookform/resolvers/yup';
import { ErrorMessage, Form, FormGroup } from '@trussworks/react-uswds';

import Label from 'components/shared/Label';
import TextAreaField from 'components/shared/TextAreaField';
import { UpdateTrbAdviceLetterQuery } from 'queries/TrbAdviceLetterQueries';
import {
  UpdateTrbAdviceLetter,
  UpdateTrbAdviceLetterVariables
} from 'queries/types/UpdateTrbAdviceLetter';
import {
  AdviceLetterSummary,
  StepComponentProps
} from 'types/technicalAssistance';
import { meetingSummarySchema } from 'validations/trbRequestSchema';

import { StepSubmit } from '../RequestForm';
import Pager from '../RequestForm/Pager';

const Summary = ({
  trbRequestId,
  adviceLetter,
  setFormAlert,
  setStepSubmit,
  setIsStepSubmitting
}: StepComponentProps) => {
  const { t } = useTranslation('technicalAssistance');

  const { meetingSummary } = adviceLetter;

  const history = useHistory();

  const [update] = useMutation<
    UpdateTrbAdviceLetter,
    UpdateTrbAdviceLetterVariables
  >(UpdateTrbAdviceLetterQuery);

  const {
    handleSubmit,
    control,
    watch,
    formState: { isSubmitting, isDirty }
  } = useForm<AdviceLetterSummary>({
    resolver: yupResolver(meetingSummarySchema),
    defaultValues: {
      meetingSummary
    }
  });

  /** Update advice letter meeting summary */
  const submit: StepSubmit = useCallback(
    callback => {
      /** Form submission and UpdateTrbAdviceLetter mutation */
      const submitForm = handleSubmit(
        async formData => {
          if (isDirty) {
            await update({
              variables: {
                input: {
                  trbRequestId,
                  ...formData
                }
              }
            });
          }
        },
        // Throw error to cause promise to fail
        () => {
          throw new Error('Invalid field submission');
        }
      );

      // Submit form
      return submitForm().then(
        // If successful, set error to null and execute callback
        () => {
          setFormAlert(null);
          callback?.();
        },
        // If apollo error, set form alert error message
        e => {
          if (e instanceof ApolloError) {
            setFormAlert({
              type: 'error',
              message: t('adviceLetterForm.error')
            });
          }
        }
      );
    },
    [handleSubmit, isDirty, trbRequestId, update, setFormAlert, t]
  );

  useEffect(() => {
    setStepSubmit(() => submit);
  }, [setStepSubmit, submit]);

  useEffect(() => {
    setIsStepSubmitting(isSubmitting);
  }, [setIsStepSubmitting, isSubmitting]);

  return (
    <Form
      onSubmit={e => e.preventDefault()}
      id="trbAdviceSummary"
      className="maxw-tablet"
    >
      {/** Meeting summary field */}
      <Controller
        name="meetingSummary"
        control={control}
        render={({ field, fieldState: { error } }) => {
          return (
            <FormGroup error={!!error}>
              <Label className="text-normal" htmlFor="meetingSummary" required>
                {t('adviceLetterForm.meetingSummary')}{' '}
              </Label>
              {error && <ErrorMessage>{t('errors.fillBlank')}</ErrorMessage>}
              <TextAreaField
                id="meetingSummary"
                {...field}
                ref={null}
                value={field.value || ''}
              />
            </FormGroup>
          );
        }}
      />

      {/** Form pager buttons */}
      <Pager
        className="margin-top-4"
        back={{
          outline: true,
          text: t('button.cancel'),
          onClick: () => history.push(`/trb/${trbRequestId}/advice`)
        }}
        next={{
          disabled:
            isSubmitting ||
            !watch('meetingSummary') ||
            watch('meetingSummary')?.length === 0,
          onClick: () =>
            submit(() =>
              history.push(`/trb/${trbRequestId}/advice/recommendations`)
            )
        }}
        taskListUrl={`/trb/${trbRequestId}/request`}
        saveExitText={t('adviceLetterForm.returnToRequest')}
        border={false}
      />
    </Form>
  );
};

export default Summary;
