import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import ActionForm, { SystemIntakeActionFields } from '../components/ActionForm';

interface ReopenRequestFields extends SystemIntakeActionFields {}

const ReopenRequest = ({ systemIntakeId }: { systemIntakeId: string }) => {
  const form = useForm<ReopenRequestFields>();

  /**
   * Submit handler containing mutation logic
   *
   * Error and success handling is done in `<ActionForm>`
   */
  const onSubmit = async (formData: ReopenRequestFields) => {
    // Execute mutation here
    // mutate(formData);
  };

  return (
    <FormProvider<ReopenRequestFields> {...form}>
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

export default ReopenRequest;
