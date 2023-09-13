import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import ActionForm, { SystemIntakeActionFields } from '../ActionForm';

interface RetireLcidFields extends SystemIntakeActionFields {}

const RetireLcid = ({ systemIntakeId }: { systemIntakeId: string }) => {
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
      >
        {/* Action fields here */}
      </ActionForm>
    </FormProvider>
  );
};

export default RetireLcid;
