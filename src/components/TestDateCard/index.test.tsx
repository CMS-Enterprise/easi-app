import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { mount, shallow } from 'enzyme';
import { DateTime } from 'luxon';

import TestDateCard from 'components/TestDateCard';
import { GetAccessibilityRequest_accessibilityRequest_testDates as TestDateType } from 'queries/types/GetAccessibilityRequest';
import { TestDateTestType } from 'types/graphql-global-types';

const renderComponent = (customProps?: any) => {
  return mount(
    <MemoryRouter>
      <MockedProvider>
        <TestDateCard
          testDate={{
            __typename: 'TestDate',
            id: 'ID',
            date: DateTime.local().toISO(),
            testType: TestDateTestType.INITIAL,
            score: 0
          }}
          testIndex={1}
          requestId="Request ID"
          requestName="Initial Request"
          isEditableDeletable
          handleDeleteTestDate={jest.fn()}
          {...customProps}
        />
      </MockedProvider>
    </MemoryRouter>
  );
};

describe('The Test Date Card component', () => {
  const mockTestDate: TestDateType = {
    __typename: 'TestDate',
    id: 'ID',
    date: DateTime.local().toISO(),
    testType: TestDateTestType.INITIAL,
    score: 0
  };

  it('renders without crashing', () => {
    shallow(
      <MockedProvider>
        <TestDateCard
          testDate={mockTestDate}
          testIndex={1}
          requestId="Request ID"
          requestName="Initial Request"
          isEditableDeletable
          handleDeleteTestDate={jest.fn()}
        />
      </MockedProvider>
    );
  });

  describe('edit', () => {
    it('renders edit link', () => {
      const component = renderComponent();
      expect(
        component.find('[data-testid="test-date-edit-link"]').exists()
      ).toEqual(true);
    });

    it('hides edit link', () => {
      const component = renderComponent({ isEditableDeletable: false });
      expect(
        component.find('[data-testid="test-date-delete-button"]').exists()
      ).toEqual(false);
    });
  });

  describe('delete', () => {
    it('renders delete button', () => {
      const component = renderComponent();
      expect(
        component.find('[data-testid="test-date-delete-button"]').exists()
      ).toEqual(true);
    });

    it('hides delete button', () => {
      const component = renderComponent({ isEditableDeletable: false });
      expect(
        component.find('[data-testid="test-date-delete-button"]').exists()
      ).toEqual(false);
    });
  });

  describe('test score', () => {
    it('renders score', () => {
      const component = renderComponent({
        testDate: {
          ...mockTestDate,
          score: 1000
        }
      });
      expect(component.find('[data-testid="score"]').text()).toEqual('100.0%');
    });

    it('renders a score of 0', () => {
      const component = renderComponent({
        testDate: {
          ...mockTestDate,
          score: 0
        }
      });
      expect(component.find('[data-testid="score"]').text()).toEqual('0%');
    });

    it('renders score not added', () => {
      const component = renderComponent({
        testDate: {
          ...mockTestDate,
          score: null
        }
      });
      expect(component.find('[data-testid="score"]').text()).toEqual(
        'Score not added'
      );
    });
  });
});
