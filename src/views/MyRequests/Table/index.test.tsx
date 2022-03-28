import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import GetRequestsQuery from 'queries/GetRequestsQuery';
import { RequestType } from 'types/graphql-global-types';

import Table from '.';

describe('My Requests Table', () => {
  describe('when there are no requests', () => {
    it('displays an empty message', async () => {
      const mocks = [
        {
          request: {
            query: GetRequestsQuery,
            variables: { first: 20 }
          },
          result: {
            data: {
              requests: {
                edges: []
              }
            }
          }
        }
      ];

      render(
        <MemoryRouter>
          <MockedProvider mocks={mocks} addTypename={false}>
            <Table />
          </MockedProvider>
        </MemoryRouter>
      );

      expect(
        await screen.findByText(
          'Requests will display in a table once you add them'
        )
      ).toBeInTheDocument();
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

    it('displays a table', async () => {
      render(
        <MemoryRouter>
          <MockedProvider mocks={mocks} addTypename={false}>
            <Table />
          </MockedProvider>
        </MemoryRouter>
      );

      expect(await screen.findByRole('table')).toBeInTheDocument();
    });

    it('displays an IT Goverance request only table with hidden columns', async () => {
      render(
        <MemoryRouter>
          <MockedProvider mocks={mocks} addTypename={false}>
            <Table
              type={RequestType.GOVERNANCE_REQUEST}
              hiddenColumns={['Governance', 'Upcoming meeting date']}
            />
          </MockedProvider>
        </MemoryRouter>
      );

      expect(
        await screen.queryByText('Upcoming meeting date')
      ).not.toBeInTheDocument();
    });

    it('displays a 508 request only table with hidden columns', async () => {
      render(
        <MemoryRouter>
          <MockedProvider mocks={mocks} addTypename={false}>
            <Table
              type={RequestType.ACCESSIBILITY_REQUEST}
              hiddenColumns={['Governance', 'Upcoming meeting date']}
            />
          </MockedProvider>
        </MemoryRouter>
      );

      expect(await screen.queryByText('Governance')).not.toBeInTheDocument();
    });

    it('displays relevant results from filter', async () => {
      render(
        <MemoryRouter>
          <MockedProvider mocks={mocks} addTypename={false}>
            <Table />
          </MockedProvider>
        </MemoryRouter>
      );

      // User event to typing in query with debounce
      await waitFor(() => {
        userEvent.type(screen.getByRole('searchbox'), '508 Test 1');
      });

      // Mocked time for debounce of input
      await waitFor(() => new Promise(res => setTimeout(res, 200)));

      // Intake 1 is a mocked table row text item that should not be included in filtered results
      expect(await screen.queryByText('Intake 1')).toBeNull();
    });

    it('matches snapshot', async () => {
      const { asFragment } = render(
        <MemoryRouter>
          <MockedProvider mocks={mocks} addTypename={false}>
            <Table />
          </MockedProvider>
        </MemoryRouter>
      );
      expect(await screen.findByRole('table')).toBeInTheDocument();
      expect(asFragment()).toMatchSnapshot();
    });
  });
});
