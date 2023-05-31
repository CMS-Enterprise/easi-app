import React, { useCallback, useEffect } from 'react';
import { Controller } from 'react-hook-form';
import { Trans, useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { ApolloError, useMutation } from '@apollo/client';
import { yupResolver } from '@hookform/resolvers/yup';
import { ErrorMessage, Form, FormGroup } from '@trussworks/react-uswds';

import HelpText from 'components/shared/HelpText';
import Label from 'components/shared/Label';
import TextAreaField from 'components/shared/TextAreaField';
import useEasiForm from 'hooks/useEasiForm';
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
  const history = useHistory();

  const { meetingSummary } = adviceLetter;

  const [update] = useMutation<
    UpdateTrbAdviceLetter,
    UpdateTrbAdviceLetterVariables
  >(UpdateTrbAdviceLetterQuery);

  const {
    handleSubmit,
    control,
    watch,
    partialSubmit,
    formState: { isSubmitting, isDirty }
  } = useEasiForm<AdviceLetterSummary>({
    resolver: yupResolver(meetingSummarySchema),
    defaultValues: {
      meetingSummary
    }
  });

  /** Submit meeting summary fields and update advice letter */
  const submit = useCallback<StepSubmit>(
    (callback, shouldValidate) =>
      handleSubmit(
        async formData => {
          try {
            if (isDirty) {
              // UpdateTrbAdviceLetter mutation
              await update({
                variables: {
                  input: {
                    trbRequestId,
                    ...formData
                  }
                }
              });
            }
            setFormAlert(null);
            callback?.();
          } catch (e) {
            if (e instanceof ApolloError) {
              setFormAlert({
                type: 'error',
                message: t('adviceLetterForm.error', {
                  action: 'saving',
                  type: 'advice letter'
                })
              });
            }
          }
        },
        async () => {
          // Save valid dirty fields on save and exit
          if (!shouldValidate) {
            await partialSubmit({
              update: formData =>
                update({
                  variables: {
                    input: {
                      trbRequestId,
                      ...formData
                    }
                  }
                }),
              callback
            });
          }
        }
      )(),
    [
      handleSubmit,
      isDirty,
      trbRequestId,
      update,
      setFormAlert,
      t,
      partialSubmit
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
      onSubmit={e => e.preventDefault()}
      id="trbAdviceSummary"
      className="maxw-tablet"
    >
      {/* Required fields help text */}
      <HelpText className="margin-top-1 margin-bottom-1 text-base">
        <Trans
          i18nKey="technicalAssistance:requiredFields"
          components={{ red: <span className="text-red" /> }}
        />
      </HelpText>

      {/* Meeting summary field */}
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

      {/* Form pager buttons */}
      <Pager
        className="margin-top-4"
        back={{
          outline: true,
          text: t('button.cancel'),
          onClick: () => history.push(`/trb/${trbRequestId}/advice`)
        }}
        next={{
          disabled: isSubmitting || !watch('meetingSummary'),
          onClick: () =>
            submit(() =>
              history.push(`/trb/${trbRequestId}/advice/recommendations`)
            )
        }}
        taskListUrl={`/trb/${trbRequestId}/advice`}
        saveExitText={t('adviceLetterForm.returnToRequest')}
        submit={submit}
        border={false}
      />
    </Form>
  );
};

export default Summary;
