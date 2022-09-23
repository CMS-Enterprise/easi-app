import React from 'react';

import Pager from './Pager';
import { FormStepComponentProps } from '.';

function Check({ request, step }: FormStepComponentProps) {
  return (
    <Pager
      back={{ url: `/trb/requests/${request.id}/${step - 1}` }}
      next={{
        url: `/trb/requests/${request.id}/done`,
        text: 'Submit request'
      }}
    />
  );
}

export default Check;
