import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render } from '@testing-library/react';
import itGovernanceArticles from 'features/Help/ITGovernance/articles';

import ArticleCard from './index';

describe('RelatedArticle', () => {
  it('matches the snapshot', () => {
    const { asFragment } = render(
      <MemoryRouter>
        <ArticleCard {...itGovernanceArticles[0]} />
      </MemoryRouter>
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders correct itgovernance article type', () => {
    const { getByText } = render(
      <MemoryRouter>
        <ArticleCard {...itGovernanceArticles[0]} />
      </MemoryRouter>
    );

    expect(getByText('IT Governance')).toBeInTheDocument();
  });
});
