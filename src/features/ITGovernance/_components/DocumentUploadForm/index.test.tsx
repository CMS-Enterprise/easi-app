import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, screen } from '@testing-library/react';

import { MessageProvider } from 'hooks/useMessage';
import { ITGovernanceViewType } from 'types/itGov';
import easiMockStore from 'utils/testing/easiMockStore';

import DocumentUploadForm from '.';

const systemId = '63448b98-f92a-4227-bbf3-d07961ce242d';

describe('DocumentUploadForm page', () => {
  const renderUploadForm = ({
    type,
    uploadSource = 'request'
  }: {
    type: ITGovernanceViewType;
    uploadSource?: 'grbReviewForm' | 'request';
  }) => {
    const mockStore = easiMockStore({
      groups:
        type === 'requester'
          ? ['EASI_P_USER']
          : [
              'EASI_TRB_ADMIN_D',
              'EASI_TRB_ADMIN_P',
              'EASI_D_GOVTEAM',
              'EASI_P_GOVTEAM'
            ]
    });

    return render(
      <MemoryRouter
        initialEntries={[
          {
            pathname: `/it-governance/${systemId}/documents/upload`,
            state: { uploadSource }
          }
        ]}
      >
        <MockedProvider>
          <Provider store={mockStore}>
            <Route path="/it-governance/:systemId/documents/upload">
              <MessageProvider>
                <DocumentUploadForm type={type} />
              </MessageProvider>
            </Route>
          </Provider>
        </MockedProvider>
      </MemoryRouter>
    );
  };

  it('matches the snapshot', () => {
    const { asFragment } = renderUploadForm({ type: 'admin' });

    expect(asFragment()).toMatchSnapshot();
  });

  it('renders admin view', async () => {
    renderUploadForm({ type: 'admin' });

    // Renders correct return link text and url
    const returnLink = screen.getByRole('link', {
      name: "Don't upload and return to request details"
    });

    expect(returnLink).toHaveAttribute(
      'href',
      `/it-governance/${systemId}/grb-review`
    );

    // Show notification field
    expect(
      await screen.findByText(
        'Would you like to send a notification email to GRB reviewers?'
      )
    );
  });

  it('renders admin view when uploading from GRB review form', async () => {
    renderUploadForm({ type: 'admin', uploadSource: 'grbReviewForm' });

    // Renders correct return link text and url
    const returnLink = screen.getByRole('link', {
      name: "Don't upload and return to GRB review setup"
    });

    expect(returnLink).toHaveAttribute(
      'href',
      `/it-governance/${systemId}/grb-review/documents`
    );

    // Hide notification field
    expect(
      screen.queryByText(
        'Would you like to send a notification email to GRB reviewers?'
      )
    ).not.toBeInTheDocument();
  });

  it('renders requester view', async () => {
    renderUploadForm({ type: 'requester' });

    // Renders correct return link text and url
    const returnLink = screen.getByRole('link', {
      name: "Don't upload and return to Intake Request"
    });

    expect(returnLink).toHaveAttribute('href', `/system/${systemId}/documents`);

    // Hide notification field
    expect(
      screen.queryByText(
        'Would you like to send a notification email to GRB reviewers?'
      )
    ).not.toBeInTheDocument();
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
