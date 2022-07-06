import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import {
  fireEvent,
  render,
  waitFor,
  waitForElementToBeRemoved
} from '@testing-library/react';
import { clone, cloneDeep } from 'lodash';
import { DateTime } from 'luxon';

import { ATO_STATUS_DUE_SOON_DAYS } from 'constants/systemProfile';
import {
  getMockPersonRole,
  getMockSystemProfileData,
  query,
  result
} from 'data/mock/systemProfile';
// eslint-disable-next-line camelcase
import { GetSystemProfile_cedarSystemDetails_roles } from 'queries/types/GetSystemProfile';
import { RoleTypeId, SubpageKey } from 'types/systemProfile';

import SystemProfile, { getAtoStatus } from './index';
import pointsOfContactIds from './pointsOfContactIds';
import { getSubpagePoc } from './PointsOfContactSidebar';

describe('System Profile parent request', () => {
  it('matches snapshot', async () => {
    const { asFragment, getByText, getAllByText, getByTestId } = render(
      <MemoryRouter initialEntries={['/systems/000-100-0/home']}>
        <Route path="/systems/:systemId/:subinfo">
          <MockedProvider mocks={[query]} addTypename={false}>
            <SystemProfile />
          </MockedProvider>
        </Route>
      </MemoryRouter>
    );
    await waitForElementToBeRemoved(() => getByTestId('page-loading'));
    expect(asFragment()).toMatchSnapshot();
    expect(getByText('CMS.gov')).toBeInTheDocument();
    expect(getAllByText('Jane Doe')[0]).toBeInTheDocument();
  });
});

describe('System profile description is expandable', () => {
  beforeEach(() => {
    // Fill in heights for description text element
    // https://github.com/testing-library/react-testing-library/issues/353
    const el = HTMLElement.prototype;
    Object.defineProperty(el, 'offsetHeight', {
      configurable: true,
      value: 300
    });
    Object.defineProperty(el, 'scrollHeight', {
      configurable: true,
      value: 400
    });
  });

  it('shows read more & less', async () => {
    const { getByText, findByTestId } = render(
      <MemoryRouter initialEntries={['/systems/000-100-0/home']}>
        <Route path="/systems/:systemId/:subinfo">
          <MockedProvider mocks={[query]} addTypename={false}>
            <SystemProfile />
          </MockedProvider>
        </Route>
      </MemoryRouter>
    );

    const loading = await findByTestId('page-loading');
    await waitFor(() => {
      expect(loading).not.toBeInTheDocument();
    });

    const readMore = getByText(/read more/i);
    await waitFor(() => {
      expect(readMore).toBeInTheDocument();
    });

    fireEvent.click(readMore);

    await waitFor(() => {
      expect(getByText(/read less/i)).toBeInTheDocument();
    });
  });
});

describe('System Profile ATO Status', () => {
  test('output "No ATO" on missing cedarAuthorityToOperate', () => {
    expect(getAtoStatus(undefined)).toBe('No ATO');
  });

  test('output "No ATO" on missing cedarAuthorityToOperate.dateAuthorizationMemoExpires', () => {
    const cedarAto = clone(result.data.cedarAuthorityToOperate[0]);

    cedarAto.dateAuthorizationMemoExpires = '';
    expect(getAtoStatus(cedarAto)).toBe('No ATO');

    cedarAto.dateAuthorizationMemoExpires = null;
    expect(getAtoStatus(cedarAto)).toBe('No ATO');
  });

  test.each([
    { status: 'Expired', dt: DateTime.utc().minus({ days: 1 }) },
    {
      status: 'Due Soon',
      dt: DateTime.utc().plus({ days: ATO_STATUS_DUE_SOON_DAYS })
    },
    {
      status: 'Active',
      dt: DateTime.utc().plus({ days: ATO_STATUS_DUE_SOON_DAYS + 1 })
    }
  ])('output based on current date %j', ({ status, dt }) => {
    const cedarAto = clone(result.data.cedarAuthorityToOperate[0]);
    cedarAto.dateAuthorizationMemoExpires = dt.toString();
    expect(getAtoStatus(cedarAto)).toBe(status);
  });
});

describe('System Profile Points of Contact by subpage', () => {
  const resultdata = cloneDeep(result.data);

  // Reassign 1 person per Cedar Role Type
  resultdata.cedarSystemDetails!.roles = Object.values(
    RoleTypeId
    // eslint-disable-next-line camelcase
  ).map<GetSystemProfile_cedarSystemDetails_roles>((roleTypeID, idx) =>
    getMockPersonRole({
      assigneeUsername: `ABC${idx}`,
      roleTypeID
    })
  );

  const data = getMockSystemProfileData(resultdata);

  test.each(
    Object.keys(pointsOfContactIds).map(subpage => subpage as SubpageKey)
  )('poc set is of the first matching role type for %s', subpage => {
    const allowedSubpagePocIds = pointsOfContactIds[subpage];
    const contacts = getSubpagePoc(subpage, data.usernamesWithRoles);

    // Collect all contacts matching all poc ids for the subpage
    const received = allowedSubpagePocIds.filter(pocid => {
      return contacts.every(contact =>
        contact.roles.some(r => r.roleTypeID === pocid)
      );
    });

    // The set of contacts are all of the same role type as allowed in the poc list
    expect(received).toHaveLength(1);
    // It is the first from the priority list
    expect(received[0]).toEqual(allowedSubpagePocIds[0]);
  });
});
