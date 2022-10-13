import React from 'react';
import { useHistory } from 'react-router-dom';

import Pager from './Pager';
import { FormStepComponentProps } from '.';

function SubjectAreas({ request, stepUrl }: FormStepComponentProps) {
  const history = useHistory();
  return (
    <Pager
      back={{
        onClick: () => {
          history.push(stepUrl.back);
        }
      }}
      next={{
        onClick: () => {
          history.push(stepUrl.next);
        }
      }}
    />
  );
}

export default SubjectAreas;
