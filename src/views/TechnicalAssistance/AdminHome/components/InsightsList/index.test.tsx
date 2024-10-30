import React from 'react';
import { render, screen, within } from '@testing-library/react';
import i18next from 'i18next';

import { guidanceLetter, trbRequest } from 'data/mock/trbRequest';
import VerboseMockedProvider from 'utils/testing/VerboseMockedProvider';

import InsightsList from '.';

const { insights } = guidanceLetter;

/** Render component for testing within single insight list item */
const renderInsight = (index: number, editable: boolean = true) => {
  render(
    <VerboseMockedProvider>
      <InsightsList
        insights={insights}
        trbRequestId={trbRequest.id}
        editable={editable}
        {...(editable ? { edit: () => null, remove: () => null } : {})}
      />
    </VerboseMockedProvider>
  );

  const elements = screen.getAllByTestId('insights_list-item');
  expect(elements.length).toEqual(3);

  return within(elements[index]);
};

describe('TRB guidance and insights list', () => {
  it('renders the insight', () => {
    const insight = renderInsight(0);

    expect(
      insight.getByRole('heading', {
        level: 3,
        name: insights[0].title
      })
    );

    expect(insight.getByText(insights[0].recommendation));

    const links = insight.getAllByRole('link');
    expect(links.length).toEqual(insights[0].links.length);
  });

  it('renders editable view', () => {
    const insight = renderInsight(0);

    // Reorder insights info alert
    expect(
      screen.getByText(
        i18next.t<string>(
          'technicalAssistance:guidanceLetterForm.reorderGuidance'
        )
      )
    );

    // Check for edit and remove buttons
    expect(
      insight.getByRole('button', {
        name: 'Edit guidance'
      })
    );

    expect(
      insight.getByRole('button', {
        name: 'Remove guidance'
      })
    );

    // Reorder control buttons
    const reorderControls = within(insight.getByTestId('reorder-controls'));

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
    renderInsight(0, false);

    expect(screen.queryByRole('button', { name: 'Edit guidance' })).toBeNull();

    expect(
      screen.queryByRole('button', { name: 'Remove guidance' })
    ).toBeNull();

    expect(screen.queryByTestId('reorder-controls')).toBeNull();
  });
});
