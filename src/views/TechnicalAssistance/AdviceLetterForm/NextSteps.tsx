import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import {
  ErrorMessage,
  Fieldset,
  FormGroup,
  Radio,
  TextInput
} from '@trussworks/react-uswds';

import HelpText from 'components/shared/HelpText';
import Label from 'components/shared/Label';
import TextAreaField from 'components/shared/TextAreaField';
import { AdviceLetterFormFields } from 'types/technicalAssistance';

import Pager from '../RequestForm/Pager';

import { StepComponentProps } from '.';

const NextSteps = ({
  trbRequestId,
  updateAdviceLetter
}: StepComponentProps) => {
  const { t } = useTranslation('technicalAssistance');
  const history = useHistory();

  const {
    control,
    formState: { isSubmitting }
  } = useFormContext<AdviceLetterFormFields>();

  return (
    <div id="trbAdviceNextSteps" className="maxw-tablet">
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
            history.push(`/trb/${trbRequestId}/advice/recommendations`)
        }}
        next={{
          disabled: isSubmitting,
          onClick: () =>
            updateAdviceLetter(
              ['nextSteps', 'isFollowupRecommended', 'followupPoint'],
              `/trb/${trbRequestId}/advice/internal-review`
            )
        }}
        taskListUrl={`/trb/${trbRequestId}/request`}
        saveExitText={t('adviceLetterForm.returnToRequest')}
        border={false}
      />
    </div>
  );
};

export default NextSteps;
