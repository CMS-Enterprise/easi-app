import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { fireEvent, render, screen } from '@testing-library/react';
import i18next from 'i18next';
import { grbReviewer as mockGrbReviewer } from 'tests/mock/grbReview';

import GRBVotingPanel from './index';

describe('GRBVotingPanel', () => {
  const renderComponent = (grbReviewer = mockGrbReviewer) => {
    return render(
      <MemoryRouter>
        <MockedProvider>
          <GRBVotingPanel grbReviewer={grbReviewer} />
        </MockedProvider>
      </MemoryRouter>
    );
  };

  it('renders correctly with all steps ', () => {
    renderComponent();

    // Check that the title is rendered
    expect(
      screen.getByText(i18next.t<string>('grbReview:reviewTask.title'))
    ).toBeInTheDocument();

    // Check that all steps are rendered
    // Bypassing i18n library here because the text passed through the Trans component with text wrapped in tags
    expect(screen.getByText('Step 1')).toBeInTheDocument();
    expect(screen.getByText('Step 2')).toBeInTheDocument();
    expect(screen.getByText('Step 3')).toBeInTheDocument();
  });

  it('renders GRBVoteStatus when the reviewer has already voted', () => {
    renderComponent();

    // Check that the GRBVoteStatus component is rendered
    expect(
      screen.getByText(
        i18next.t<string>('grbReview:reviewTask.voting.youVoted')
      )
    ).toBeInTheDocument();
  });

  it('does not render GRBVoteStatus when the reviewer has not voted', () => {
    const grbReviewer = {
      vote: null,
      dateVoted: null,
      voteComment: null
    } as typeof mockGrbReviewer;

    renderComponent(grbReviewer);

    // Check that the GRBVoteStatus component is not rendered
    expect(
      screen.queryByText(
        i18next.t<string>('grbReview:reviewTask.voting.youVoted')
      )
    ).not.toBeInTheDocument();
  });

  it('always renders GRBVotingModal', () => {
    renderComponent();

    // Check that the GRBVotingModal component is rendered
    expect(
      screen.getByText(i18next.t<string>('grbReview:reviewTask.voting.title'))
    ).toBeInTheDocument();
  });

  it('expands and collapses CollapsableLink components', () => {
    renderComponent();

    // Find the collapsable link
    const collapsableLink = screen.getByText(
      i18next.t<string>('grbReview:reviewTask.voting.whatIsImportant')
    );

    // Check that the collapsable link is initially collapsed
    expect(collapsableLink).toBeInTheDocument();

    // Simulate a click to expand the link
    fireEvent.click(collapsableLink);

    // Check that the content is visible
    expect(
      screen.getByText(
        i18next.t<string>('grbReview:reviewTask.voting.documentsOrResources')
      )
    ).toBeInTheDocument();

    // Simulate another click to collapse the link
    fireEvent.click(collapsableLink);

    // Check that the content is no longer visible
    expect(
      screen.queryByText(
        i18next.t<string>('grbReview:reviewTask.voting.documentsOrResources')
      )
    ).not.toBeInTheDocument();
  });

  it('matches snapshot', () => {
    const { asFragment } = renderComponent();

    // Find the collapsable link
    const collapsableLink = screen.getByText(
      i18next.t<string>('grbReview:reviewTask.voting.whatIsImportant')
    );

    // Simulate a click to expand the link
    fireEvent.click(collapsableLink);

    // Find the collapsable link # 2
    const collapsableLink2 = screen.getByText(
      i18next.t<string>('grbReview:reviewTask.voting.howShouldIParticipate')
    );

    // Simulate a click to expand the link
    fireEvent.click(collapsableLink2);

    expect(asFragment()).toMatchSnapshot();
  });
});
