import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render } from '@testing-library/react';

import RelatedArticle from './index';

describe('RelatedArticle', () => {
  it('matches the snapshot', () => {
    const { asFragment } = render(
      <MemoryRouter>
        <RelatedArticle type="IT Governance" currentArticle="newSystem" />
      </MemoryRouter>
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders correct itgovernance article type', () => {
    const { queryAllByText } = render(
      <MemoryRouter>
        <RelatedArticle type="IT Governance" currentArticle="newSystem" />
      </MemoryRouter>
    );

    expect(queryAllByText('IT Governance').length).toBe(3);
  });

  it('renders correct 508 article type', () => {
    const { queryAllByText } = render(
      <MemoryRouter>
        <RelatedArticle type="Section 508" currentArticle="newSystem" />
      </MemoryRouter>
    );

    expect(queryAllByText('Section 508')[0]).toBeInTheDocument();
  });
});
