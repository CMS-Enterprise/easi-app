import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { mount, shallow } from 'enzyme';
import { DateTime } from 'luxon';

import TestDateCard from 'components/TestDateCard';

const renderComponent = (score: number | null) => {
  return mount(
    <MemoryRouter>
      <MockedProvider>
        <TestDateCard
          date={DateTime.local().toISO()}
          type="INITIAL"
          testIndex={1}
          score={score}
          requestId="Request ID"
          requestName="Initial Request"
          id="ID"
          refetchRequest={jest.fn()}
          setConfirmationText={jest.fn()}
        />
      </MockedProvider>
    </MemoryRouter>
  );
};

describe('The Test Date Card component', () => {
  it('renders without crashing', () => {
    shallow(
      <MockedProvider>
        <TestDateCard
          date={DateTime.local().toISO()}
          type="INITIAL"
          testIndex={1}
          score={0}
          requestId="Request ID"
          requestName="Initial Request"
          id="ID"
          refetchRequest={jest.fn()}
          setConfirmationText={jest.fn()}
        />
      </MockedProvider>
    );
  });

  describe('test score', () => {
    it('renders score', () => {
      const component = renderComponent(1000);
      expect(component.find('[data-testid="score"]').text()).toEqual('100.0%');
    });

    it('renders a score of 0', () => {
      const component = renderComponent(0);
      expect(component.find('[data-testid="score"]').text()).toEqual('0%');
    });

    it('renders score not added', () => {
      const component = renderComponent(null);
      expect(component.find('[data-testid="score"]').text()).toEqual(
        'Score not added'
      );
    });
  });
});
