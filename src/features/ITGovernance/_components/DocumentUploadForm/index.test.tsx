import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, screen } from '@testing-library/react';

import { MessageProvider } from 'hooks/useMessage';
import easiMockStore from 'utils/testing/easiMockStore';

import DocumentUploadForm from '.';

describe('DocumentUploadForm page', () => {
  it('renders send notification check if viewing in admin context', async () => {
    const mockStore = easiMockStore({
      groups: [
        'EASI_TRB_ADMIN_D',
        'EASI_TRB_ADMIN_P',
        'EASI_D_GOVTEAM',
        'EASI_P_GOVTEAM'
      ]
    });

    render(
      <MemoryRouter>
        <MockedProvider>
          <Provider store={mockStore}>
            <MessageProvider>
              <DocumentUploadForm type="admin" />
            </MessageProvider>
          </Provider>
        </MockedProvider>
      </MemoryRouter>
    );

    expect(
      await screen.findByText(
        'Would you like to send a notification email to GRB reviewers?'
      )
    );
  });

  it('does not render send notification check if not viewing in admin context (even if admin perms)', async () => {
    const mockStore = easiMockStore({
      groups: [
        'EASI_TRB_ADMIN_D',
        'EASI_TRB_ADMIN_P',
        'EASI_D_GOVTEAM',
        'EASI_P_GOVTEAM'
      ]
    });

    render(
      <MemoryRouter>
        <MockedProvider>
          <Provider store={mockStore}>
            <MessageProvider>
              <DocumentUploadForm type="requester" />
            </MessageProvider>
          </Provider>
        </MockedProvider>
      </MemoryRouter>
    );

    expect(
      screen.queryByText(
        'Would you like to send a notification email to GRB reviewers?'
      )
    ).not.toBeInTheDocument();
  });

  it('does not render send notification check if viewing as a non-admin in requester context', async () => {
    const mockStore = easiMockStore({
      groups: ['EASI_P_USER']
    });

    render(
      <MemoryRouter>
        <MockedProvider>
          <Provider store={mockStore}>
            <MessageProvider>
              <DocumentUploadForm type="requester" />
            </MessageProvider>
          </Provider>
        </MockedProvider>
      </MemoryRouter>
    );

    expect(
      screen.queryByText(
        'Would you like to send a notification email to GRB reviewers?'
      )
    ).not.toBeInTheDocument();
  });

  it('does not render send notification check if viewing as a non-admin in admin context (should not be possible)', async () => {
    const mockStore = easiMockStore({
      groups: ['EASI_P_USER']
    });

    render(
      <MemoryRouter>
        <MockedProvider>
          <Provider store={mockStore}>
            <MessageProvider>
              <DocumentUploadForm type="admin" />
            </MessageProvider>
          </Provider>
        </MockedProvider>
      </MemoryRouter>
    );

    expect(
      screen.queryByText(
        'Would you like to send a notification email to GRB reviewers?'
      )
    ).not.toBeInTheDocument();
  });
});
