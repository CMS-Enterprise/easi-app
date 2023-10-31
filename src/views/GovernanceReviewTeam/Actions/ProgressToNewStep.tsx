import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useMutation } from '@apollo/client';

import CreateSystemIntakeActionProgressToNewStepQuery from 'queries/CreateSystemIntakeActionProgressToNewStepQuery';
import {
  CreateSystemIntakeActionProgressToNewStep,
  CreateSystemIntakeActionProgressToNewStepVariables
} from 'queries/types/CreateSystemIntakeActionProgressToNewStep';
import { SystemIntakeProgressToNewStepsInput } from 'types/graphql-global-types';
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
      >
        {/* Action fields here */}
      </ActionForm>
    </FormProvider>
  );
};

export default ProgressToNewStep;
