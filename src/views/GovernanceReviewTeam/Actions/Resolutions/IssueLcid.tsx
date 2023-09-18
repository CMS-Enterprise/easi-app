import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import ActionForm, { SystemIntakeActionFields } from '../components/ActionForm';

interface IssueLcidFields extends SystemIntakeActionFields {}

const IssueLcid = ({ systemIntakeId }: { systemIntakeId: string }) => {
  const form = useForm<IssueLcidFields>();

  /**
   * Submit handler containing mutation logic
   *
   * Error and success handling is done in `<ActionForm>`
   */
  const onSubmit = async (formData: IssueLcidFields) => {
    // Execute mutation here
    // mutate(formData);
  };

  return (
    <FormProvider<IssueLcidFields> {...form}>
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

export default IssueLcid;
