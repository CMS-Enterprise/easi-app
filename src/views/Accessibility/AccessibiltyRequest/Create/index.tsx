/* eslint-disable react/prop-types */
import React from 'react';
import assert from 'assert';
import CreateAccessibilityRequestQuery from 'queries/CreateAccessibilityRequestQuery';
import * as yup from 'yup';

import { MutationField, MutationForm } from 'components/MutationForm';
import { CreateAccessibilityRequestInput } from 'types/graphql-global-types';

const CreateAccessibilityRequestFormSchema = yup.object({
  name: yup
    .string()
    .trim()
    .required('Enter a name for this request')
    .default('')
});

const Create = () => {
  // Move this into the MutationForm?
  const req: CreateAccessibilityRequestInput = CreateAccessibilityRequestFormSchema.getDefaultFromShape();
  assert(req);

  return (
    <div className="margin-left-3">
      <MutationForm
        mutation={CreateAccessibilityRequestQuery}
        schema={CreateAccessibilityRequestFormSchema}
      >
        <MutationField name="name" label="Name" />
      </MutationForm>
    </div>
  );
};

export default Create;
