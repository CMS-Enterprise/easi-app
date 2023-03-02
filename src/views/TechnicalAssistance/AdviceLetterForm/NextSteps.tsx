import React, { useCallback } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { useMutation } from '@apollo/client';
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

import Pager from '../RequestForm/Pager';

const NextSteps = ({ trbRequestId, adviceLetter }: StepComponentProps) => {
  const { t } = useTranslation('technicalAssistance');

  const { nextSteps, isFollowupRecommended, followupPoint } = adviceLetter;

  const history = useHistory();

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

  const updateForm = useCallback(
    (url: string) => {
      if (!isDirty) {
        history.push(url);
      } else {
        handleSubmit(
          formData => {
            /** Updated form values */
            const input = { trbRequestId, ...formData };

            // If isFollowUpRecommended is changed to false, clear followupPoint value
            if (!formData.isFollowupRecommended) {
              input.followupPoint = '';
            }

            update({
              variables: {
                input
              }
            });
          },
          () => {
            // Need to throw from this error handler so that the promise is rejected
            throw new Error('Invalid next steps');
          }
        )().then(
          () => history.push(url),
          e => {
            // setFormAlert({
            //   type: 'error',
            //   heading: t('errors.somethingWrong'),
            //   message: t('basic.errors.submit')
            // });

            // TODO: Error handling
            // eslint-disable-next-line no-console
            console.error(e);
          }
        );
      }
    },
    [handleSubmit, isDirty, trbRequestId, history, update]
  );

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
            updateForm(`/trb/${trbRequestId}/advice/recommendations`)
        }}
        next={{
          disabled: isSubmitting,
          onClick: () =>
            updateForm(`/trb/${trbRequestId}/advice/internal-review`)
        }}
        taskListUrl={`/trb/${trbRequestId}/request`}
        saveExitText={t('adviceLetterForm.returnToRequest')}
        border={false}
      />
    </Form>
  );
};

export default NextSteps;
