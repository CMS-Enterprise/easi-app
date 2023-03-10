import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import GetRequestsQuery from 'queries/GetRequestsQuery';
import { GetRequests as GetRequestsQueryType } from 'queries/types/GetRequests';
import { RequestType, TRBRequestStatus } from 'types/graphql-global-types';

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
              },
              trbRequests: []
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
    const mockRequestData: GetRequestsQueryType = {
      requests: {
        __typename: 'RequestsConnection',
        edges: [
          {
            __typename: 'RequestEdge',
            node: {
              __typename: 'Request',
              id: '123',
              name: '508 Test 1',
              submittedAt: '2021-05-25T19:22:40Z',
              type: RequestType.ACCESSIBILITY_REQUEST,
              status: 'OPEN',
              statusCreatedAt: '2021-05-25T19:22:40Z',
              lcid: null,
              nextMeetingDate: null
            }
          },
          {
            __typename: 'RequestEdge',
            node: {
              __typename: 'Request',
              id: '909',
              name: '508 Test 2',
              submittedAt: '2021-05-25T19:22:40Z',
              type: RequestType.ACCESSIBILITY_REQUEST,
              status: 'IN_REMEDIATION',
              statusCreatedAt: '2021-05-26T19:22:40Z',
              lcid: null,
              nextMeetingDate: null
            }
          },
          {
            __typename: 'RequestEdge',
            node: {
              __typename: 'Request',
              id: '456',
              name: 'Intake 1',
              submittedAt: '2021-05-22T19:22:40Z',
              type: RequestType.GOVERNANCE_REQUEST,
              status: 'INTAKE_DRAFT',
              statusCreatedAt: null,
              lcid: null,
              nextMeetingDate: null
            }
          },
          {
            __typename: 'RequestEdge',
            node: {
              __typename: 'Request',
              id: '789',
              name: 'Intake 2',
              submittedAt: '2021-05-20T19:22:40Z',
              type: RequestType.GOVERNANCE_REQUEST,
              status: 'LCID_ISSUED',
              statusCreatedAt: null,
              lcid: 'A123456',
              nextMeetingDate: null
            }
          }
        ]
      },
      trbRequests: [
        {
          id: '1afc9242-f244-47a3-9f91-4d6fedd8eb91',
          name: 'My excellent question',
          nextMeetingDate: null,
          status: TRBRequestStatus.OPEN,
          submittedAt: '2023-03-07T15:09:17.694681Z',
          __typename: 'TRBRequest'
        }
      ]
    };
    const mocks = [
      {
        request: {
          query: GetRequestsQuery,
          variables: { first: 20 }
        },
        result: {
          data: mockRequestData
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
      expect(await screen.findByText('Intake 2')).toBeInTheDocument();
      expect(
        await screen.findByText('My excellent question')
      ).toBeInTheDocument();
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
