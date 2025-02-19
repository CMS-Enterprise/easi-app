import React, { useMemo } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useMutation } from '@apollo/client';
import { yupResolver } from '@hookform/resolvers/yup';
import { FormGroup } from '@trussworks/react-uswds';
import CreateSystemIntakeActionUpdateLcidQuery from 'gql/legacyGQL/CreateSystemIntakeActionUpdateLcidQuery';
import {
  CreateSystemIntakeActionUpdateLcid,
  CreateSystemIntakeActionUpdateLcidVariables
} from 'gql/legacyGQL/types/CreateSystemIntakeActionUpdateLcid';

import Alert from 'components/Alert';
import DatePickerFormatted from 'components/DatePickerFormatted';
import Divider from 'components/Divider';
import FieldErrorMsg from 'components/FieldErrorMsg';
import HelpText from 'components/HelpText';
import Label from 'components/Label';
import RichTextEditor from 'components/RichTextEditor';
import TextAreaField from 'components/TextAreaField';
import { SystemIntakeUpdateLCIDInput } from 'types/graphql-global-types';
import { NonNullableProps } from 'types/util';
import { updateLcidSchema } from 'validations/actionSchema';

import ActionForm, { SystemIntakeActionFields } from '../components/ActionForm';

import LcidSummary, { LcidSummaryProps } from './LcidSummary';
import LcidTitleBox from './LcidTitleBox';
import { actionDateInPast } from './RetireLcid';
import { ManageLcidProps } from '.';

type UpdateLcidFields = NonNullableProps<
  Omit<SystemIntakeUpdateLCIDInput, 'systemIntakeID'> & SystemIntakeActionFields
>;

type UpdateLcidProps = ManageLcidProps & LcidSummaryProps;

const UpdateLcid = ({
  systemIntakeId,
  lcidStatus,
  lcid,
  ...defaultValues
}: UpdateLcidProps) => {
  const { t } = useTranslation('action');
  const form = useForm<UpdateLcidFields>({
    resolver: yupResolver(updateLcidSchema)
  });

  const [updateLcid] = useMutation<
    CreateSystemIntakeActionUpdateLcid,
    CreateSystemIntakeActionUpdateLcidVariables
  >(CreateSystemIntakeActionUpdateLcidQuery, {
    refetchQueries: ['GetSystemIntake']
  });

  const {
    control,
    watch,
    formState: { errors }
  } = form;

  /** Array of LCID field values */
  const lcidFields = watch(['expiresAt', 'scope', 'nextSteps', 'costBaseline']);

  /** Whether or not at least one LCID field is filled out */
  const formIsValid: boolean = useMemo(() => {
    return lcidFields.filter(value => !!value).length > 0;
  }, [lcidFields]);

  /** Update LCID mutation on form submit */
  const onSubmit = async (formData: UpdateLcidFields) => {
    // Check if at least one LCID field has been filled
    if (formIsValid) {
      return updateLcid({
        variables: {
          input: {
            systemIntakeID: systemIntakeId,
            ...formData
          }
        }
      });
    }
    // Set general form error if form is invalid
    throw new Error(t('updateLcid.emptyForm'));
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
          >
            <LcidSummary
              lcid={lcid}
              lcidStatus={lcidStatus}
              lcidIssuedAt={defaultValues?.lcidIssuedAt || ''}
              lcidExpiresAt={defaultValues?.lcidExpiresAt || ''}
              lcidRetiresAt={defaultValues?.lcidRetiresAt || ''}
              lcidScope={defaultValues?.lcidScope}
              decisionNextSteps={defaultValues?.decisionNextSteps}
              lcidCostBaseline={defaultValues?.lcidCostBaseline}
              className="margin-top-3 margin-bottom-6"
            />
          </LcidTitleBox>
        }
        notificationAlertWarn
      >
        <h3 className="margin-bottom-1">{t('updateLcid.title')}</h3>
        <HelpText className="line-height-body-5">
          {t('updateLcid.helpText')}
        </HelpText>

        {
          // Alert for general form error
          errors?.root?.form?.message && (
            <Alert type="error" className="action-error margin-top-2">
              {errors.root.form.message}
            </Alert>
          )
        }

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
                // Fix for empty string throwing off field validation
                onChange={e => field.onChange(e || undefined)}
              />
              {
                // If past date is selected, show alert
                actionDateInPast(field.value || null) && (
                  <Alert type="warning" slim>
                    {t('pastDateAlert')}
                  </Alert>
                )
              }
            </FormGroup>
          )}
        />

        <Controller
          name="scope"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <FormGroup error={!!error}>
              <Label
                htmlFor={field.name}
                id={`${field.name}-label`}
                className="text-normal"
              >
                {t('issueLCID.scopeLabel')}
              </Label>
              <HelpText className="margin-top-1" id={`${field.name}-hint`}>
                {t('updateLcid.scopeHelpText')}
              </HelpText>
              {!!error?.message && (
                <FieldErrorMsg>{t(error.message)}</FieldErrorMsg>
              )}
              <RichTextEditor
                field={field}
                editableProps={{
                  id: field.name,
                  'data-testid': field.name,
                  'aria-describedby': `${field.name}-hint`,
                  'aria-labelledby': `${field.name}-label`
                }}
              />
            </FormGroup>
          )}
        />

        <Controller
          name="nextSteps"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <FormGroup error={!!error}>
              <Label
                htmlFor={field.name}
                id={`${field.name}-label`}
                className="text-normal"
              >
                {t('issueLCID.nextStepsLabel')}
              </Label>
              <HelpText className="margin-top-1" id={`${field.name}-hint`}>
                {t('issueLCID.nextStepsHelpText')}
              </HelpText>
              {!!error?.message && (
                <FieldErrorMsg>{t(error.message)}</FieldErrorMsg>
              )}
              <RichTextEditor
                field={field}
                editableProps={{
                  id: field.name,
                  'data-testid': field.name,
                  'aria-describedby': `${field.name}-hint`,
                  'aria-labelledby': `${field.name}-label`
                }}
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
              />
            </FormGroup>
          )}
        />

        <Divider className="margin-top-3" />

        <Controller
          name="reason"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <FormGroup error={!!error}>
              <Label
                htmlFor={field.name}
                id={`${field.name}-label`}
                className="text-normal"
              >
                {t('updateLcid.reasonLabel')}
              </Label>
              <HelpText className="margin-top-1">
                {t('updateLcid.reasonHelpText')}
              </HelpText>
              <RichTextEditor
                field={field}
                editableProps={{
                  id: field.name,
                  'data-testid': field.name,
                  'aria-describedby': `${field.name}-hint`,
                  'aria-labelledby': `${field.name}-label`
                }}
              />
            </FormGroup>
          )}
        />
      </ActionForm>
    </FormProvider>
  );
};

export default UpdateLcid;
