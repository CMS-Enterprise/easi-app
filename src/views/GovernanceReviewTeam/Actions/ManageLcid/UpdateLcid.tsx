import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import ActionForm, { SystemIntakeActionFields } from '../components/ActionForm';

interface UpdateLcidFields extends SystemIntakeActionFields {}

const UpdateLcid = ({ systemIntakeId }: { systemIntakeId: string }) => {
  const form = useForm<UpdateLcidFields>();

  /**
   * Submit handler containing mutation logic
   *
   * Error and success handling is done in `<ActionForm>`
   */
  const onSubmit = async (formData: UpdateLcidFields) => {
    // Execute mutation here
    // mutate(formData);
  };

  return (
    <FormProvider<UpdateLcidFields> {...form}>
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

export default UpdateLcid;
