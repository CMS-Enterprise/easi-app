import React from 'react';

import Pager from './Pager';
import { FormStepComponentProps } from '.';

function SubjectAreas({ request, stepUrl }: FormStepComponentProps) {
  return <Pager back={{ url: stepUrl.back }} next={{ url: stepUrl.next }} />;
}

export default SubjectAreas;
