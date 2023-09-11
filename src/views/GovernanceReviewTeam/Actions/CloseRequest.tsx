import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import ActionForm, { SystemIntakeActionFields } from './ActionForm';

const CloseRequest = ({ systemIntakeId }: { systemIntakeId: string }) => {
  const form = useForm<SystemIntakeActionFields>();

  const { handleSubmit } = form;

  const submit = handleSubmit(() => null);

  return (
    <FormProvider<SystemIntakeActionFields> {...form}>
      <ActionForm systemIntakeId={systemIntakeId} onSubmit={submit}>
        {/* Action fields here */}
      </ActionForm>
    </FormProvider>
  );
};

export default CloseRequest;
