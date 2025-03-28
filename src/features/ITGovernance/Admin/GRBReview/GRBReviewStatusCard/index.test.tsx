import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import { SystemIntakeGRBReviewType } from 'gql/generated/graphql';
import i18next from 'i18next';
import ITGovAdminContext from 'wrappers/ITGovAdminContext/ITGovAdminContext';

import GRBReviewStatusCard, { GRBReviewStatus } from '.';

describe('GRBReviewStatusCard', () => {
  const renderWithContext = (isITGovAdmin: boolean, props: any) => {
    return render(
      <MemoryRouter>
        <ITGovAdminContext.Provider value={isITGovAdmin}>
          <GRBReviewStatusCard {...props} />
        </ITGovAdminContext.Provider>
      </MemoryRouter>
    );
  };

  it('renders the standard card with correct status and meeting details', () => {
    vi.spyOn(React, 'useContext').mockReturnValue(true);

    const { asFragment } = renderWithContext(true, {
      grbReviewType: SystemIntakeGRBReviewType.STANDARD,
      grbDate: '2023-01-01',
      grbReviewStatus: GRBReviewStatus.SCHEDULED,
      grbReviewStartedAt: '2023-01-01T00:00:00Z',
      className: 'test-class'
    });

    // Check that the standard heading is rendered
    expect(
      screen.getByText(
        i18next.t<string>('grbReview:statusCard.standardHeading')
      )
    ).toBeInTheDocument();

    // Check that the review status is rendered
    expect(
      screen.getByText(i18next.t<string>('grbReview:statusCard.reviewStatus'))
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        i18next.t<string>(
          `grbReview:statusCard.grbReviewStatus.${GRBReviewStatus.SCHEDULED}`
        )
      )
    ).toBeInTheDocument();

    // Check that the meeting details are rendered
    expect(
      screen.getByText(i18next.t<string>('grbReview:statusCard.grbMeeting'))
    ).toBeInTheDocument();
    expect(screen.getByText('01/01/2023')).toBeInTheDocument();

    // Check that the change meeting date button is rendered
    expect(
      screen.getByText(
        i18next.t<string>('grbReview:statusCard.changeMeetingDate')
      )
    ).toBeInTheDocument();

    expect(asFragment()).toMatchSnapshot();
  });

  it('renders the completed status without meeting details', () => {
    renderWithContext(false, {
      grbReviewType: SystemIntakeGRBReviewType.STANDARD,
      grbReviewStartedAt: '2023-01-01T00:00:00Z',
      grbReviewStatus: GRBReviewStatus.COMPLETED
    });

    // Check that the completed status is rendered
    expect(
      screen.getByText(
        i18next.t<string>(
          `grbReview:statusCard.grbReviewStatus.${GRBReviewStatus.COMPLETED}`
        )
      )
    ).toBeInTheDocument();

    // Check that meeting details are not rendered
    expect(
      screen.queryByText(i18next.t<string>('grbReview:statusCard.grbMeeting'))
    ).not.toBeInTheDocument();
  });

  it('renders AsyncAdmin card for async review type when user is ITGovAdmin', () => {
    renderWithContext(true, {
      grbReviewType: SystemIntakeGRBReviewType.ASYNC,
      grbReviewStartedAt: '2023-01-01T00:00:00Z',
      grbReviewStatus: GRBReviewStatus.IN_PROGRESS
    });

    // Check for specific content rendered by the AsyncAdmin card
    expect(
      screen.getByText(i18next.t<string>('grbReview:statusCard.asyncHeading'))
    ).toBeInTheDocument();
  });

  it('renders AsyncReviewer card for async review type when user is not ITGovAdmin', () => {
    renderWithContext(false, {
      grbReviewType: SystemIntakeGRBReviewType.ASYNC,
      grbReviewStartedAt: '2023-01-01T00:00:00Z',
      grbReviewStatus: GRBReviewStatus.IN_PROGRESS
    });

    // Check for specific content rendered by the AsyncAdmin card
    expect(
      screen.getByText(i18next.t<string>('grbReview:statusCard.asyncHeading'))
    ).toBeInTheDocument();
  });

  it('renders null in the abscence ofgrbReviewStartedAt ', () => {
    const { container } = renderWithContext(false, {
      grbReviewType: SystemIntakeGRBReviewType.ASYNC,
      grbReviewStatus: GRBReviewStatus.IN_PROGRESS
    });

    // Ensure the component renders nothing
    expect(container.firstChild).toBeNull();
  });
});
