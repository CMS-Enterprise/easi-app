import React from 'react';
import { mount } from 'enzyme';

import { ErrorAlert, ErrorAlertMessage } from './index';

describe('The ErrorAlert component', () => {
  const mockOnClick = jest.fn();
  const component = mount(
    <ErrorAlert heading="test heading">
      <ErrorAlertMessage message="Message 1" onClick={mockOnClick} />
      <ErrorAlertMessage message="Message 2" onClick={mockOnClick} />
      <ErrorAlertMessage message="Message 3" onClick={mockOnClick} />
      <ErrorAlertMessage message="Message 4" onClick={mockOnClick} />
      <ErrorAlertMessage message="Message 5" onClick={mockOnClick} />
    </ErrorAlert>
  );

  it('renders a heading', () => {
    expect(component.find('.usa-alert__heading').exists()).toBe(true);
  });

  it('renders children', () => {
    expect(component.find(ErrorAlertMessage).length).toEqual(5);
  });
});
