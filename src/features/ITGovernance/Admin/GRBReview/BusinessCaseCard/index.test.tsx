import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import i18next from 'i18next';

import BusinessCaseCard from './index';

describe('BusinessCaseCard', () => {
  const mockBusinessCase = {
    id: '123',
    updatedAt: '2025-03-21',
    businessNeed: 'This is the business need.',
    preferredSolution: {
      summary: 'This is the preferred solution.'
    }
  };

  const renderComponent = (businessCase: any) => {
    return render(
      <MemoryRouter>
        <BusinessCaseCard businessCase={businessCase} />
      </MemoryRouter>
    );
  };

  it('renders correctly with a submitted business case', () => {
    const { asFragment } = renderComponent(mockBusinessCase);

    // Check that the title is rendered
    expect(
      screen.getByText(
        i18next.t<string>('grbReview:businessCaseOverview.title')
      )
    ).toBeInTheDocument();

    // Check that the submitted date is rendered
    expect(
      screen.getByText(
        `${i18next.t<string>('grbReview:businessCaseOverview.submitted')} 03/21/2025`
      )
    ).toBeInTheDocument();

    // Check that the business need is rendered
    expect(screen.getByText(mockBusinessCase.businessNeed)).toBeInTheDocument();

    // Check that the preferred solution is rendered
    expect(
      screen.getByText(mockBusinessCase.preferredSolution.summary)
    ).toBeInTheDocument();

    // Check that the "View Business Case" link is rendered
    expect(
      screen.getByText(
        i18next.t<string>('grbReview:businessCaseOverview.linkToBusinessCase')
      )
    ).toBeInTheDocument();

    expect(asFragment()).toMatchSnapshot();
  });

  it('renders an alert when the business case is unsubmitted', () => {
    const unsubmittedBusinessCase = {
      id: null,
      updatedAt: null,
      businessNeed: null,
      preferredSolution: null
    };

    renderComponent(unsubmittedBusinessCase);

    // Check that the alert is rendered
    expect(
      screen.getByText(
        i18next.t<string>('grbReview:businessCaseOverview.unsubmittedAlertText')
      )
    ).toBeInTheDocument();
  });

  it('renders "No Solution" when preferred solution is missing', () => {
    const businessCaseWithoutSolution = {
      ...mockBusinessCase,
      preferredSolution: null
    };

    renderComponent(businessCaseWithoutSolution);

    // Check that "No Solution" is rendered
    expect(
      screen.getByText(
        i18next.t<string>('grbReview:businessCaseOverview.noSolution')
      )
    ).toBeInTheDocument();
  });
});
