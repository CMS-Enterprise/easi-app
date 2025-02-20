import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { fireEvent, render, waitFor } from '@testing-library/react';
// eslint-disable-next-line camelcase
import { GetSystemProfile_cedarSoftwareProducts_softwareProducts } from 'gql/legacyGQL/types/GetSystemProfile';
import { cloneDeep } from 'lodash';
import { getMockSystemProfileData, result } from 'tests/mock/systemProfile';

import { TOOLS_AND_SOFTWARE_PRODUCT_COUNT_CAP } from 'constants/systemProfile';

import ToolsAndSoftware from './index';

const systemProfileData = getMockSystemProfileData();

describe('System Profile Tools and Software subpage', () => {
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

  it('renders an alert when no software prodcuts are listed', () => {
    const res = cloneDeep(systemProfileData);
    res.toolsAndSoftware!.softwareProducts = [];

    const dataWithoutSoftwareProducts = getMockSystemProfileData(res);
    const { getByTestId } = render(
      <ToolsAndSoftware system={{ ...dataWithoutSoftwareProducts }} />
    );
    expect(getByTestId('no-software-products-alert')).toBeInTheDocument();
  });
});

describe(`System Profile Tools and Software section collapse/expand toggle at ${TOOLS_AND_SOFTWARE_PRODUCT_COUNT_CAP}`, () => {
  const buttonExpandToggleMatchOpt = {
    name: /view \d+ more software product/i
  };

  function fillSoftwareProducts(
    count: number
    // eslint-disable-next-line camelcase
  ): GetSystemProfile_cedarSoftwareProducts_softwareProducts[] {
    return Array(count)
      .fill(0)
      .map((_, index) => {
        return {
          apiGatewayUse: false,
          elaPurchase: '',
          elaVendorId: '',
          providesAiCapability: false,
          refstr: 'Ref String',
          softwareCatagoryConnectionGuid: `Software Catagory Connection GUID ${index}`,
          softwareVendorConnectionGuid: `Software Vendor Connection GUID ${index}`,
          softwareCost: 'about $3.50',
          softwareElaOrganization: 'ELA Organization',
          softwareName: `Software Product ${index}`,
          systemSoftwareConnectionGuid: `System Software Connection GUID ${index}`,
          technopediaCategory: '',
          technopediaID: `Technopedia ID ${index}`,
          vendorName: '',
          __typename: 'CedarSoftwareProductItem'
        };
      });
  }

  it(`doesn't show toggles for all sections`, () => {
    // Doesn't show the button expand toggle at cap
    const data = getMockSystemProfileData(result.data);
    const { queryAllByRole } = render(<ToolsAndSoftware system={data} />);
    expect(queryAllByRole('button', buttonExpandToggleMatchOpt)).toHaveLength(
      0
    );
  });

  it(`section init collapsed & expands`, async () => {
    const res = cloneDeep(result.data);

    // Fill more members than the cap
    const total = TOOLS_AND_SOFTWARE_PRODUCT_COUNT_CAP + 2;
    res.cedarSoftwareProducts!.softwareProducts = fillSoftwareProducts(total);
    const data = getMockSystemProfileData(res);
    const { getByRole, getAllByTestId } = render(
      <ToolsAndSoftware system={data} />
    );

    // Check count when collapsed
    expect(getAllByTestId('software-product-card')).toHaveLength(
      TOOLS_AND_SOFTWARE_PRODUCT_COUNT_CAP
    );

    // Toggle expand
    fireEvent.click(getByRole('button', buttonExpandToggleMatchOpt));
    await waitFor(() => {
      expect(
        getByRole('button', { name: /view fewer software products/i })
      ).toBeInTheDocument();
    });

    // Expanded count
    expect(getAllByTestId('software-product-card')).toHaveLength(total);
  });
});
