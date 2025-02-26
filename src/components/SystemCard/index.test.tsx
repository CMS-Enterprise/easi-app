import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render } from '@testing-library/react';
import { SystemIntakeFragmentFragment } from 'gql/generated/graphql';

import SystemCardTable from './table';
import SystemCard, { SystemCardProps } from '.';

const system: SystemCardProps = {
  id: '123',
  name: 'System Overload',
  description: 'An awesome system',
  acronym: 'SO',
  businessOwnerOrg: 'Oddball',
  businessOwners: 'John Doe'
};

const systems: SystemIntakeFragmentFragment['systems'] = [
  {
    __typename: 'CedarSystem',
    id: '123',
    name: 'Large system',
    description: 'An big system',
    acronym: 'LS',
    businessOwnerOrg: 'Oddball',
    businessOwnerRoles: [
      {
        __typename: 'CedarRole',
        objectID: '9787620',
        assigneeFirstName: 'John',
        assigneeLastName: 'Doe'
      }
    ]
  },
  {
    __typename: 'CedarSystem',
    id: '456',
    name: 'Small system',
    description: 'An tiny system',
    acronym: 'SS',
    businessOwnerOrg: 'Oddball',
    businessOwnerRoles: [
      {
        __typename: 'CedarRole',
        objectID: '9787620',
        assigneeFirstName: 'John',
        assigneeLastName: 'Doe'
      }
    ]
  }
];

describe('System Card Componenet', () => {
  it('display correct information', async () => {
    const { getByText } = render(
      <MemoryRouter
        initialEntries={[
          '/it-governance/a5689bec-e4cf-4f2b-a7de-72020e8d65be/additional-information'
        ]}
      >
        <SystemCard
          id={system.id}
          name={system.name}
          description={system.description}
          acronym={system.acronym}
          businessOwnerOrg={system.businessOwnerOrg}
          businessOwners={system.businessOwners}
        />
      </MemoryRouter>
    );

    expect(getByText('System Overload')).toBeInTheDocument();
    expect(getByText('An awesome system')).toBeInTheDocument();
    expect(getByText('SO')).toBeInTheDocument();
    expect(getByText('Oddball')).toBeInTheDocument();
    expect(getByText('John Doe')).toBeInTheDocument();
  });

  it('display correct table information and pagination', async () => {
    const { getByText, getByTestId } = render(
      <MemoryRouter
        initialEntries={[
          '/it-governance/a5689bec-e4cf-4f2b-a7de-72020e8d65be/additional-information'
        ]}
      >
        <SystemCardTable systems={systems} />
      </MemoryRouter>
    );

    expect(getByText('Large system')).toBeInTheDocument();

    // Checks if pagination is rendered on more than one system
    expect(getByTestId('table-pagination')).toBeInTheDocument();
  });

  it('display correct table information and no pagination', async () => {
    const { getByText, queryAllByTestId } = render(
      <MemoryRouter
        initialEntries={[
          '/it-governance/a5689bec-e4cf-4f2b-a7de-72020e8d65be/additional-information'
        ]}
      >
        {' '}
        <SystemCardTable systems={[systems[0]]} />{' '}
      </MemoryRouter>
    );

    expect(getByText('Large system')).toBeInTheDocument();

    // Checks that pagination is not rendered with only one system
    expect(queryAllByTestId('table-pagination')).toEqual([]);
  });

  it('matches snapshot', async () => {
    const { asFragment } = render(
      <MemoryRouter
        initialEntries={[
          '/it-governance/a5689bec-e4cf-4f2b-a7de-72020e8d65be/additional-information'
        ]}
      >
        {' '}
        <SystemCard
          id={system.id}
          name={system.name}
          description={system.description}
          acronym={system.acronym}
          businessOwnerOrg={system.businessOwnerOrg}
          businessOwners={system.businessOwners}
        />
      </MemoryRouter>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
