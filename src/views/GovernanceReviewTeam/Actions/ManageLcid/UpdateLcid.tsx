import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useMutation } from '@apollo/client';

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

const UpdateLcid = ({ systemIntakeId, lcidStatus }: UpdateLcidProps) => {
  const { t } = useTranslation('action');
  const form = useForm<UpdateLcidFields>();

  const [updateLcid] = useMutation<
    CreateSystemIntakeActionUpdateLcid,
    CreateSystemIntakeActionUpdateLcidVariables
  >(CreateSystemIntakeActionUpdateLcidQuery, {
    refetchQueries: ['GetSystemIntake']
  });

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
        successMessage=""
        onSubmit={onSubmit}
        title={
          <LcidTitleBox
            systemIntakeId={systemIntakeId}
            title={t('manageLcid.update', { context: lcidStatus })}
          />
        }
      >
        {/* Action fields here */}
      </ActionForm>
    </FormProvider>
  );
};

export default UpdateLcid;
