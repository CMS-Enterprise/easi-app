import React from 'react';

import Pager from './Pager';
import { FormStepComponentProps } from '.';

function SubjectAreas({ request, step }: FormStepComponentProps) {
  return (
    <Pager
      back={{ url: `/trb/requests/${request.id}/${step - 1}` }}
      next={{ url: `/trb/requests/${request.id}/${step + 1}` }}
    />
  );
}

export default SubjectAreas;
