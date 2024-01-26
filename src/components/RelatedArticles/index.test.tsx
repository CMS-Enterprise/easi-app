import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render } from '@testing-library/react';

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

  it('renders correct itgovernance article type', () => {
    const { queryAllByText } = render(
      <MemoryRouter>
        <RelatedArticle articles={['governanceReviewBoard']} />
      </MemoryRouter>
    );

    expect(queryAllByText('IT Governance').length).toBe(3);
  });
});
