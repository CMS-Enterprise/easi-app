import React from 'react';

import Pager from './Pager';
import { FormStepComponentProps } from '.';

function Documents({ request, step }: FormStepComponentProps) {
  return (
    <Pager
      back={{ url: `/trb/requests/${request.id}/${step - 1}` }}
      next={{
        url: `/trb/requests/${request.id}/${step + 1}`,
        text: 'Continue without adding documents',
        style: 'outline'
      }}
    />
  );
}

export default Documents;
