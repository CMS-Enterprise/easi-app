import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import ActionForm, { SystemIntakeActionFields } from '../components/ActionForm';

interface CloseRequestFields extends SystemIntakeActionFields {}

const CloseRequest = ({ systemIntakeId }: { systemIntakeId: string }) => {
  const form = useForm<CloseRequestFields>();

  /**
   * Submit handler containing mutation logic
   *
   * Error and success handling is done in `<ActionForm>`
   */
  const onSubmit = async (formData: CloseRequestFields) => {
    // Execute mutation here
    // mutate(formData);
  };

  return (
    <FormProvider<CloseRequestFields> {...form}>
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

export default CloseRequest;
