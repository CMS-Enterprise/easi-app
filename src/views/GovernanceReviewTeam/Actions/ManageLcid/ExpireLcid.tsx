import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import ActionForm, { SystemIntakeActionFields } from '../ActionForm';

interface ExpireLcidFields extends SystemIntakeActionFields {}

const ExpireLcid = ({ systemIntakeId }: { systemIntakeId: string }) => {
  const form = useForm<ExpireLcidFields>();

  /**
   * Submit handler containing mutation logic
   *
   * Error and success handling is done in `<ActionForm>`
   */
  const onSubmit = async (formData: ExpireLcidFields) => {
    // Execute mutation here
    // mutate(formData);
  };

  return (
    <FormProvider<ExpireLcidFields> {...form}>
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

export default ExpireLcid;
