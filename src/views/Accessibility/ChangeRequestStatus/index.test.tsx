import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, waitFor } from '@testing-library/react';
import GetAccessibilityRequestForStatusChange from 'queries/GetAccessibilityRequestForStatusChange';

import { MessageProvider } from 'hooks/useMessage';

import ChangeRequestStatus from './index';

describe('Update 508 request status page', () => {
  const mockQuery = [
    {
      request: {
        query: GetAccessibilityRequestForStatusChange,
        variables: {
          id: '26908e00-927c-4924-8133-119be7eb21a9'
        }
      },
      result: {
        data: {
          accessibilityRequest: {
            id: '26908e00-927c-4924-8133-119be7eb21a9',
            name: 'Mock 508 Request',
            statusRecord: {
              status: 'OPEN'
            }
          }
        }
      }
    }
  ];

  it('renders without errors', async () => {
    const { getByTestId } = render(
      <MemoryRouter
        initialEntries={[
          '/508/requests/26908e00-927c-4924-8133-119be7eb21a9/change-status'
        ]}
      >
        <MockedProvider mocks={mockQuery} addTypename={false}>
          <MessageProvider>
            <Route
              path="/508/requests/:accessibilityRequestId"
              component={ChangeRequestStatus}
            />
          </MessageProvider>
        </MockedProvider>
      </MemoryRouter>
    );

    await waitFor(() => new Promise(res => setTimeout(res, 0)));

    expect(getByTestId('change-request-status-view')).toBeInTheDocument();
  });
});
