import React, { useContext, useEffect } from 'react';
import { Control, Controller, FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useMutation } from '@apollo/client';
import { yupResolver } from '@hookform/resolvers/yup';
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
  SystemIntakeStep,
  SystemIntakeStepToProgressTo
} from 'types/graphql-global-types';
import { NonNullableProps } from 'types/util';
import { progressToNewStepSchema } from 'validations/actionSchema';

import ActionForm, { SystemIntakeActionFields } from './components/ActionForm';
import { EditsRequestedContext } from '.';

type ProgressToNewStepFields = NonNullableProps<
  Omit<SystemIntakeProgressToNewStepsInput, 'systemIntakeID'> &
    SystemIntakeActionFields
>;

type ProgressToNewStepProps = {
  systemIntakeId: string;
  step: SystemIntakeStep | undefined;
};

/** Meeting date sub-field for the GRT and GRB meeting radio fields */
const MeetingDateField = ({
  control,
  type
}: {
  control: Control<ProgressToNewStepFields>;
  type: 'GRT' | 'GRB';
}) => {
  const { t } = useTranslation('action');
  return (
    <Controller
      control={control}
      name="meetingDate"
      render={({ field: { ref, ...field }, fieldState: { error } }) => (
        <FormGroup error={!!error} className="margin-left-4 margin-top-1">
          <Label htmlFor={field.name}>
            {t('progressToNewStep.meetingDate')}
          </Label>
          <HelpText className="margin-top-1">
            {t('progressToNewStep.meetingDateHelpText', { type })}
          </HelpText>
          <HelpText>{t('retireLcid.format')}</HelpText>
          {!!error?.message && (
            <FieldErrorMsg>{t(error.message)}</FieldErrorMsg>
          )}
          <DatePickerFormatted {...field} id="meetingDate" />
        </FormGroup>
      )}
    />
  );
};

const ProgressToNewStep = ({
  systemIntakeId,
  step
}: ProgressToNewStepProps) => {
  const { t } = useTranslation('action');

  /** Edits requested form key for confirmation modal */
  const editsRequestedKey = useContext(EditsRequestedContext);

  const [mutate] = useMutation<
    CreateSystemIntakeActionProgressToNewStep,
    CreateSystemIntakeActionProgressToNewStepVariables
  >(CreateSystemIntakeActionProgressToNewStepQuery, {
    refetchQueries: ['GetSystemIntake']
  });

  /** Current step converted to `SystemIntakeStepToProgressTo` type */
  const currentStep =
    step && step in SystemIntakeStepToProgressTo
      ? SystemIntakeStepToProgressTo[
          SystemIntakeStep[step] as keyof typeof SystemIntakeStepToProgressTo
        ]
      : undefined;

  const form = useForm<ProgressToNewStepFields>({
    resolver: yupResolver(progressToNewStepSchema(currentStep))
  });
  const { control, watch, setValue } = form;

  const newStep = watch('newStep');

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

  // Reset meeting date field value on new step field value change
  useEffect(() => {
    setValue('meetingDate', undefined);
  }, [newStep, setValue]);

  return (
    <FormProvider<ProgressToNewStepFields> {...form}>
      <ActionForm
        systemIntakeId={systemIntakeId}
        title={t('progressToNewStep.title')}
        description={t('progressToNewStep.description')}
        breadcrumb={t('progressToNewStep.breadcrumb')}
        successMessage={t('progressToNewStep.success', {
          newStep: t(`progressToNewStep.${newStep}`)
        })}
        onSubmit={onSubmit}
        modal={
          editsRequestedKey && {
            title: t('decisionModal.title', { context: 'nextStep' }),
            content: t('decisionModal.content', {
              action: t(`decisionModal.${editsRequestedKey}`)
            })
          }
        }
        actionsSummaryProps={{
          heading: t('progressToNewStep.summaryBoxHeading'),
          items: [
            {
              title: t('progressToNewStep.DRAFT_BUSINESS_CASE'),
              description: t('progressToNewStep.draftBusinessCaseDescription')
            },
            {
              title: t('progressToNewStep.GRT_MEETING'),
              description: t('progressToNewStep.grtMeetingDescription')
            },
            {
              title: t('progressToNewStep.FINAL_BUSINESS_CASE'),
              description: t('progressToNewStep.finalBusinessCaseDescription')
            },
            {
              title: t('progressToNewStep.GRB_MEETING'),
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
                label={t('progressToNewStep.DRAFT_BUSINESS_CASE')}
              />

              <RadioField
                {...field}
                value={SystemIntakeStepToProgressTo.GRT_MEETING}
                id={SystemIntakeStepToProgressTo.GRT_MEETING}
                label={t('progressToNewStep.GRT_MEETING')}
              />
              {field.value === SystemIntakeStepToProgressTo.GRT_MEETING && (
                <MeetingDateField control={control} type="GRT" />
              )}

              <RadioField
                {...field}
                value={SystemIntakeStepToProgressTo.FINAL_BUSINESS_CASE}
                id={SystemIntakeStepToProgressTo.FINAL_BUSINESS_CASE}
                label={t('progressToNewStep.FINAL_BUSINESS_CASE')}
              />

              <RadioField
                {...field}
                value={SystemIntakeStepToProgressTo.GRB_MEETING}
                id={SystemIntakeStepToProgressTo.GRB_MEETING}
                label={t('progressToNewStep.GRB_MEETING')}
              />
              {field.value === SystemIntakeStepToProgressTo.GRB_MEETING && (
                <MeetingDateField control={control} type="GRB" />
              )}
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
