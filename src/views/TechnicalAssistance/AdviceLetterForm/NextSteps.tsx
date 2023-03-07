import React, { useCallback, useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { ApolloError, useMutation } from '@apollo/client';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  ErrorMessage,
  Fieldset,
  Form,
  FormGroup,
  Radio,
  TextInput
} from '@trussworks/react-uswds';

import HelpText from 'components/shared/HelpText';
import Label from 'components/shared/Label';
import TextAreaField from 'components/shared/TextAreaField';
import { UpdateTrbAdviceLetterQuery } from 'queries/TrbAdviceLetterQueries';
import {
  UpdateTrbAdviceLetter,
  UpdateTrbAdviceLetterVariables
} from 'queries/types/UpdateTrbAdviceLetter';
import {
  AdviceLetterNextSteps,
  StepComponentProps
} from 'types/technicalAssistance';
import { nextStepsSchema } from 'validations/trbRequestSchema';

import { StepSubmit } from '../RequestForm';
import Pager from '../RequestForm/Pager';

const NextSteps = ({
  trbRequestId,
  adviceLetter,
  setFormAlert,
  setStepSubmit,
  setIsStepSubmitting
}: StepComponentProps) => {
  const { t } = useTranslation('technicalAssistance');
  const history = useHistory();

  const { nextSteps, isFollowupRecommended, followupPoint } = adviceLetter;

  const [update] = useMutation<
    UpdateTrbAdviceLetter,
    UpdateTrbAdviceLetterVariables
  >(UpdateTrbAdviceLetterQuery);

  const {
    handleSubmit,
    control,
    formState: { isSubmitting, isDirty }
  } = useForm<AdviceLetterNextSteps>({
    resolver: yupResolver(nextStepsSchema),
    defaultValues: {
      nextSteps,
      isFollowupRecommended,
      followupPoint
    }
  });

  /** Update advice letter meeting summary */
  const submit: StepSubmit = useCallback(
    callback => {
      /** Submits form and updates advice letter */
      const submitForm = handleSubmit(
        async formData => {
          if (isDirty) {
            // UpdateTrbAdviceLetter mutation
            await update({
              variables: {
                input: {
                  trbRequestId,
                  ...formData,
                  // If isFollowUpRecommended is set to false, clear followupPoint value
                  followupPoint: formData.isFollowupRecommended
                    ? formData.followupPoint
                    : null
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
      id="trbAdviceNextSteps"
      className="maxw-tablet"
    >
      {/* Next steps */}
      <Controller
        name="nextSteps"
        control={control}
        render={({ field, fieldState: { error } }) => {
          return (
            <FormGroup error={!!error}>
              <Label className="text-normal" htmlFor="nextSteps">
                {t('adviceLetterForm.nextSteps')}
              </Label>
              {error && <ErrorMessage>{t('errors.fillBlank')}</ErrorMessage>}
              <TextAreaField
                id="nextSteps"
                {...field}
                ref={null}
                value={field.value || ''}
              />
            </FormGroup>
          );
        }}
      />

      {/* Follow up */}
      <Controller
        name="isFollowupRecommended"
        control={control}
        render={({ field, fieldState: { error } }) => {
          return (
            <FormGroup error={!!error}>
              <Fieldset
                legend={t('adviceLetterForm.isFollowupRecommended')}
                className="text-normal"
              >
                {error && (
                  <ErrorMessage>{t('errors.makeSelection')}</ErrorMessage>
                )}
                {/* Yes, a follow-up is recommended */}
                <Radio
                  {...field}
                  ref={null}
                  id="isFollowupRecommendedYes"
                  label={t('adviceLetterForm.followupYes')}
                  value="true"
                  checked={field.value === true}
                  onChange={() => field.onChange(true)}
                />
                {field.value === true && (
                  /* Follow-up point */
                  <Controller
                    name="followupPoint"
                    control={control}
                    render={input => {
                      return (
                        <FormGroup
                          error={!!input.fieldState.error}
                          className="margin-left-4"
                        >
                          <Label
                            htmlFor="followupPoint"
                            className="text-normal"
                          >
                            {t('When?')}
                          </Label>
                          <HelpText>
                            {t('adviceLetterForm.followupHelpText')}
                          </HelpText>
                          {input.fieldState.error && (
                            <ErrorMessage>{t('errors.fillBlank')}</ErrorMessage>
                          )}
                          <TextInput
                            type="text"
                            {...input.field}
                            ref={null}
                            id="followupPoint"
                            value={input.field.value || ''}
                          />
                        </FormGroup>
                      );
                    }}
                  />
                )}
                {/* Follow-up not necessary */}
                <Radio
                  {...field}
                  ref={null}
                  id="isFollowupRecommendedNo"
                  label={t('adviceLetterForm.notNecessary')}
                  value="false"
                  checked={field.value === false}
                  onChange={() => field.onChange(false)}
                />
              </Fieldset>
            </FormGroup>
          );
        }}
      />

      {/* Form pager buttons */}
      <Pager
        className="margin-top-4"
        back={{
          outline: true,
          onClick: () =>
            submit(() =>
              history.push(`/trb/${trbRequestId}/advice/recommendations`)
            )
        }}
        next={{
          disabled: isSubmitting,
          onClick: () =>
            submit(() =>
              history.push(`/trb/${trbRequestId}/advice/internal-review`)
            )
        }}
        taskListUrl={`/trb/${trbRequestId}/request`}
        saveExitText={t('adviceLetterForm.returnToRequest')}
        border={false}
      />
    </Form>
  );
};

export default NextSteps;
