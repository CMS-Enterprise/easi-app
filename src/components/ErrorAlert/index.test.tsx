import React from 'react';
import { render } from '@testing-library/react';

import { ErrorAlert, ErrorAlertMessage } from './index';

describe('The ErrorAlert component', () => {
  it('matches snapshot', () => {
    const { asFragment } = render(
      <ErrorAlert heading="test heading">
        <ErrorAlertMessage message="Message 1" errorKey="Error 1" />
        <ErrorAlertMessage message="Message 2" errorKey="Error 2" />
        <ErrorAlertMessage message="Message 3" errorKey="Error 3" />
        <ErrorAlertMessage message="Message 4" errorKey="Error 4" />
        <ErrorAlertMessage message="Message 5" errorKey="Error 5" />
      </ErrorAlert>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
