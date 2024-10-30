import React from 'react';
import { render, screen, within } from '@testing-library/react';
import i18next from 'i18next';

import { guidanceLetter, trbRequest } from 'data/mock/trbRequest';
import VerboseMockedProvider from 'utils/testing/VerboseMockedProvider';

import InsightsList from '.';

const { insights } = guidanceLetter;

/** Render component for testing within single recommendation list item */
const renderRecommendation = (index: number, editable: boolean = true) => {
  render(
    <VerboseMockedProvider>
      <InsightsList
        recommendations={insights}
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

describe('TRB guidance and insights list', () => {
  it('renders the recommendation', () => {
    const recommendation = renderRecommendation(0);

    expect(
      recommendation.getByRole('heading', {
        level: 3,
        name: insights[0].title
      })
    );

    expect(recommendation.getByText(insights[0].recommendation));

    const links = recommendation.getAllByRole('link');
    expect(links.length).toEqual(insights[0].links.length);
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
        name: 'Edit guidance'
      })
    );

    expect(
      recommendation.getByRole('button', {
        name: 'Remove guidance'
      })
    );

    // Reorder control buttons
    const reorderControls = within(
      recommendation.getByTestId('reorder-controls')
    );

    expect(
      reorderControls.getByRole('button', {
        name: 'Increase guidance sort order'
      })
    );

    expect(
      reorderControls.getByRole('button', {
        name: 'Decrease guidance sort order'
      })
    );

    // Check for correct index
    expect(reorderControls.getByTestId('order-index')).toHaveTextContent('1');
  });

  it('renders non-editable view', () => {
    renderRecommendation(0, false);

    expect(screen.queryByRole('button', { name: 'Edit guidance' })).toBeNull();

    expect(
      screen.queryByRole('button', { name: 'Remove guidance' })
    ).toBeNull();

    expect(screen.queryByTestId('reorder-controls')).toBeNull();
  });
});
