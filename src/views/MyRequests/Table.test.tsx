import React from 'react';
import { act } from 'react-dom/test-utils';
import { MemoryRouter } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { mount, ReactWrapper } from 'enzyme';

import GetRequestsQuery from 'queries/GetRequestsQuery';

import Table from './Table';

describe('My Requests Table', () => {
  describe('when there are no requests', () => {
    it('displays an empty message', async () => {
      const mocks = [
        {
          request: {
            query: GetRequestsQuery,
            variables: { first: 20 }
          },
          result: {}
        }
      ];

      let component: ReactWrapper;
      await act(async () => {
        component = mount(
          <MockedProvider mocks={mocks}>
            <Table />
          </MockedProvider>
        );
        await new Promise(resolve => setTimeout(resolve, 0));
        component.update();
      });

      expect(component.find('p').exists()).toBeTruthy();
      expect(component.find('table').exists()).toBeFalsy();
    });
  });

  describe('when there are requests', () => {
    const mocks = [
      {
        request: {
          query: GetRequestsQuery,
          variables: { first: 20 }
        },
        result: {
          data: {
            requests: {
              edges: [
                {
                  node: {
                    id: '123',
                    name: '508 Test 1',
                    submittedAt: '2021-05-25T19:22:40Z',
                    type: 'ACCESSIBILITY_REQUEST',
                    status: 'OPEN',
                    statusCreatedAt: '2021-05-25T19:22:40Z',
                    lcid: null,
                    nextMeetingDate: null
                  }
                },
                {
                  node: {
                    id: '909',
                    name: '508 Test 2',
                    submittedAt: '2021-05-25T19:22:40Z',
                    type: 'ACCESSIBILITY_REQUEST',
                    status: 'IN_REMEDIATION',
                    statusCreatedAt: '2021-05-26T19:22:40Z',
                    lcid: null,
                    nextMeetingDate: null
                  }
                },
                {
                  node: {
                    id: '456',
                    name: 'Intake 1',
                    submittedAt: '2021-05-22T19:22:40Z',
                    type: 'GOVERNANCE_REQUEST',
                    status: 'INTAKE_DRAFT',
                    statusCreatedAt: null,
                    lcid: null,
                    nextMeetingDate: null
                  }
                },
                {
                  node: {
                    id: '789',
                    name: 'Intake 2',
                    submittedAt: '2021-05-20T19:22:40Z',
                    type: 'GOVERNANCE_REQUEST',
                    status: 'LCID_ISSUED',
                    statusCreatedAt: null,
                    lcid: 'A123456',
                    nextMeetingDate: null
                  }
                }
              ]
            }
          }
        }
      }
    ];

    const renderComponent = async () => {
      let component: ReactWrapper;
      await act(async () => {
        component = mount(
          <MemoryRouter>
            <MockedProvider mocks={mocks} addTypename={false}>
              <Table />
            </MockedProvider>
          </MemoryRouter>
        );
        await new Promise(resolve => setTimeout(resolve, 0));
        component.update();
      });
      return component;
    };

    it('displays a table', async () => {
      const component = await renderComponent();
      expect(component.find('p').exists()).toBeFalsy();
      expect(component.find('table').exists()).toBeTruthy();
    });

    it('displays headers', async () => {
      const component = await renderComponent();
      const headers = component.find('thead').find('th');
      expect(headers.length).toEqual(5);
      expect(headers.at(0).text()).toEqual('Request name');
      expect(headers.at(1).text()).toEqual('Governance');
      expect(headers.at(2).text()).toEqual('Submission date');
      expect(headers.at(3).text()).toEqual('Status');
    });

    it('displays rows of data', async () => {
      const component = await renderComponent();
      const rows = component.find('tbody').find('tr');
      expect(rows.length).toEqual(4);

      const rowOne = rows.at(0);
      expect(rowOne.find('th').find('a').html()).toEqual(
        '<a class="usa-link" href="/508/requests/123">508 Test 1</a>'
      );
      expect(rowOne.find('td').at(0).text()).toEqual('Section 508');
      expect(rowOne.find('td').at(1).text()).toEqual('May 25 2021');
      expect(rowOne.find('td').at(2).text()).toEqual('Open');

      const rowTwo = rows.at(1);
      expect(rowTwo.find('th').find('a').html()).toEqual(
        '<a class="usa-link" href="/508/requests/909">508 Test 2</a>'
      );
      expect(rowTwo.find('td').at(0).text()).toEqual('Section 508');
      expect(rowTwo.find('td').at(1).text()).toEqual('May 25 2021');
      expect(rowTwo.find('td').at(2).text()).toEqual(
        'In remediation changed on May 26 2021'
      );

      const rowThree = rows.at(3);
      expect(rowThree.find('th').find('a').html()).toEqual(
        '<a class="usa-link" href="/governance-task-list/789">Intake 2</a>'
      );
      expect(rowThree.find('td').at(0).text()).toEqual('IT Governance');
      expect(rowThree.find('td').at(1).text()).toEqual('May 20 2021');
      expect(rowThree.find('td').at(2).text()).toEqual(
        'Lifecycle ID issued: A123456'
      );
    });
  });
});
