import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render } from '@testing-library/react';

import itGovernanceArticles from 'views/Help/ITGovernance/articles';
import section508Articles from 'views/Help/Section508/articles';

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

  it('renders correct 508 article type', () => {
    const { getByText } = render(
      <MemoryRouter>
        <ArticleCard {...section508Articles[0]} />
      </MemoryRouter>
    );

    expect(getByText('Section 508')).toBeInTheDocument();
  });
});
