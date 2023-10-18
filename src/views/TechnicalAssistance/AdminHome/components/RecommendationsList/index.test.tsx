import React from 'react';
import { render, screen, within } from '@testing-library/react';

import { adviceLetter, trbRequest } from 'data/mock/trbRequest';
import VerboseMockedProvider from 'utils/testing/VerboseMockedProvider';

import RecommendationsList from '.';

const { recommendations } = adviceLetter;

describe('TRB recommendations list', () => {
  it('renders the recommendation', () => {
    render(
      <VerboseMockedProvider>
        <RecommendationsList
          recommendations={recommendations}
          trbRequestId={trbRequest.id}
        />
      </VerboseMockedProvider>
    );

    const elements = screen.getAllByTestId('recommendations_list-item');
    expect(elements.length).toEqual(3);

    const [recOne] = elements;

    expect(
      within(recOne).getByRole('heading', {
        level: 3,
        name: recommendations[0].title
      })
    );

    expect(within(recOne).getByText(recommendations[0].recommendation));

    const links = within(recOne).getAllByRole('link');
    expect(links.length).toEqual(recommendations[0].links.length);
  });
});
