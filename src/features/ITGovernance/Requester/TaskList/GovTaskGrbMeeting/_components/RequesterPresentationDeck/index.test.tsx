import React, { ComponentProps } from 'react';
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
  ITGovGRBStatus,
  SystemIntakeDocumentStatus,
  SystemIntakeGRBReviewType
} from 'gql/generated/graphql';
import { taskListState } from 'tests/mock/govTaskList';
import { grbPresentationLinks, systemIntake } from 'tests/mock/systemIntake';
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
    data: taskListState.grbMeetingInProgressScheduled
  }
};

describe('RequesterPresentationDeck', () => {
  const renderComponent = (
    props: Omit<
      ComponentProps<typeof RequesterPresentationDeck>,
      'systemIntakeID'
    >
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
              grbMeetingStatus={props.grbMeetingStatus}
              grbReviewType={props.grbReviewType}
              grbPresentationLinks={props.grbPresentationLinks}
            />
          </MessageProvider>
        </VerboseMockedProvider>
      </MemoryRouter>
    );

  it('matches snapshot with available presentation deck', () => {
    const { asFragment } = renderComponent({
      grbMeetingStatus: ITGovGRBStatus.REVIEW_IN_PROGRESS,
      grbReviewType: SystemIntakeGRBReviewType.ASYNC,
      grbPresentationLinks
    });
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders correctly when async review is in progress', () => {
    renderComponent({
      grbMeetingStatus: ITGovGRBStatus.REVIEW_IN_PROGRESS,
      grbReviewType: SystemIntakeGRBReviewType.ASYNC,
      grbPresentationLinks
    });

    expect(
      screen.getByText(grbPresentationLinks.presentationDeckFileName!)
    ).toBeInTheDocument();

    expect(screen.getByRole('link', { name: 'View' })).toBeInTheDocument();

    expect(
      screen.queryByRole('button', { name: 'Remove' })
    ).not.toBeInTheDocument();
  });

  it('renders correctly for standard meetings', () => {
    renderComponent({
      grbMeetingStatus: ITGovGRBStatus.SCHEDULED,
      grbReviewType: SystemIntakeGRBReviewType.STANDARD,
      grbPresentationLinks
    });

    expect(
      screen.getByText(grbPresentationLinks.presentationDeckFileName!)
    ).toBeInTheDocument();

    // Check that both buttons render
    expect(screen.getByRole('link', { name: 'View' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Remove' })).toBeInTheDocument();
  });

  it('allows user to remove presentation deck', async () => {
    renderComponent({
      grbMeetingStatus: ITGovGRBStatus.AWAITING_GRB_REVIEW,
      grbReviewType: SystemIntakeGRBReviewType.ASYNC,
      grbPresentationLinks
    });

    // Hides View button when review is not in progress
    expect(
      screen.queryByRole('link', { name: 'View' })
    ).not.toBeInTheDocument();

    // Click remove button to open modal
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
      grbMeetingStatus: ITGovGRBStatus.REVIEW_IN_PROGRESS,
      grbReviewType: SystemIntakeGRBReviewType.ASYNC,
      grbPresentationLinks: {
        ...grbPresentationLinks,
        presentationDeckFileStatus: SystemIntakeDocumentStatus.PENDING
      }
    });

    expect(
      screen.getByTestId('presentation-deck-virus-scanning')
    ).toBeInTheDocument();
  });

  it('renders upload button when presentation links are null', () => {
    renderComponent({
      grbMeetingStatus: ITGovGRBStatus.REVIEW_IN_PROGRESS,
      grbReviewType: SystemIntakeGRBReviewType.ASYNC,
      grbPresentationLinks: null
    });

    expect(
      screen.getByRole('link', { name: 'Upload presentation deck' })
    ).toBeInTheDocument();
  });

  it('renders upload button when no presentation deck has been uploaded', () => {
    renderComponent({
      grbMeetingStatus: ITGovGRBStatus.REVIEW_IN_PROGRESS,
      grbReviewType: SystemIntakeGRBReviewType.ASYNC,
      grbPresentationLinks: {
        ...grbPresentationLinks,
        presentationDeckFileStatus: null,
        presentationDeckFileURL: null,
        presentationDeckFileName: null
      }
    });

    expect(
      screen.getByRole('link', { name: 'Upload presentation deck' })
    ).toBeInTheDocument();
  });
});
