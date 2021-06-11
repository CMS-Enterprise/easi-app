import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter, Route } from 'react-router-dom';
import { mount, shallow } from 'enzyme';
import configureMockStore from 'redux-mock-store';

import AccessibilityRequestsTable from './index';

describe('AccessibilityRequestsTable', () => {
  const wrapper = shallow(<AccessibilityRequestsTable requests={[]} />);
  it('renders without crashing', () => {
    expect(wrapper.length).toEqual(1);
  });

  it('contains all the expected columns', () => {
    expect(wrapper.find('th').at(0).contains('Request Name')).toBe(true);
    expect(wrapper.find('th').at(1).contains('Submission Date')).toBe(true);
    expect(wrapper.find('th').at(2).contains('Business Owner')).toBe(true);
    expect(wrapper.find('th').at(3).contains('Test Date')).toBe(true);
    expect(wrapper.find('th').at(4).contains('Status')).toBe(true);
  });

  it('contains the expected values in the rows', () => {
    const mockStore = configureMockStore();
    const store = mockStore({
      auth: {
        euaId: 'AAAA'
      }
    });

    const requests = [
      {
        id: '123',
        name: 'Burrito v1',
        submittedAt: '2021-06-10T19:22:40Z',
        system: {
          lcid: '0000',
          businessOwner: { name: 'Shade', component: 'OIT' }
        },
        statusRecord: { status: 'OPEN' }
      },
      {
        id: '124',
        name: 'Burrito v2',
        relevantTestDate: '2021-06-30T19:22:40Z',
        submittedAt: '2021-06-10T19:22:40Z',
        system: {
          lcid: '0000',
          businessOwner: { name: 'Shade', component: 'OIT' }
        },
        statusRecord: { status: 'IN_REMEDIATION' }
      }
    ];
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
    expect(row1.find('td').at(0).text()).toEqual('June 10 2021');
    expect(row1.find('td').at(1).text()).toEqual('Shade, OIT');
    expect(row1.find('td').at(2).text()).toEqual('Not Added');
    expect(row1.find('td').at(3).text()).toEqual('Open');

    const row2 = wrapperWithRequests.find('tbody').find('tr').at(1);
    expect(row2.find('th').find('a').text()).toEqual('Burrito v2');
    expect(row2.find('td').at(0).text()).toEqual('June 10 2021');
    expect(row2.find('td').at(1).text()).toEqual('Shade, OIT');
    expect(row2.find('td').at(2).text()).toEqual('June 30 2021');
    expect(row2.find('td').at(3).text()).toEqual('In remediation');
  });
});
