import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import ActionForm, { SystemIntakeActionFields } from '../components/ActionForm';

interface NotApprovedFields extends SystemIntakeActionFields {}

const NotApproved = ({ systemIntakeId }: { systemIntakeId: string }) => {
  const form = useForm<NotApprovedFields>();

  /**
   * Submit handler containing mutation logic
   *
   * Error and success handling is done in `<ActionForm>`
   */
  const onSubmit = async (formData: NotApprovedFields) => {
    // Execute mutation here
    // mutate(formData);
  };

  return (
    <FormProvider<NotApprovedFields> {...form}>
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

export default NotApproved;
