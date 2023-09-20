import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import ActionForm, { SystemIntakeActionFields } from '../components/ActionForm';

import LcidTitleBox from './LcidTitleBox';
import { ManageLcidProps } from '.';

interface RetireLcidFields extends SystemIntakeActionFields {}

const RetireLcid = ({ systemIntakeId, lcidStatus }: ManageLcidProps) => {
  const { t } = useTranslation('action');
  const form = useForm<RetireLcidFields>();

  /**
   * Submit handler containing mutation logic
   *
   * Error and success handling is done in `<ActionForm>`
   */
  const onSubmit = async (formData: RetireLcidFields) => {
    // Execute mutation here
    // mutate(formData);
  };

  return (
    <FormProvider<RetireLcidFields> {...form}>
      <ActionForm
        systemIntakeId={systemIntakeId}
        successMessage=""
        onSubmit={onSubmit}
        title={
          <LcidTitleBox
            systemIntakeId={systemIntakeId}
            title={t('manageLcid.retire', { context: lcidStatus })}
          />
        }
      >
        {/* Action fields here */}
      </ActionForm>
    </FormProvider>
  );
};

export default RetireLcid;
