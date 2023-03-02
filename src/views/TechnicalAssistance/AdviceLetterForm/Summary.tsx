import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { ErrorMessage, FormGroup } from '@trussworks/react-uswds';

import Label from 'components/shared/Label';
import TextAreaField from 'components/shared/TextAreaField';
import { AdviceLetterFormFields } from 'types/technicalAssistance';

import Pager from '../RequestForm/Pager';

import { StepComponentProps } from '.';

const Summary = ({ trbRequestId, updateAdviceLetter }: StepComponentProps) => {
  const { t } = useTranslation('technicalAssistance');

  const {
    control,
    formState: { isSubmitting }
  } = useFormContext<AdviceLetterFormFields>();

  return (
    <div id="trbAdviceSummary" className="maxw-tablet">
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
          // TODO: disabled prop
          disabled: isSubmitting,
          onClick: () =>
            updateAdviceLetter(
              ['meetingSummary'],
              `/trb/${trbRequestId}/advice/recommendations`
            )
        }}
        taskListUrl={`/trb/${trbRequestId}/request`}
        saveExitText={t('adviceLetterForm.returnToRequest')}
        border={false}
      />
    </div>
  );
};

export default Summary;
