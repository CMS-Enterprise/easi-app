import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter, Route } from 'react-router-dom';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mount, shallow } from 'enzyme';
import configureMockStore from 'redux-mock-store';

import { GetAccessibilityRequests_accessibilityRequests_edges_node as AccessibilityRequests } from 'queries/types/GetAccessibilityRequests';
import { AccessibilityRequestStatus } from 'types/graphql-global-types';

import AccessibilityRequestsTable from './index';

const requests: AccessibilityRequests[] = [
  {
    __typename: 'AccessibilityRequest',
    id: '124',
    name: 'Burrito v2',
    relevantTestDate: {
      __typename: 'TestDate',
      date: '2021-06-30T19:22:40Z'
    },
    submittedAt: '2021-06-10T19:22:40Z',
    statusRecord: {
      __typename: 'AccessibilityRequestStatusRecord',
      status: AccessibilityRequestStatus.IN_REMEDIATION,
      createdAt: '2021-06-11T19:22:40Z'
    }
  },
  {
    __typename: 'AccessibilityRequest',
    id: '123',
    name: 'Burrito v1',
    submittedAt: '2021-06-11T19:22:40Z',
    relevantTestDate: null,
    statusRecord: {
      __typename: 'AccessibilityRequestStatusRecord',
      status: AccessibilityRequestStatus.OPEN,
      createdAt: '2021-06-11T19:22:40Z'
    }
  }
];

describe('AccessibilityRequestsTable', () => {
  const wrapper = shallow(<AccessibilityRequestsTable requests={[]} />);
  it('renders without crashing', () => {
    expect(wrapper.length).toEqual(1);
  });

  it('contains all the expected columns', () => {
    expect(wrapper.find('th').at(0).contains('Project Title')).toBe(true);
    expect(wrapper.find('th').at(1).contains('Submission Date')).toBe(true);
    expect(wrapper.find('th').at(2).contains('Business Owner')).toBe(true);
    expect(wrapper.find('th').at(3).contains('Test Date')).toBe(true);
    expect(wrapper.find('th').at(4).contains('Status')).toBe(true);
  });

  it('displays relevant results from filter', async () => {
    render(
      <MemoryRouter>
        <AccessibilityRequestsTable requests={requests} />
      </MemoryRouter>
    );

    // User event to typing in query with debounce
    userEvent.type(screen.getByRole('searchbox'), 'Burrito v1');

    // Mocked time for debounce of input
    await waitFor(() => new Promise(res => setTimeout(res, 200)));

    expect(screen.getByRole('searchbox')).toHaveValue('Burrito v1');

    // Burrito v2 is a mocked table row text item that should not be included in filtered results
    expect(screen.queryByText('Burrito v2')).toBeNull();
  });

  it('contains the expected values in the rows', () => {
    const mockStore = configureMockStore();
    const store = mockStore({
      auth: {
        euaId: 'AAAA'
      }
    });

    const wrapperWithRequests = mount(
      <MemoryRouter initialEntries={['/508/requests/all']}>
        <Provider store={store}>
          <Route path="/508/requests/:accessibilityRequestId">
            <AccessibilityRequestsTable requests={requests} />
          </Route>
        </Provider>
      </MemoryRouter>
    );

    const row1 = wrapperWithRequests.find('tbody').find('tr').at(0);
    expect(row1.find('th').find('a').text()).toEqual('Burrito v1');
    expect(row1.find('td').at(0).text()).toEqual('06/11/2021');
    expect(row1.find('td').at(1).text()).toEqual('Shade, OIT');
    expect(row1.find('td').at(2).text()).toEqual('Not Added');
    expect(row1.find('td').at(3).text()).toEqual('Open');

    const row2 = wrapperWithRequests.find('tbody').find('tr').at(1);
    expect(row2.find('th').find('a').text()).toEqual('Burrito v2');
    expect(row2.find('td').at(0).text()).toEqual('06/10/2021');
    expect(row2.find('td').at(1).text()).toEqual('Shade, OIT');
    expect(row2.find('td').at(2).text()).toEqual('06/30/2021');
    expect(row2.find('td').at(3).text()).toEqual(
      'In remediation changed on 06/11/2021'
    );
  });
});
