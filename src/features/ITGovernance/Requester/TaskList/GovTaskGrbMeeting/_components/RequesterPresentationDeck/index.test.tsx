import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  DeleteSystemIntakeGRBPresentationLinksDocument,
  DeleteSystemIntakeGRBPresentationLinksMutation,
  DeleteSystemIntakeGRBPresentationLinksMutationVariables,
  GetGovernanceTaskListDocument,
  GetGovernanceTaskListQuery,
  GetGovernanceTaskListQueryVariables,
  SystemIntakeDocumentStatus,
  SystemIntakeGRBPresentationLinksFragment
} from 'gql/generated/graphql';
import { taskListState } from 'tests/mock/govTaskList';
import {
  grbPresentationLinks as mockGRBPresentationLinks,
  systemIntake
} from 'tests/mock/systemIntake';
import { describe, expect, it } from 'vitest';

import { MessageProvider } from 'hooks/useMessage';
import { MockedQuery } from 'types/util';
import VerboseMockedProvider from 'utils/testing/VerboseMockedProvider';

import RequesterPresentationDeck from './index';

const mockDeleteSystemIntakeGRBPresentationLinksMutation: MockedQuery<
  DeleteSystemIntakeGRBPresentationLinksMutation,
  DeleteSystemIntakeGRBPresentationLinksMutationVariables
> = {
  request: {
    query: DeleteSystemIntakeGRBPresentationLinksDocument,
    variables: {
      input: {
        systemIntakeID: systemIntake.id
      }
    }
  },
  result: {
    data: {
      __typename: 'Mutation',
      deleteSystemIntakeGRBPresentationLinks: systemIntake.id
    }
  }
};

const mockGetGovernanceTaskListQuery: MockedQuery<
  GetGovernanceTaskListQuery,
  GetGovernanceTaskListQueryVariables
> = {
  request: {
    query: GetGovernanceTaskListDocument,
    variables: { id: systemIntake.id }
  },
  result: {
    data: {
      __typename: 'Query',
      systemIntake: taskListState.grbMeetingInProgressScheduled.systemIntake
    }
  }
};

describe('RequesterPresentationDeck', () => {
  const renderComponent = (
    grbPresentationLinks?: SystemIntakeGRBPresentationLinksFragment | null
  ) =>
    render(
      <MemoryRouter>
        <VerboseMockedProvider
          mocks={[
            mockDeleteSystemIntakeGRBPresentationLinksMutation,
            mockGetGovernanceTaskListQuery
          ]}
        >
          <MessageProvider>
            <RequesterPresentationDeck
              systemIntakeID={systemIntake.id}
              grbPresentationLinks={grbPresentationLinks}
            />
          </MessageProvider>
        </VerboseMockedProvider>
      </MemoryRouter>
    );

  it('matches snapshot with available presentation deck', () => {
    const { asFragment } = renderComponent(mockGRBPresentationLinks);
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders file name and view/remove buttons when presentation deck is available', () => {
    renderComponent(mockGRBPresentationLinks);

    expect(
      screen.getByText(mockGRBPresentationLinks.presentationDeckFileName!)
    ).toBeInTheDocument();

    expect(screen.getByRole('link', { name: 'View' })).toBeInTheDocument();

    expect(screen.getByRole('button', { name: 'Remove' })).toBeInTheDocument();
  });

  it('allows user to remove presentation deck', async () => {
    renderComponent(mockGRBPresentationLinks);

    userEvent.click(screen.getByRole('button', { name: 'Remove' }));

    const removePresentationLinksModal = screen.getByRole('dialog', {
      name: 'Are you sure you want to remove this GRB presentation?'
    });

    expect(removePresentationLinksModal).toBeInTheDocument();

    userEvent.click(
      within(removePresentationLinksModal).getByRole('button', {
        name: 'Remove presentation'
      })
    );

    // Wait for modal to close
    await waitFor(() => {
      expect(removePresentationLinksModal).not.toBeInTheDocument();
    });
  });

  it('renders pending status when presentation deck is pending', () => {
    renderComponent({
      ...mockGRBPresentationLinks,
      presentationDeckFileStatus: SystemIntakeDocumentStatus.PENDING
    });

    expect(
      screen.getByTestId('presentation-deck-virus-scanning')
    ).toBeInTheDocument();
  });

  it('renders upload button when presentation links are null', () => {
    renderComponent(null);

    expect(
      screen.getByRole('link', { name: 'Upload presentation deck' })
    ).toBeInTheDocument();
  });

  it('renders upload button when no presentation deck has been uploaded', () => {
    renderComponent({
      ...mockGRBPresentationLinks,
      presentationDeckFileStatus: null,
      presentationDeckFileURL: null,
      presentationDeckFileName: null
    });

    expect(
      screen.getByRole('link', { name: 'Upload presentation deck' })
    ).toBeInTheDocument();
  });
});
