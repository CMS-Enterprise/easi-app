import React from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useMutation } from '@apollo/client';
import { FormGroup } from '@trussworks/react-uswds';

import DatePickerFormatted from 'components/shared/DatePickerFormatted';
import Divider from 'components/shared/Divider';
import FieldErrorMsg from 'components/shared/FieldErrorMsg';
import HelpText from 'components/shared/HelpText';
import Label from 'components/shared/Label';
import TextAreaField from 'components/shared/TextAreaField';
import CreateSystemIntakeActionUpdateLcidQuery from 'queries/CreateSystemIntakeActionUpdateLcidQuery';
import {
  CreateSystemIntakeActionUpdateLcid,
  CreateSystemIntakeActionUpdateLcidVariables
} from 'queries/types/CreateSystemIntakeActionUpdateLcid';
import { SystemIntakeUpdateLCIDInput } from 'types/graphql-global-types';
import { NonNullableProps } from 'types/util';

import ActionForm, { SystemIntakeActionFields } from '../components/ActionForm';

import LcidTitleBox from './LcidTitleBox';
import { ManageLcidProps } from '.';

type UpdateLcidFields = NonNullableProps<
  Omit<SystemIntakeUpdateLCIDInput, 'systemIntakeID'> & SystemIntakeActionFields
>;

interface UpdateLcidProps extends ManageLcidProps {
  lcid?: string | null;
  lcidExpiresAt?: string | null;
  lcidScope?: string | null;
  decisionNextSteps?: string | null;
  lcidCostBaseline?: string | null;
}

const UpdateLcid = ({
  systemIntakeId,
  lcidStatus,
  lcid,
  ...defaultValues
}: UpdateLcidProps) => {
  const { t } = useTranslation('action');
  const form = useForm<UpdateLcidFields>();

  const [updateLcid] = useMutation<
    CreateSystemIntakeActionUpdateLcid,
    CreateSystemIntakeActionUpdateLcidVariables
  >(CreateSystemIntakeActionUpdateLcidQuery, {
    refetchQueries: ['GetSystemIntake']
  });

  const { control } = form;

  /**
   * Submit handler containing mutation logic
   *
   * Error and success handling is done in `<ActionForm>`
   */
  const onSubmit = async (formData: UpdateLcidFields) => {
    updateLcid({
      variables: {
        input: {
          systemIntakeID: systemIntakeId,
          ...formData
        }
      }
    });
  };

  return (
    <FormProvider<UpdateLcidFields> {...form}>
      <ActionForm
        systemIntakeId={systemIntakeId}
        successMessage={t('updateLcid.success', { lcid })}
        onSubmit={onSubmit}
        requiredFields={false}
        title={
          <LcidTitleBox
            systemIntakeId={systemIntakeId}
            title={t('manageLcid.update', { context: lcidStatus })}
          />
        }
      >
        <h3 className="margin-bottom-1">{t('updateLcid.title')}</h3>
        <HelpText className="line-height-body-5">
          {t('updateLcid.helpText')}
        </HelpText>

        <Controller
          name="expiresAt"
          control={control}
          render={({ field: { ref, ...field }, fieldState: { error } }) => (
            <FormGroup error={!!error}>
              <Label htmlFor={field.name} className="text-normal">
                {t('issueLCID.expirationDate.label')}
              </Label>
              <HelpText className="margin-top-1">{t('mm/dd/yyyy')}</HelpText>
              {!!error?.message && (
                <FieldErrorMsg>{t(error.message)}</FieldErrorMsg>
              )}
              <DatePickerFormatted
                {...field}
                id={field.name}
                defaultValue={field.value}
              />
            </FormGroup>
          )}
        />

        <Controller
          name="scope"
          control={control}
          render={({ field: { ref, ...field }, fieldState: { error } }) => (
            <FormGroup error={!!error}>
              <Label htmlFor={field.name} className="text-normal">
                {t('issueLCID.scopeLabel')}
              </Label>
              <HelpText className="margin-top-1">
                {t('updateLcid.scopeHelpText')}
              </HelpText>
              {!!error?.message && (
                <FieldErrorMsg>{t(error.message)}</FieldErrorMsg>
              )}
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
          name="nextSteps"
          control={control}
          render={({ field: { ref, ...field }, fieldState: { error } }) => (
            <FormGroup error={!!error}>
              <Label htmlFor={field.name} className="text-normal">
                {t('issueLCID.nextStepsLabel')}
              </Label>
              <HelpText className="margin-top-1">
                {t('issueLCID.nextStepsHelpText')}
              </HelpText>
              {!!error?.message && (
                <FieldErrorMsg>{t(error.message)}</FieldErrorMsg>
              )}
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

        <Divider className="margin-top-3" />

        <Controller
          name="reason"
          control={control}
          render={({ field: { ref, ...field }, fieldState: { error } }) => (
            <FormGroup error={!!error}>
              <Label htmlFor={field.name} className="text-normal">
                {t('updateLcid.reasonLabel')}
              </Label>
              <HelpText className="margin-top-1">
                {t('updateLcid.reasonHelpText')}
              </HelpText>
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

export default UpdateLcid;
