import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, waitForElementToBeRemoved } from '@testing-library/react';

import GetCedarSystemQuery from 'queries/GetCedarSystemQuery';

import SystemInformationCard from './SystemInformationCard';

const cedarSystemQuery = {
  request: {
    query: GetCedarSystemQuery,
    variables: {
      id: '000-0000-1'
    }
  },
  result: {
    data: {
      cedarSystem: {
        id: '000-0000-1',
        name: 'CMS Operations Information Network',
        description:
          'COIN’s goal is to be the secure, role-based single-source provider of business operations data brought together from CMS systems into one easy-to-use interface for stakeholders to drive business decisions. COIN is operated jointly by OSPR and OIT.',
        acronym: 'COIN',
        status: '',
        businessOwnerOrg: '',
        businessOwnerOrgComp: '',
        systemMaintainerOrg: '',
        systemMaintainerOrgComp: ''
      }
    }
  }
};

function renderSystemInformationCard(query: any) {
  return render(
    <MemoryRouter initialEntries={['/508/requests/000-0000-1/cedar-system']}>
      <MockedProvider mocks={[query]}>
        <SystemInformationCard
          cedarSystemId="000-0000-1"
          bookmarked={false}
          toggleCedarSystemBookmark={() => {}}
        />
      </MockedProvider>
    </MemoryRouter>
  );
}

describe('SystemInformationCard', () => {
  it('renders after request', async () => {
    const { asFragment, getByTestId } = renderSystemInformationCard(
      cedarSystemQuery
    );

    await waitForElementToBeRemoved(() => getByTestId('cedar-system-loading'));

    expect(asFragment()).toMatchSnapshot();
  });

  it('renders an error on request fail', async () => {
    const queryError = {
      request: cedarSystemQuery.request,
      error: new Error('bad request')
    };
    const { getByTestId } = renderSystemInformationCard(queryError);

    await waitForElementToBeRemoved(() => getByTestId('cedar-system-loading'));

    expect(getByTestId('alert')).toMatchSnapshot();
  });
});
