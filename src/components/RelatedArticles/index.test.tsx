import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import i18next from 'i18next';

import RelatedArticle from './index';

describe('RelatedArticle', () => {
  it('matches the snapshot', () => {
    const { asFragment } = render(
      <MemoryRouter>
        <RelatedArticle
          articles={[
            'governanceReviewBoard',
            'governanceReviewTeam',
            'newSystem'
          ]}
        />
      </MemoryRouter>
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders correct articles', () => {
    render(
      <MemoryRouter>
        <RelatedArticle
          articles={[
            'governanceReviewBoard',
            'governanceReviewTeam',
            'newSystem'
          ]}
        />
      </MemoryRouter>
    );

    expect(screen.getByText(i18next.t<string>('governanceReviewBoard:title')));
    expect(screen.getByText(i18next.t<string>('governanceReviewTeam:title')));
    expect(screen.getByText(i18next.t<string>('newSystem:title')));
  });
});
