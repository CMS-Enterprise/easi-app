import React from 'react';
import { mount } from 'enzyme';

import { ErrorAlert, ErrorAlertMessage } from './index';

describe('The ErrorAlert component', () => {
  const component = mount(
    <ErrorAlert heading="test heading">
      <ErrorAlertMessage message="Message 1" errorKey="Error 1" />
      <ErrorAlertMessage message="Message 2" errorKey="Error 2" />
      <ErrorAlertMessage message="Message 3" errorKey="Error 3" />
      <ErrorAlertMessage message="Message 4" errorKey="Error 4" />
      <ErrorAlertMessage message="Message 5" errorKey="Error 5" />
    </ErrorAlert>
  );

  it('renders a heading', () => {
    expect(component.find('.usa-alert__heading').exists()).toBe(true);
  });

  it('renders children', () => {
    expect(component.find(ErrorAlertMessage).length).toEqual(5);
  });
});
