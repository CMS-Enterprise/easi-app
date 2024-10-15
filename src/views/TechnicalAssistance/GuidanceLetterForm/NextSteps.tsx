import React, { useCallback, useEffect } from 'react';
import { Controller } from 'react-hook-form';
import { Trans, useTranslation } from 'react-i18next';
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

import useEasiForm from 'components/EasiForm/useEasiForm';
import RichTextEditor from 'components/RichTextEditor';
import HelpText from 'components/shared/HelpText';
import Label from 'components/shared/Label';
import { UpdateTrbAdviceLetterQuery } from 'queries/TrbAdviceLetterQueries';
import {
  UpdateTrbAdviceLetter,
  UpdateTrbAdviceLetterVariables
} from 'queries/types/UpdateTrbAdviceLetter';
import {
  GuidanceLetterNextSteps,
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
    partialSubmit,
    handleSubmit,
    control,
    watch,
    formState: { isSubmitting, isDirty }
  } = useEasiForm<GuidanceLetterNextSteps>({
    resolver: yupResolver(nextStepsSchema),
    defaultValues: {
      nextSteps: nextSteps || '',
      isFollowupRecommended: !!isFollowupRecommended,
      followupPoint: followupPoint || ''
    }
  });

  /** Submit next steps fields and update advice letter */
  const submit = useCallback<StepSubmit>(
    (callback, shouldValidate = true) =>
      handleSubmit(
        async formData => {
          try {
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
            setFormAlert(null);
            callback?.();
          } catch (e) {
            if (e instanceof ApolloError) {
              setFormAlert({
                type: 'error',
                message: t('guidanceLetterForm.error', {
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
      t,
      handleSubmit,
      isDirty,
      trbRequestId,
      update,
      setFormAlert,
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
      id="trbAdviceNextSteps"
      className="maxw-tablet"
    >
      {/* Required fields help text */}
      <HelpText className="margin-top-1 margin-bottom-1 text-base">
        <Trans
          i18nKey="technicalAssistance:requiredFields"
          components={{ red: <span className="text-red" /> }}
        />
      </HelpText>

      {/* Next steps */}
      <Controller
        name="nextSteps"
        control={control}
        render={({ field, fieldState: { error } }) => {
          return (
            <FormGroup error={!!error}>
              <Label
                className="text-normal"
                id="nextSteps-label"
                htmlFor="nextSteps"
                required
              >
                {t('guidanceLetterForm.nextSteps')}
              </Label>
              {error && <ErrorMessage>{t('errors.fillBlank')}</ErrorMessage>}
              <RichTextEditor
                editableProps={{
                  id: 'nextSteps',
                  'data-testid': 'nextSteps',
                  'aria-describedby': 'nextSteps-hint',
                  'aria-labelledby': 'nextSteps-label'
                }}
                field={{ ...field, value: field.value || '' }}
                required
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
                legend={
                  <>
                    {t('guidanceLetterForm.isFollowupRecommended')}
                    <span className="text-red"> *</span>
                  </>
                }
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
                  label={t('guidanceLetterForm.followupYes')}
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
                            {t('guidanceLetterForm.followupHelpText')}
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
                  label={t('guidanceLetterForm.notNecessary')}
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
          onClick: () => history.push(`/trb/${trbRequestId}/guidance/insights`)
        }}
        next={{
          disabled:
            isSubmitting ||
            // Disable button if followupPoint field is visible but not filled out
            (!!watch().isFollowupRecommended && !watch().followupPoint),
          onClick: () =>
            submit(() =>
              history.push(`/trb/${trbRequestId}/guidance/internal-review`)
            )
        }}
        taskListUrl={`/trb/${trbRequestId}/guidance`}
        saveExitText={t('guidanceLetterForm.returnToRequest')}
        submit={submit}
        border={false}
      />
    </Form>
  );
};

export default NextSteps;
