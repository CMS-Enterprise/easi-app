import React from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { FormGroup } from '@trussworks/react-uswds';

import DatePickerFormatted from 'components/shared/DatePickerFormatted';
import FieldErrorMsg from 'components/shared/FieldErrorMsg';
import HelpText from 'components/shared/HelpText';
import Label from 'components/shared/Label';
import { RadioField } from 'components/shared/RadioField';
import TextAreaField from 'components/shared/TextAreaField';
import {
  SystemIntakeIssueLCIDInput,
  SystemIntakeTRBFollowUp
} from 'types/graphql-global-types';
import { NonNullableProps } from 'types/util';

import ActionForm, { SystemIntakeActionFields } from '../components/ActionForm';

type IssueLcidFields = NonNullableProps<
  Omit<SystemIntakeIssueLCIDInput, 'systemIntakeId'> & SystemIntakeActionFields
>;

const IssueLcid = ({ systemIntakeId }: { systemIntakeId: string }) => {
  const { t } = useTranslation('action');
  const form = useForm<IssueLcidFields>();

  const { control } = form;

  /**
   * Submit handler containing mutation logic
   *
   * Error and success handling is done in `<ActionForm>`
   */
  const onSubmit = async (formData: IssueLcidFields) => {
    // Execute mutation here
    // mutate(formData);
  };

  return (
    <FormProvider<IssueLcidFields> {...form}>
      <ActionForm
        systemIntakeId={systemIntakeId}
        successMessage=""
        onSubmit={onSubmit}
      >
        <Controller
          name="lcid"
          control={control}
          render={({ field: { ref, ...field }, fieldState: { error } }) => (
            <FormGroup error={!!error}>
              <Label htmlFor={field.name} className="text-normal" required>
                {t('issueLCID.lcid.label')}
              </Label>
              <HelpText className="margin-top-1">
                {t('issueLCID.lcid.helpText')}
              </HelpText>
              {!!error && <FieldErrorMsg>{t('Error')}</FieldErrorMsg>}
              <RadioField
                {...field}
                id="new"
                value="new"
                checked={false}
                label={t('issueLCID.lcid.new')}
              />
              <RadioField
                {...field}
                id="existing"
                value="existing"
                checked={false}
                label={t('issueLCID.lcid.existing')}
              />
            </FormGroup>
          )}
        />

        <Controller
          name="expiresAt"
          control={control}
          render={({ field: { ref, ...field }, fieldState: { error } }) => (
            <FormGroup error={!!error}>
              <Label htmlFor={field.name} className="text-normal" required>
                {t('issueLCID.expirationDate.label')}
              </Label>
              <HelpText className="margin-top-1">{t('mm/dd/yyyy')}</HelpText>
              {!!error && <FieldErrorMsg>{t('Error')}</FieldErrorMsg>}
              <DatePickerFormatted {...field} id={field.name} />
            </FormGroup>
          )}
        />

        <Controller
          name="scope"
          control={control}
          render={({ field: { ref, ...field }, fieldState: { error } }) => (
            <FormGroup error={!!error}>
              <Label htmlFor={field.name} className="text-normal" required>
                {t('issueLCID.scopeLabel')}
              </Label>
              <HelpText className="margin-top-1">
                {t('issueLCID.scopeHelpText')}
              </HelpText>
              {!!error && <FieldErrorMsg>{t('Error')}</FieldErrorMsg>}
              <TextAreaField
                {...field}
                id={field.name}
                size="sm"
                characterCounter={false}
              />
            </FormGroup>
          )}
        />

        <Controller
          name="nextSteps"
          control={control}
          render={({ field: { ref, ...field }, fieldState: { error } }) => (
            <FormGroup error={!!error}>
              <Label htmlFor={field.name} className="text-normal" required>
                {t('issueLCID.nextStepsLabel')}
              </Label>
              <HelpText className="margin-top-1">
                {t('issueLCID.nextStepsHelpText')}
              </HelpText>
              {!!error && <FieldErrorMsg>{t('Error')}</FieldErrorMsg>}
              <TextAreaField
                {...field}
                id={field.name}
                size="sm"
                characterCounter={false}
              />
            </FormGroup>
          )}
        />

        <Controller
          name="trbFollowUp"
          control={control}
          render={({ field: { ref, ...field }, fieldState: { error } }) => (
            <FormGroup error={!!error}>
              <Label htmlFor={field.name} className="text-normal" required>
                {t('issueLCID.trbFollowup.label')}
              </Label>
              {!!error && <FieldErrorMsg>{t('Error')}</FieldErrorMsg>}
              <RadioField
                {...field}
                id="stronglyRecommended"
                value={SystemIntakeTRBFollowUp.STRONGLY_RECOMMENDED}
                checked={
                  field.value === SystemIntakeTRBFollowUp.STRONGLY_RECOMMENDED
                }
                label={t('issueLCID.trbFollowup.stronglyRecommended')}
              />
              <RadioField
                {...field}
                id="recommendedNotCritical"
                value={SystemIntakeTRBFollowUp.RECOMMENDED_BUT_NOT_CRITICAL}
                checked={
                  field.value ===
                  SystemIntakeTRBFollowUp.RECOMMENDED_BUT_NOT_CRITICAL
                }
                label={t('issueLCID.trbFollowup.recommendedNotCritical')}
              />
              <RadioField
                {...field}
                id="notRecommended"
                value={SystemIntakeTRBFollowUp.NOT_RECOMMENDED}
                checked={
                  field.value === SystemIntakeTRBFollowUp.NOT_RECOMMENDED
                }
                label={t('issueLCID.trbFollowup.notRecommended')}
              />
            </FormGroup>
          )}
        />

        <Controller
          name="costBaseline"
          control={control}
          render={({ field: { ref, ...field }, fieldState: { error } }) => (
            <FormGroup error={!!error}>
              <Label htmlFor={field.name} className="text-normal">
                {t('issueLCID.costBaselineLabel')}
              </Label>
              <HelpText className="margin-top-1">
                {t('issueLCID.costBaselineHelpText')}
              </HelpText>
              {!!error && <FieldErrorMsg>{t('Error')}</FieldErrorMsg>}
              <TextAreaField
                {...field}
                value={field.value || ''}
                id={field.name}
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

export default IssueLcid;
