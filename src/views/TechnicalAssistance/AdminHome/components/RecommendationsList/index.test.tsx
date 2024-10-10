import React from 'react';
import { render, screen, within } from '@testing-library/react';
import i18next from 'i18next';

import { adviceLetter, trbRequest } from 'data/mock/trbRequest';
import VerboseMockedProvider from 'utils/testing/VerboseMockedProvider';

import RecommendationsList from '.';

const { recommendations } = adviceLetter;

/** Render component for testing within single recommendation list item */
const renderRecommendation = (index: number, editable: boolean = true) => {
  render(
    <VerboseMockedProvider>
      <RecommendationsList
        recommendations={recommendations}
        trbRequestId={trbRequest.id}
        editable={editable}
        {...(editable ? { edit: () => null, remove: () => null } : {})}
      />
    </VerboseMockedProvider>
  );

  const elements = screen.getAllByTestId('recommendations_list-item');
  expect(elements.length).toEqual(3);

  return within(elements[index]);
};

describe('TRB recommendations list', () => {
  it('renders the recommendation', () => {
    const recommendation = renderRecommendation(0);

    expect(
      recommendation.getByRole('heading', {
        level: 3,
        name: recommendations[0].title
      })
    );

    expect(recommendation.getByText(recommendations[0].recommendation));

    const links = recommendation.getAllByRole('link');
    expect(links.length).toEqual(recommendations[0].links.length);
  });

  it('renders editable view', () => {
    const recommendation = renderRecommendation(0);

    // Reorder recommendations info alert
    expect(
      screen.getByText(
        i18next.t<string>(
          'technicalAssistance:guidanceLetterForm.reorderGuidance'
        )
      )
    );

    // Check for edit and remove buttons
    expect(
      recommendation.getByRole('button', {
        name: 'Edit recommendation'
      })
    );

    expect(
      recommendation.getByRole('button', {
        name: 'Remove recommendation'
      })
    );

    // Reorder control buttons
    const reorderControls = within(
      recommendation.getByTestId('reorder-controls')
    );

    expect(
      reorderControls.getByRole('button', {
        name: 'Increase recommendation sort order'
      })
    );

    expect(
      reorderControls.getByRole('button', {
        name: 'Decrease recommendation sort order'
      })
    );

    // Check for correct index
    expect(reorderControls.getByTestId('order-index')).toHaveTextContent('1');
  });

  it('renders non-editable view', () => {
    renderRecommendation(0, false);

    expect(
      screen.queryByRole('button', { name: 'Edit recommendation' })
    ).toBeNull();

    expect(
      screen.queryByRole('button', { name: 'Remove recommendation' })
    ).toBeNull();

    expect(screen.queryByTestId('reorder-controls')).toBeNull();
  });
});
