import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { render, screen, within } from '@testing-library/react';
import { SystemIntakeDocumentStatus } from 'gql/generated/graphql';
import { documents, systemIntake } from 'tests/mock/systemIntake';

import { MessageProvider } from 'hooks/useMessage';
import VerboseMockedProvider from 'utils/testing/VerboseMockedProvider';

import DocumentsTable from '.';

describe('DocumentsTable', () => {
  it('renders the documents table', () => {
    render(
      <VerboseMockedProvider mocks={[]}>
        <MemoryRouter>
          <Route>
            <MessageProvider>
              <DocumentsTable
                systemIntakeId={systemIntake.id}
                documents={documents.map(doc => ({
                  ...doc,
                  status: SystemIntakeDocumentStatus.AVAILABLE
                }))}
              />
            </MessageProvider>
          </Route>
        </MemoryRouter>
      </VerboseMockedProvider>
    );

    expect(screen.getByRole('table')).toBeInTheDocument();

    // Get all document rows, excluding the header row
    const documentRows = screen.getAllByRole('row').slice(1);

    expect(documentRows).toHaveLength(documents.length);
  });

  it('renders the virus scan status', () => {
    render(
      <VerboseMockedProvider mocks={[]}>
        <MemoryRouter>
          <Route>
            <MessageProvider>
              <DocumentsTable
                systemIntakeId={systemIntake.id}
                documents={documents.map(doc => ({
                  ...doc,
                  status: SystemIntakeDocumentStatus.PENDING
                }))}
              />
            </MessageProvider>
          </Route>
        </MemoryRouter>
      </VerboseMockedProvider>
    );

    const documentRow = screen.getAllByRole('row')[1];

    expect(within(documentRow).queryAllByRole('button')).toHaveLength(0);

    expect(
      within(documentRow).getByText('Virus scan in progress...')
    ).toBeInTheDocument();
  });

  it('renders the action buttons', () => {
    render(
      <VerboseMockedProvider mocks={[]}>
        <MemoryRouter>
          <Route>
            <MessageProvider>
              <DocumentsTable
                systemIntakeId={systemIntake.id}
                documents={documents.map(doc => ({
                  ...doc,
                  status: SystemIntakeDocumentStatus.AVAILABLE
                }))}
              />
            </MessageProvider>
          </Route>
        </MemoryRouter>
      </VerboseMockedProvider>
    );

    const documentRow = screen.getAllByRole('row')[1];

    expect(
      within(documentRow).getByRole('button', { name: 'Download' })
    ).toBeInTheDocument();

    expect(
      within(documentRow).getByRole('button', { name: 'Remove' })
    ).toBeInTheDocument();
  });

  it('hides the remove button if document has `canDelete` field set to false', () => {
    render(
      <VerboseMockedProvider mocks={[]}>
        <MemoryRouter>
          <Route>
            <MessageProvider>
              <DocumentsTable
                systemIntakeId={systemIntake.id}
                documents={documents.map(doc => ({
                  ...doc,
                  status: SystemIntakeDocumentStatus.AVAILABLE,
                  canDelete: false
                }))}
              />
            </MessageProvider>
          </Route>
        </MemoryRouter>
      </VerboseMockedProvider>
    );

    const documentRow = screen.getAllByRole('row')[1];

    expect(
      within(documentRow).getByRole('button', { name: 'Download' })
    ).toBeInTheDocument();

    expect(
      within(documentRow).queryByRole('button', { name: 'Remove' })
    ).not.toBeInTheDocument();
  });

  it('hides the remove button if `hideRemoveButton` prop is true', () => {
    render(
      <VerboseMockedProvider mocks={[]}>
        <MemoryRouter>
          <Route>
            <MessageProvider>
              <DocumentsTable
                systemIntakeId={systemIntake.id}
                documents={documents.map(doc => ({
                  ...doc,
                  status: SystemIntakeDocumentStatus.AVAILABLE
                }))}
                hideRemoveButton
              />
            </MessageProvider>
          </Route>
        </MemoryRouter>
      </VerboseMockedProvider>
    );

    const documentRow = screen.getAllByRole('row')[1];

    expect(
      within(documentRow).getByRole('button', { name: 'Download' })
    ).toBeInTheDocument();

    expect(
      within(documentRow).queryByRole('button', { name: 'Remove' })
    ).not.toBeInTheDocument();
  });
});
