import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import ActionForm, { SystemIntakeActionFields } from '../components/ActionForm';

interface NotGovernanceFields extends SystemIntakeActionFields {}

const NotGovernance = ({ systemIntakeId }: { systemIntakeId: string }) => {
  const form = useForm<NotGovernanceFields>();

  /**
   * Submit handler containing mutation logic
   *
   * Error and success handling is done in `<ActionForm>`
   */
  const onSubmit = async (formData: NotGovernanceFields) => {
    // Execute mutation here
    // mutate(formData);
  };

  return (
    <FormProvider<NotGovernanceFields> {...form}>
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

export default NotGovernance;
