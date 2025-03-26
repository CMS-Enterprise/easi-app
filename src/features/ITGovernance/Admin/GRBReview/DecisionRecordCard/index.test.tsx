import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import {
  GRBVotingInformationStatus,
  SystemIntakeFragmentFragment,
  SystemIntakeGRBReviewerRole,
  SystemIntakeGRBReviewerVotingRole
} from 'gql/generated/graphql';
import i18next from 'i18next';
import ITGovAdminContext from 'wrappers/ITGovAdminContext/ITGovAdminContext';

import DecisionRecordCard from './index';

describe('DecisionRecordCard', () => {
  const mockVotingInformation: SystemIntakeFragmentFragment['grbVotingInformation'] =
    {
      __typename: 'GRBVotingInformation',
      votingStatus: GRBVotingInformationStatus.APPROVED,
      numberOfNoObjection: 3,
      numberOfObjection: 1,
      numberOfNotVoted: 2,
      grbReviewers: [
        {
          __typename: 'SystemIntakeGRBReviewer',
          id: '1',
          grbRole: SystemIntakeGRBReviewerRole.ACA_3021_REP,
          votingRole: SystemIntakeGRBReviewerVotingRole.VOTING,
          userAccount: {
            __typename: 'UserAccount',
            id: 'user1',
            username: 'user1_username',
            commonName: 'User One',
            email: 'user1@example.com'
          },
          voteComment: 'This is a comment'
        },
        {
          __typename: 'SystemIntakeGRBReviewer',
          id: '2',
          grbRole: SystemIntakeGRBReviewerRole.ACA_3021_REP,
          votingRole: SystemIntakeGRBReviewerVotingRole.VOTING,
          userAccount: {
            __typename: 'UserAccount',
            id: 'user2',
            username: 'user2_username',
            commonName: 'User Two',
            email: 'user2@example.com'
          },
          voteComment: 'Another comment'
        },
        {
          __typename: 'SystemIntakeGRBReviewer',
          id: '3',
          grbRole: SystemIntakeGRBReviewerRole.ACA_3021_REP,
          votingRole: SystemIntakeGRBReviewerVotingRole.VOTING,
          userAccount: {
            __typename: 'UserAccount',
            id: 'user3',
            username: 'user3_username',
            commonName: 'User Three',
            email: 'user3@example.com'
          },
          voteComment: ''
        }
      ]
    };

  const renderComponent = (
    isITGovAdmin: boolean,
    votingInformation: SystemIntakeFragmentFragment['grbVotingInformation']
  ) => {
    return render(
      <MemoryRouter>
        <ITGovAdminContext.Provider value={isITGovAdmin}>
          <DecisionRecordCard grbVotingInformation={votingInformation} />
        </ITGovAdminContext.Provider>
      </MemoryRouter>
    );
  };

  it('renders correctly when the user is an ITGov admin and voting status is not NOT_STARTED', () => {
    renderComponent(true, mockVotingInformation);

    // Check that the heading is rendered
    expect(
      screen.getByText(i18next.t<string>('grbReview:decisionCard.heading'))
    ).toBeInTheDocument();

    // Check that the vote information is rendered
    expect(
      screen.getByText(
        i18next.t<string>('grbReview:decisionCard.voteInfo', {
          noObjection: 3,
          objection: 1,
          notVoted: 2
        })
      )
    ).toBeInTheDocument();

    // Check that the "View Votes" link is rendered
    expect(
      screen.getByText(i18next.t<string>('grbReview:decisionCard.viewVotes'))
    ).toBeInTheDocument();

    // Check that the additional comments count is rendered
    expect(
      screen.getByText(
        i18next.t<string>('grbReview:decisionCard.additionalComments', {
          count: 2
        })
      )
    ).toBeInTheDocument();
  });

  it('does not render when the user is not an ITGov admin', () => {
    const { container } = renderComponent(false, mockVotingInformation);

    // Ensure the component renders nothing
    expect(container.firstChild).toBeNull();
  });

  it('does not render when the voting status is NOT_STARTED', () => {
    const votingInformation = {
      ...mockVotingInformation,
      votingStatus: GRBVotingInformationStatus.NOT_STARTED
    };

    const { container } = renderComponent(true, votingInformation);

    // Ensure the component renders nothing
    expect(container.firstChild).toBeNull();
  });

  it('applies the correct background and border colors based on voting status', () => {
    const votingInformation = {
      ...mockVotingInformation,
      votingStatus: GRBVotingInformationStatus.APPROVED
    };

    const { container } = renderComponent(true, votingInformation);

    // Check that the background color is applied
    expect(container.firstChild).toHaveClass('bg-success-darker');
  });

  it('renders the decision banner correctly for APPROVED status', () => {
    const votingInformation = {
      ...mockVotingInformation,
      votingStatus: GRBVotingInformationStatus.APPROVED
    };

    renderComponent(true, votingInformation);

    // Check that the decision banner text is rendered
    expect(
      screen.getByText(i18next.t<string>('grbReview:decisionCard.approve'))
    ).toBeInTheDocument();

    // Check that the "Issue Decision" link is rendered
    expect(
      screen.getByText(
        i18next.t<string>('grbReview:decisionCard.issueDecision')
      )
    ).toBeInTheDocument();
  });

  it('renders the decision banner correctly for NOT_APPROVED status', () => {
    const votingInformation = {
      ...mockVotingInformation,
      votingStatus: GRBVotingInformationStatus.NOT_APPROVED
    };

    renderComponent(true, votingInformation);

    // Check that the decision banner text is rendered
    expect(
      screen.getByText(i18next.t<string>('grbReview:decisionCard.notApprove'))
    ).toBeInTheDocument();
  });

  it('renders the decision banner correctly for INCONCLUSIVE status', () => {
    const votingInformation = {
      ...mockVotingInformation,
      votingStatus: GRBVotingInformationStatus.INCONCLUSIVE
    };

    renderComponent(true, votingInformation);

    // Check that the decision banner text is rendered
    expect(
      screen.getByText(i18next.t<string>('grbReview:decisionCard.inconclusive'))
    ).toBeInTheDocument();
  });
});
