import React from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useMutation } from '@apollo/client';
import { FormGroup } from '@trussworks/react-uswds';

import DatePickerFormatted from 'components/shared/DatePickerFormatted';
import FieldErrorMsg from 'components/shared/FieldErrorMsg';
import HelpText from 'components/shared/HelpText';
import Label from 'components/shared/Label';
import { RadioField } from 'components/shared/RadioField';
import TextAreaField from 'components/shared/TextAreaField';
import CreateSystemIntakeActionProgressToNewStepQuery from 'queries/CreateSystemIntakeActionProgressToNewStepQuery';
import {
  CreateSystemIntakeActionProgressToNewStep,
  CreateSystemIntakeActionProgressToNewStepVariables
} from 'queries/types/CreateSystemIntakeActionProgressToNewStep';
import {
  SystemIntakeProgressToNewStepsInput,
  SystemIntakeStepToProgressTo
} from 'types/graphql-global-types';
import { NonNullableProps } from 'types/util';

import ActionForm, { SystemIntakeActionFields } from './components/ActionForm';

type ProgressToNewStepFields = NonNullableProps<
  Omit<SystemIntakeProgressToNewStepsInput, 'systemIntakeID'> &
    SystemIntakeActionFields
>;

const ProgressToNewStep = ({ systemIntakeId }: { systemIntakeId: string }) => {
  const { t } = useTranslation('action');

  const [mutate] = useMutation<
    CreateSystemIntakeActionProgressToNewStep,
    CreateSystemIntakeActionProgressToNewStepVariables
  >(CreateSystemIntakeActionProgressToNewStepQuery, {
    refetchQueries: ['GetSystemIntake']
  });

  const form = useForm<ProgressToNewStepFields>();
  const { control } = form;

  /**
   * Submit handler containing mutation logic
   *
   * Error and success handling is done in `<ActionForm>`
   */
  const onSubmit = async (formData: ProgressToNewStepFields) =>
    mutate({
      variables: {
        input: {
          systemIntakeID: systemIntakeId,
          ...formData
        }
      }
    });

  return (
    <FormProvider<ProgressToNewStepFields> {...form}>
      <ActionForm
        systemIntakeId={systemIntakeId}
        title={t('progressToNewStep.title')}
        description={t('progressToNewStep.description')}
        breadcrumb={t('progressToNewStep.breadcrumb')}
        successMessage=""
        onSubmit={onSubmit}
        actionsSummaryProps={{
          heading: t('progressToNewStep.summaryBoxHeading'),
          items: [
            {
              title: t('progressToNewStep.draftBusinessCase'),
              description: t('progressToNewStep.draftBusinessCaseDescription')
            },
            {
              title: t('progressToNewStep.grtMeeting'),
              description: t('progressToNewStep.grtMeetingDescription')
            },
            {
              title: t('progressToNewStep.finalBusinessCase'),
              description: t('progressToNewStep.finalBusinessCaseDescription')
            },
            {
              title: t('progressToNewStep.grbMeeting'),
              description: t('progressToNewStep.grbMeetingDescription')
            }
          ]
        }}
      >
        <Controller
          control={control}
          name="newStep"
          render={({ field: { ref, ...field }, fieldState: { error } }) => (
            <FormGroup error={!!error}>
              <Label htmlFor={field.name} className="text-normal" required>
                {t('progressToNewStep.newStep')}
              </Label>
              {!!error?.message && (
                <FieldErrorMsg>{t(error.message)}</FieldErrorMsg>
              )}
              <RadioField
                {...field}
                value={SystemIntakeStepToProgressTo.DRAFT_BUSINESS_CASE}
                id={SystemIntakeStepToProgressTo.DRAFT_BUSINESS_CASE}
                label={t('progressToNewStep.draftBusinessCase')}
              />
              <RadioField
                {...field}
                value={SystemIntakeStepToProgressTo.GRT_MEETING}
                id={SystemIntakeStepToProgressTo.GRT_MEETING}
                label={t('progressToNewStep.grtMeeting')}
              />
              {field.value === SystemIntakeStepToProgressTo.GRT_MEETING && (
                <Controller
                  control={control}
                  name="meetingDate"
                  render={({
                    field: { ref: meetingDateRef, ...meetingDateField },
                    fieldState: { error: meetingDateError }
                  }) => (
                    <FormGroup
                      error={!!meetingDateError}
                      className="margin-left-4 margin-top-1"
                    >
                      <Label htmlFor={field.name}>
                        {t('progressToNewStep.meetingDate')}
                      </Label>
                      <HelpText className="margin-top-1">
                        {t('progressToNewStep.meetingDateHelpText')}
                      </HelpText>
                      <HelpText>{t('retireLcid.format')}</HelpText>
                      {!!meetingDateError?.message && (
                        <FieldErrorMsg>
                          {t(meetingDateError.message)}
                        </FieldErrorMsg>
                      )}
                      <DatePickerFormatted
                        {...meetingDateField}
                        id="meetingDate"
                      />
                    </FormGroup>
                  )}
                />
              )}

              <RadioField
                {...field}
                value={SystemIntakeStepToProgressTo.FINAL_BUSINESS_CASE}
                id={SystemIntakeStepToProgressTo.FINAL_BUSINESS_CASE}
                label={t('progressToNewStep.finalBusinessCase')}
              />
              <RadioField
                {...field}
                value={SystemIntakeStepToProgressTo.GRB_MEETING}
                id={SystemIntakeStepToProgressTo.GRB_MEETING}
                label={t('progressToNewStep.grbMeeting')}
              />
            </FormGroup>
          )}
        />
        <Controller
          control={control}
          name="feedback"
          render={({ field: { ref, ...field } }) => (
            <FormGroup>
              <Label htmlFor={field.name} className="text-normal">
                {t('progressToNewStep.feedback')}
              </Label>
              <HelpText className="margin-top-1">
                {t('progressToNewStep.feedbackHelpText')}
              </HelpText>
              <TextAreaField
                {...field}
                id={field.name}
                value={field.value || ''}
                size="sm"
                characterCounter={false}
              />
            </FormGroup>
          )}
        />
        <Controller
          control={control}
          name="grbRecommendations"
          render={({ field: { ref, ...field } }) => (
            <FormGroup>
              <Label htmlFor={field.name} className="text-normal">
                {t('progressToNewStep.grbRecommendations')}
              </Label>
              <HelpText className="margin-top-1">
                {t('progressToNewStep.grbRecommendationsHelpText')}
              </HelpText>
              <TextAreaField
                {...field}
                id={field.name}
                value={field.value || ''}
                size="sm"
                characterCounter={false}
              />
            </FormGroup>
          )}
        />
      </ActionForm>
    </FormProvider>
  );
};

export default ProgressToNewStep;
