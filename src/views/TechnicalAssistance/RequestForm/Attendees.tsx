import React from 'react';

import Pager from './Pager';
import { FormStepComponentProps } from '.';

function Attendees({ request, step }: FormStepComponentProps) {
  return (
    <Pager
      back={{ url: `/trb/requests/${request.id}/${step - 1}` }}
      next={{
        url: `/trb/requests/${request.id}/${step + 1}`,
        text: 'Continue without adding attendees',
        style: 'outline'
      }}
    />
  );
}

export default Attendees;
