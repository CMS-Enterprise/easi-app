import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useMutation } from '@apollo/client';

import CreateSystemIntakeActionExpireLcidQuery from 'queries/CreateSystemIntakeActionExpireLcidQuery';
import {
  CreateSystemIntakeActionExpireLcid,
  CreateSystemIntakeActionExpireLcidVariables
} from 'queries/types/CreateSystemIntakeActionExpireLcid';
import { SystemIntakeExpireLCIDInput } from 'types/graphql-global-types';
import { NonNullableProps } from 'types/util';

import ActionForm, { SystemIntakeActionFields } from '../components/ActionForm';

import LcidTitleBox from './LcidTitleBox';
import { ManageLcidProps } from '.';

type ExpireLcidFields = NonNullableProps<
  Omit<SystemIntakeExpireLCIDInput, 'systemIntakeID'> & SystemIntakeActionFields
>;

interface ExpireLcidProps extends ManageLcidProps {
  lcid: string | null;
}

const ExpireLcid = ({ systemIntakeId, lcidStatus, lcid }: ExpireLcidProps) => {
  const { t } = useTranslation('action');
  const form = useForm<ExpireLcidFields>();

  const [expireLcid] = useMutation<
    CreateSystemIntakeActionExpireLcid,
    CreateSystemIntakeActionExpireLcidVariables
  >(CreateSystemIntakeActionExpireLcidQuery, {
    refetchQueries: ['GetSystemIntake']
  });

  /**
   * Expire LCID on form submit
   *
   * Error and success handling is done in `<ActionForm>`
   */
  const onSubmit = async (formData: ExpireLcidFields) =>
    expireLcid({
      variables: {
        input: {
          systemIntakeID: systemIntakeId,
          ...formData
        }
      }
    });

  return (
    <FormProvider<ExpireLcidFields> {...form}>
      <ActionForm
        systemIntakeId={systemIntakeId}
        successMessage={t('expireLcid.success', { lcid })}
        onSubmit={onSubmit}
        title={
          <LcidTitleBox
            systemIntakeId={systemIntakeId}
            title={t('manageLcid.expire', { context: lcidStatus })}
          />
        }
      >
        {/* Action fields here */}
      </ActionForm>
    </FormProvider>
  );
};

export default ExpireLcid;
