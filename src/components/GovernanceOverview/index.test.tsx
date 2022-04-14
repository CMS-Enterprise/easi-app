import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render } from '@testing-library/react';

import GovernanceOverviewContent from './index';

describe('Governance Overview Content', () => {
  it('renders default version without crashing', () => {
    const { asFragment } = render(<GovernanceOverviewContent />);
    expect(asFragment()).toMatchSnapshot();
  });
  it('renders help section version without crashing', () => {
    const { asFragment } = render(
      <MemoryRouter>
        <GovernanceOverviewContent helpArticle />
      </MemoryRouter>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
