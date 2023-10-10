import React from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useMutation } from '@apollo/client';
import { yupResolver } from '@hookform/resolvers/yup';
import { FormGroup } from '@trussworks/react-uswds';
import { DateTime } from 'luxon';

import Alert from 'components/shared/Alert';
import DatePickerFormatted from 'components/shared/DatePickerFormatted';
import FieldErrorMsg from 'components/shared/FieldErrorMsg';
import HelpText from 'components/shared/HelpText';
import Label from 'components/shared/Label';
import TextAreaField from 'components/shared/TextAreaField';
import CreateSystemIntakeActionChangeLcidRetirementDateQuery from 'queries/CreateSystemIntakeActionChangeLcidRetirementDateQuery';
import CreateSystemIntakeActionRetireLcidQuery from 'queries/CreateSystemIntakeActionRetireLcidQuery';
import {
  CreateSystemIntakeActionChangeLcidRetirementDate,
  CreateSystemIntakeActionChangeLcidRetirementDateVariables
} from 'queries/types/CreateSystemIntakeActionChangeLcidRetirementDate';
import {
  CreateSystemIntakeActionRetireLcid,
  CreateSystemIntakeActionRetireLcidVariables
} from 'queries/types/CreateSystemIntakeActionRetireLcid';
import { SystemIntakeRetireLCIDInput } from 'types/graphql-global-types';
import { NonNullableProps } from 'types/util';
import { retireLcidSchema } from 'validations/actionSchema';

import ActionForm, { SystemIntakeActionFields } from '../components/ActionForm';

import LcidTitleBox from './LcidTitleBox';
import { ManageLcidProps } from '.';

type RetireLcidFields = NonNullableProps<
  Omit<SystemIntakeRetireLCIDInput, 'systemIntakeID'> & SystemIntakeActionFields
>;

export const retireDateInPast = (lcidRetiresAt: string | null): boolean => {
  if (!lcidRetiresAt || lcidRetiresAt.length === 0) return false;

  const startOfDay = DateTime.local().startOf('day').toISO();
  return startOfDay > lcidRetiresAt;
};

interface RetireLcidProps extends ManageLcidProps {
  lcid: string | null;
  lcidRetiresAt: string | null;
}

const RetireLcid = ({
  systemIntakeId,
  lcidStatus,
  lcid,
  lcidRetiresAt
}: RetireLcidProps) => {
  const { t } = useTranslation('action');
  const form = useForm<RetireLcidFields>({
    resolver: yupResolver(retireLcidSchema),
    defaultValues: {
      retiresAt: lcidRetiresAt || ''
    }
  });

  const { control } = form;

  const [retireLcid] = useMutation<
    CreateSystemIntakeActionRetireLcid,
    CreateSystemIntakeActionRetireLcidVariables
  >(CreateSystemIntakeActionRetireLcidQuery, {
    refetchQueries: ['GetSystemIntake']
  });

  const [updateRetireDate] = useMutation<
    CreateSystemIntakeActionChangeLcidRetirementDate,
    CreateSystemIntakeActionChangeLcidRetirementDateVariables
  >(CreateSystemIntakeActionChangeLcidRetirementDateQuery, {
    refetchQueries: ['GetSystemIntake']
  });

  /**
   * Retire LCID on form submit
   *
   * Error and success handling is done in `<ActionForm>`
   */
  const onSubmit = async (formData: RetireLcidFields) => {
    /** Returns mutation based on whether retirement date is set */
    const mutate = lcidRetiresAt ? updateRetireDate : retireLcid;

    mutate({
      variables: {
        input: {
          systemIntakeID: systemIntakeId,
          ...formData
        }
      }
    });
  };

  return (
    <FormProvider<RetireLcidFields> {...form}>
      <ActionForm
        systemIntakeId={systemIntakeId}
        successMessage={t('retireLcid.success', { lcid })}
        onSubmit={onSubmit}
        title={
          <LcidTitleBox
            systemIntakeId={systemIntakeId}
            title={t('manageLcid.retire', {
              context: lcidRetiresAt && 'RETIRED'
            })}
          />
        }
      >
        <Controller
          name="retiresAt"
          control={control}
          render={({ field: { ref, ...field }, fieldState: { error } }) => (
            <FormGroup error={!!error}>
              <Label htmlFor={field.name} className="text-normal" required>
                {t('retireLcid.retirementDate')}
              </Label>
              <HelpText className="margin-top-1">
                {t('retireLcid.retirementDateHelpText')}
              </HelpText>
              <HelpText className="margin-top-1">
                {t('retireLcid.format')}
              </HelpText>
              {!!error?.message && (
                <FieldErrorMsg>{t(error.message)}</FieldErrorMsg>
              )}
              <DatePickerFormatted {...field} id={field.name} />

              {
                // If past date is selected, show alert
                retireDateInPast(field.value) && (
                  <Alert type="warning" slim>
                    {t('retireLcid.pastDateAlert')}
                  </Alert>
                )
              }
            </FormGroup>
          )}
        />

        {
          // Hide reason if changing retirement date
          !lcidRetiresAt && (
            <Controller
              name="reason"
              control={control}
              render={({ field: { ref, ...field } }) => (
                <FormGroup>
                  <Label htmlFor={field.name} className="text-normal">
                    {t('retireLcid.reason')}
                  </Label>
                  <HelpText className="margin-top-1">
                    {t('retireLcid.reasonHelpText')}
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
          )
        }
      </ActionForm>
    </FormProvider>
  );
};

export default RetireLcid;
