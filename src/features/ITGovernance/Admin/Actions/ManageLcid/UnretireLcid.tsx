import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import {
  SystemIntakeUnretireLCIDInput,
  useCreateSystemIntakeActionUnretireLCIDMutation
} from 'gql/generated/graphql';

import Alert from 'components/Alert';
import { NonNullableProps } from 'types/util';

import ActionForm, { SystemIntakeActionFields } from '../components/ActionForm';

import LcidTitleBox from './LcidTitleBox';
import { ManageLcidProps } from '.';

type UnretireLcidFields = NonNullableProps<
  Omit<SystemIntakeUnretireLCIDInput, 'systemIntakeID'> &
    SystemIntakeActionFields
>;

interface UnretireLcidProps extends ManageLcidProps {
  lcid: string | null;
  lcidRetiresAt: string | null;
}

const UnretireLcid = ({
  systemIntakeId,
  lcid,
  lcidRetiresAt
}: UnretireLcidProps) => {
  const { t } = useTranslation('action');
  const form = useForm<UnretireLcidFields>({
    defaultValues: {}
  });

  const [unretireLcid] = useCreateSystemIntakeActionUnretireLCIDMutation({
    refetchQueries: ['GetSystemIntake']
  });

  /**
   * Unretire LCID on form submit
   *
   * Error and success handling is done in `<ActionForm>`
   */
  const onSubmit = async (formData: UnretireLcidFields) => {
    unretireLcid({
      variables: {
        input: {
          systemIntakeID: systemIntakeId,
          ...formData
        }
      }
    });
  };

  return (
    <FormProvider<UnretireLcidFields> {...form}>
      <ActionForm
        systemIntakeId={systemIntakeId}
        successMessage={t('unretireLcid.success', { lcid })}
        onSubmit={onSubmit}
        title={
          <LcidTitleBox
            systemIntakeId={systemIntakeId}
            title={t('manageLcid.unretire', {
              context: lcidRetiresAt && 'RETIRED'
            })}
          />
        }
        notificationAlertWarn
      >
        <>
          <Alert type="info">{t('unretireLcid.warningAlert')}</Alert>
        </>
      </ActionForm>
    </FormProvider>
  );
};

export default UnretireLcid;
