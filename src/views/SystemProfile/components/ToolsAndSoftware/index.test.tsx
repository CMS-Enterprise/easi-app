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
    expect(getByText('Terraform')).toBeInTheDocument();
    expect(getByText('Microsoft')).toBeInTheDocument();
  });

  it('renders mutliple software prodcuts correctly', () => {
    const { getAllByTestId } = render(
      <ToolsAndSoftware system={{ ...systemProfileData }} />
    );

    const softwareProducts = getAllByTestId('software-product-card');

    expect(softwareProducts.length).toEqual(3);
  });

  it('renders Product Tags correctly', () => {
    const { getAllByTestId } = render(
      <ToolsAndSoftware system={{ ...systemProfileData }} />
    );

    const softwareProducts = getAllByTestId('software-product-card');

    // These checks rely on the ordering of mock data in src/data/mock/systemProfile.ts

    // Test that the first product has neither the API Gateway tag nor the AI tag
    expect(softwareProducts[0]).not.toHaveTextContent(
      'Used for Artificial Intelligence'
    );
    expect(softwareProducts[0]).not.toHaveTextContent('API Gateway');

    // Test that the second product has the API Gateway tag but not the AI tag
    expect(softwareProducts[1]).not.toHaveTextContent(
      'Used for Artificial Intelligence'
    );
    expect(softwareProducts[2]).toHaveTextContent('API Gateway');

    // Test that the third product has both the API Gateway tag and the AI tag
    expect(softwareProducts[2]).toHaveTextContent(
      'Used for Artificial Intelligence'
    );
    expect(softwareProducts[2]).toHaveTextContent('API Gateway');
  });
});
