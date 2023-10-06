import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { systemIntakeForTable } from 'data/mock/systemIntake';
import {
  getRequestsQuery,
  getTrbAdminTeamHomeQuery
} from 'data/mock/trbRequest';
import { MessageProvider } from 'hooks/useMessage';
import GetCedarSystemBookmarksQuery from 'queries/GetCedarSystemBookmarksQuery';
import GetCedarSystemsQuery from 'queries/GetCedarSystemsQuery';
import GetSystemIntakesTableQuery from 'queries/GetSystemIntakesTableQuery';
import {
  GetSystemIntakesTable,
  GetSystemIntakesTable_systemIntakes as SystemIntake
} from 'queries/types/GetSystemIntakesTable';
import { SystemIntakeState } from 'types/graphql-global-types';
import { MockedQuery } from 'types/util';
import easiMockStore from 'utils/testing/easiMockStore';
import VerboseMockedProvider from 'utils/testing/VerboseMockedProvider';

import AdminHome from './AdminHome';
import Home from './index';

const adminStore = easiMockStore({
  groups: ['EASI_D_GOVTEAM']
});
const userStore = easiMockStore({ groups: ['EASI_P_USER'] });

const mockOpenIntakes: SystemIntake[] = [
  systemIntakeForTable,
  { ...systemIntakeForTable, id: '2' }
];

const mockClosedIntakes: SystemIntake[] = [
  { ...systemIntakeForTable, id: '3', state: SystemIntakeState.CLOSED },
  { ...systemIntakeForTable, id: '4', state: SystemIntakeState.CLOSED },
  { ...systemIntakeForTable, id: '5', state: SystemIntakeState.CLOSED }
];

const getSystemIntakesTable: MockedQuery<GetSystemIntakesTable> = {
  request: {
    query: GetSystemIntakesTableQuery,
    variables: {}
  },
  result: {
    data: {
      systemIntakes: [...mockOpenIntakes, ...mockClosedIntakes]
    }
  }
};

const mocks = [
  getRequestsQuery([], []),
  getSystemIntakesTable,
  {
    request: {
      query: GetCedarSystemsQuery
    },
    result: {
      data: {
        cedarSystems: []
      }
    }
  },
  {
    request: {
      query: GetCedarSystemBookmarksQuery
    },
    result: {
      data: {
        cedarSystemBookmarks: []
      }
    }
  }
];

describe('The home page', () => {
  describe('not a grt review user', () => {
    it('displays process options', async () => {
      render(
        <MemoryRouter initialEntries={['/']} initialIndex={0}>
          <MockedProvider mocks={mocks}>
            <Provider store={userStore}>
              <MessageProvider>
                <Home />
              </MessageProvider>
            </Provider>
          </MockedProvider>
        </MemoryRouter>
      );

      expect(screen.getByRole('heading', { name: 'IT Governance' }));
      expect(screen.getByRole('heading', { name: 'Section 508' }));

      expect(screen.getByRole('heading', { name: 'My requests' }));
      expect(screen.getByRole('heading', { name: 'All systems' }));
    });
  });

  describe('is a grt reviewer', () => {
    it('renders the open and closed requests', async () => {
      render(
        <MemoryRouter initialEntries={['/']} initialIndex={0}>
          <MockedProvider mocks={mocks}>
            <Provider store={adminStore}>
              <MessageProvider>
                <Home />
              </MessageProvider>
            </Provider>
          </MockedProvider>
        </MemoryRouter>
      );
      // Check open requests count
      expect(
        await screen.findByText(
          `There are ${mockOpenIntakes.length} open requests`
        )
      );

      // Switch to closed requests tab
      const closedTab = await screen.findByRole('button', {
        name: 'Closed requests'
      });
      userEvent.click(closedTab);

      // Check closed requests count
      expect(
        await screen.findByText(
          `There are ${mockClosedIntakes.length} closed requests`
        )
      );
    });

    it('renders the select admin view dropdown', async () => {
      window.localStorage.clear();

      const { getByTestId, getByRole, findByRole } = render(
        <MemoryRouter>
          <Provider store={adminStore}>
            <VerboseMockedProvider mocks={[...mocks, getTrbAdminTeamHomeQuery]}>
              <MessageProvider>
                <AdminHome isGrtReviewer isTrbAdmin />
              </MessageProvider>
            </VerboseMockedProvider>
          </Provider>
        </MemoryRouter>
      );

      // check that select field defaults to TRB
      const selectField = getByTestId('select-admin-view');
      expect(selectField).toHaveValue('TRB');
      expect(
        getByRole('heading', { name: 'Technical assistance requests' })
      ).toBeInTheDocument();

      // Switch to GRT view
      userEvent.selectOptions(selectField, ['GRT']);
      await findByRole('heading', { name: 'IT Governance requests' });
    });
  });
});
