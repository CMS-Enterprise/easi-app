import React, { useCallback } from 'react';
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

  /** Update advice letter meeting summary */
  const updateForm = useCallback(
    (url: string) => {
      if (!isDirty) {
        history.push(url);
      } else {
        handleSubmit(
          formData => {
            update({
              variables: {
                input: {
                  trbRequestId,
                  ...formData
                }
              }
            });
          },
          () => {
            // Need to throw from this error handler so that the promise is rejected
            throw new Error('Invalid meeting summary');
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
          onClick: () => history.push(`trb/${trbRequestId}/advice`)
        }}
        next={{
          disabled: isSubmitting || watch('meetingSummary')?.length === 0,
          onClick: () =>
            updateForm(`/trb/${trbRequestId}/advice/recommendations`)
        }}
        taskListUrl={`/trb/${trbRequestId}/request`}
        saveExitText={t('adviceLetterForm.returnToRequest')}
        border={false}
      />
    </Form>
  );
};

export default Summary;
