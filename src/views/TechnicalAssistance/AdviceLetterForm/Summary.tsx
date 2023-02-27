import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { Trans, useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { ErrorMessage, FormGroup, Label } from '@trussworks/react-uswds';

import HelpText from 'components/shared/HelpText';
import TextAreaField from 'components/shared/TextAreaField';

import Pager from '../RequestForm/Pager';

const Summary = ({ trbRequestId }: { trbRequestId: string }) => {
  const { t } = useTranslation('technicalAssistance');
  const history = useHistory();

  const {
    getValues,
    formState: { isSubmitting }
  } = useFormContext();

  return (
    <>
      <HelpText className="margin-top-1">
        <Trans
          i18nKey="technicalAssistance:requiredFields"
          components={{ red: <span className="text-red" /> }}
        />
      </HelpText>
      <Controller
        name="meetingSummary"
        // control={control}
        render={({ field, fieldState: { error } }) => {
          return (
            <FormGroup className="margin-top-4" error={!!error}>
              <Label className="text-normal" htmlFor="meetingSummary">
                {t('adviceLetterForm.meetingSummary')}{' '}
                <span className="text-red">*</span>
              </Label>
              {error && (
                <ErrorMessage>{t('errors.makeSelection')}</ErrorMessage>
              )}
              <TextAreaField
                id="meetingSummary"
                {...field}
                ref={null}
                required
              />
            </FormGroup>
          );
        }}
      />

      <Pager
        className="margin-top-4"
        back={{ outline: true, text: t('button.cancel') }}
        next={{
          disabled: isSubmitting || !getValues().meetingSummary,
          onClick: () =>
            history.push(`/trb/${trbRequestId}/advice/recommendations`)
        }}
        taskListUrl={`/trb/${trbRequestId}/request`}
        saveExitText={t('adviceLetterForm.returnToRequest')}
        border={false}
      />
    </>
  );
};

export default Summary;
