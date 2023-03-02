import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { useMutation } from '@apollo/client';
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

import Pager from '../RequestForm/Pager';

const Summary = ({ trbRequestId, adviceLetter }: StepComponentProps) => {
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
        back={{ outline: true, text: t('button.cancel') }}
        next={{
          disabled: isSubmitting || watch('meetingSummary')?.length === 0,
          onClick: handleSubmit(formData => {
            if (isDirty) {
              update({
                variables: {
                  input: {
                    trbRequestId,
                    meetingSummary: formData.meetingSummary
                  }
                }
              })
                .then(response => {
                  if (!response.errors) {
                    history.push(`/trb/${trbRequestId}/advice/recommendations`);
                  }
                })
                // eslint-disable-next-line no-console
                .catch(e => console.error(e));
            } else {
              history.push(`/trb/${trbRequestId}/advice/recommendations`);
            }
          })
        }}
        taskListUrl={`/trb/${trbRequestId}/request`}
        saveExitText={t('adviceLetterForm.returnToRequest')}
        border={false}
      />
    </Form>
  );
};

export default Summary;
