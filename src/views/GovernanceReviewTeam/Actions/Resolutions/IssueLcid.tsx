import React from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useMutation } from '@apollo/client';
import { FormGroup, Radio, TextInput } from '@trussworks/react-uswds';

import DatePickerFormatted from 'components/shared/DatePickerFormatted';
import FieldErrorMsg from 'components/shared/FieldErrorMsg';
import HelpText from 'components/shared/HelpText';
import Label from 'components/shared/Label';
import TextAreaField from 'components/shared/TextAreaField';
import CreateSystemIntakeActionIssueLcidQuery from 'queries/CreateSystemIntakeActionIssueLcidQuery';
import {
  CreateSystemIntakeActionIssueLcid,
  CreateSystemIntakeActionIssueLcidVariables
} from 'queries/types/CreateSystemIntakeActionIssueLcid';
import {
  SystemIntakeIssueLCIDInput,
  SystemIntakeTRBFollowUp
} from 'types/graphql-global-types';
import { NonNullableProps } from 'types/util';

import ActionForm, { SystemIntakeActionFields } from '../components/ActionForm';

type IssueLcidFields = NonNullableProps<
  Omit<SystemIntakeIssueLCIDInput, 'systemIntakeID'> & SystemIntakeActionFields
> & {
  useExistingLcid: boolean;
};

const IssueLcid = ({ systemIntakeId }: { systemIntakeId: string }) => {
  const { t } = useTranslation('action');

  const form = useForm<IssueLcidFields>({
    defaultValues: {
      costBaseline: ''
    }
  });

  const [mutate] = useMutation<
    CreateSystemIntakeActionIssueLcid,
    CreateSystemIntakeActionIssueLcidVariables
  >(CreateSystemIntakeActionIssueLcidQuery);

  const { control, setValue } = form;

  /**
   * Submit handler containing mutation logic
   *
   * Error and success handling is done in `<ActionForm>`
   */
  const onSubmit = async ({
    useExistingLcid,
    ...formData
  }: IssueLcidFields) => {
    mutate({
      variables: {
        input: {
          systemIntakeID: systemIntakeId,
          ...formData,
          lcid: useExistingLcid ? formData.lcid : ''
        }
      }
    });
  };

  return (
    <FormProvider<IssueLcidFields> {...form}>
      <ActionForm
        systemIntakeId={systemIntakeId}
        successMessage=""
        onSubmit={onSubmit}
      >
        <Controller
          name="useExistingLcid"
          control={control}
          render={({
            field: { ref, value: useExistingLcid, ...field },
            fieldState: { error }
          }) => {
            return (
              <FormGroup error={!!error}>
                <Label htmlFor={field.name} className="text-normal" required>
                  {t('issueLCID.lcid.label')}
                </Label>
                <HelpText className="margin-top-1">
                  {t('issueLCID.lcid.helpText')}
                </HelpText>
                {!!error && <FieldErrorMsg>{t('Error')}</FieldErrorMsg>}
                <Radio
                  {...field}
                  value="false"
                  id="useExistingLcid_false"
                  label={t('issueLCID.lcid.new')}
                  onChange={() => setValue('useExistingLcid', false)}
                />
                <Radio
                  {...field}
                  value="true"
                  id="useExistingLcid_true"
                  label={t('issueLCID.lcid.existing')}
                  onChange={() => setValue('useExistingLcid', true)}
                />
                {useExistingLcid && (
                  <Controller
                    name="lcid"
                    control={control}
                    render={({ field: lcidField }) => (
                      <TextInput
                        {...lcidField}
                        ref={null}
                        id={field.name}
                        type="text"
                        className="margin-left-4"
                      />
                    )}
                  />
                )}
              </FormGroup>
            );
          }}
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
              <Radio
                {...field}
                id="stronglyRecommended"
                value={SystemIntakeTRBFollowUp.STRONGLY_RECOMMENDED}
                label={t('issueLCID.trbFollowup.stronglyRecommended')}
              />
              <Radio
                {...field}
                id="recommendedNotCritical"
                value={SystemIntakeTRBFollowUp.RECOMMENDED_BUT_NOT_CRITICAL}
                label={t('issueLCID.trbFollowup.recommendedNotCritical')}
              />
              <Radio
                {...field}
                id="notRecommended"
                value={SystemIntakeTRBFollowUp.NOT_RECOMMENDED}
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
