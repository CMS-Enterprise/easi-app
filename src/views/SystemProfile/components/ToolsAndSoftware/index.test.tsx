import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { render } from '@testing-library/react';

import { getMockSystemProfileData } from 'data/mock/systemProfile';

import ToolsAndSoftware from './index';

const systemProfileData = getMockSystemProfileData();

describe('System Tools and Software subpage', () => {
  it('matches snapshot', async () => {
    const { asFragment, getByText } = render(
      <MemoryRouter initialEntries={['/systems/000-100-0/tools-and-software']}>
        <Route path="/systems/:systemId/:subinfo">
          <ToolsAndSoftware system={systemProfileData} />
        </Route>
      </MemoryRouter>
    );
    expect(asFragment()).toMatchSnapshot();
    expect(getByText('Drupal')).toBeInTheDocument();
    expect(getByText('Software Development')).toBeInTheDocument();
    expect(getByText('API Gateway')).toBeInTheDocument();
  });
});
