import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { GetTRBAdminHomeDocument } from 'gql/generated/graphql';
import i18next from 'i18next';
import {
  getTrbAdminTeamHomeQuery,
  getTrbLeadOptionsQuery,
  trbAdminTeamHomeRequests
} from 'tests/mock/trbRequest';

import { MessageProvider } from 'hooks/useMessage';
import easiMockStore from 'utils/testing/easiMockStore';

import TrbAdminTeamHome, {
  getTrbRequestDataAsCsv,
  trbRequestsCsvHeader
} from '.';

// This test file was originally set up to target values based on the default sort of submission dates
// As requirements change, tests are updated to target values based on new row positions while leaving the original mock data

describe('Trb Admin Team Home', () => {
  const store = easiMockStore({ euaUserId: 'SF13' });

  it('parses csv data from trb request data', () => {
    const csv = getTrbRequestDataAsCsv(trbAdminTeamHomeRequests);
    expect(csv).toEqual([
      trbRequestsCsvHeader,
      [
        '03/01/2023',
        'First help',
        trbAdminTeamHomeRequests[0].requesterInfo.commonName,
        'System problem',
        '',
        i18next.t<string>('technicalAssistance:table.requestStatus.NEW'),
        '',
        'Word',
        '24, 13',
        'Quality team, Management service'
      ],
      [
        '03/02/2023',
        'Second brainstorm',
        trbAdminTeamHomeRequests[1].requesterInfo.commonName,
        'Idea feedback',
        '',
        i18next.t<string>('technicalAssistance:table.requestStatus.NEW'),
        '',
        '',
        '',
        ''
      ],
      [
        '03/03/2023',
        'Third open',
        trbAdminTeamHomeRequests[2].requesterInfo.commonName,
        'System problem',
        `${trbAdminTeamHomeRequests[2].trbLeadInfo.commonName}, TRB`,
        i18next.t<string>(
          'technicalAssistance:table.requestStatus.DRAFT_REQUEST_FORM'
        ),
        '',
        '',
        '',
        ''
      ],
      [
        '03/04/2023',
        'Fourth open with date',
        trbAdminTeamHomeRequests[3].requesterInfo.commonName,
        'System problem',
        `${trbAdminTeamHomeRequests[3].trbLeadInfo.commonName}, TRB`,
        i18next.t<string>(
          'technicalAssistance:table.requestStatus.REQUEST_FORM_COMPLETE'
        ),
        '04/01/2023',
        '',
        '',
        ''
      ],
      [
        '03/05/2023',
        'Fifth closed',
        trbAdminTeamHomeRequests[4].requesterInfo.commonName,
        'System problem',
        `${trbAdminTeamHomeRequests[4].trbLeadInfo.commonName}, TRB`,
        i18next.t<string>(
          'technicalAssistance:table.requestStatus.READY_FOR_CONSULT'
        ),
        '04/02/2023',
        '',
        '',
        ''
      ],
      [
        '03/06/2023',
        'Sixth open with component',
        `${trbAdminTeamHomeRequests[5].requesterInfo.commonName}, ${trbAdminTeamHomeRequests[5].requesterComponent}`,
        'System problem',
        `${trbAdminTeamHomeRequests[5].trbLeadInfo.commonName}, TRB`,
        i18next.t<string>(
          'technicalAssistance:table.requestStatus.CONSULT_SCHEDULED'
        ),
        '04/02/2023',
        '',
        '',
        ''
      ]
    ]);
  });

  it('renders empty tables with without any request data', async () => {
    const { getByText, findByText } = render(
      <Provider store={store}>
        <MemoryRouter>
          <MockedProvider
            mocks={[
              {
                request: { query: GetTRBAdminHomeDocument, variables: {} },
                result: { data: { trbRequests: [] } }
              },
              getTrbLeadOptionsQuery
            ]}
          >
            <MessageProvider>
              <TrbAdminTeamHome />
            </MessageProvider>
          </MockedProvider>
        </MemoryRouter>
      </Provider>
    );

    await findByText(
      i18next.t<string>(
        'technicalAssistance:adminTeamHome.newRequests.noRequests'
      )
    );

    getByText(
      i18next.t<string>(
        'technicalAssistance:adminTeamHome.existingRequests.noRequests.open'
      )
    );
  });

  it('renders tables from request data', async () => {
    const { findByRole } = render(
      <Provider store={store}>
        <MemoryRouter>
          <MockedProvider
            mocks={[getTrbAdminTeamHomeQuery, getTrbLeadOptionsQuery]}
          >
            <MessageProvider>
              <TrbAdminTeamHome />
            </MessageProvider>
          </MockedProvider>
        </MemoryRouter>
      </Provider>
    );

    // Page actions available
    await findByRole('button', {
      name: i18next.t<string>(
        'technicalAssistance:adminTeamHome.jumpToExistingRequests'
      )
    });
    await findByRole('link', {
      name: i18next.t<string>(
        'technicalAssistance:adminTeamHome.downloadAllTrbRequests'
      )
    });
    await findByRole('link', {
      name: i18next.t<string>(
        'technicalAssistance:adminTeamHome.submitYourOwnRequest'
      )
    });

    // Table csv download links
    await findByRole('link', {
      name: i18next.t<string>(
        'technicalAssistance:adminTeamHome.newRequests.downloadCsv'
      )
    });
    await findByRole('link', {
      name: i18next.t<string>(
        'technicalAssistance:adminTeamHome.existingRequests.downloadCsv'
      )
    });
  });

  it('renders table cells and states correctly', async () => {
    const { findByTestId } = render(
      <Provider store={store}>
        <MemoryRouter>
          <MockedProvider
            mocks={[getTrbAdminTeamHomeQuery, getTrbLeadOptionsQuery]}
          >
            <MessageProvider>
              <TrbAdminTeamHome />
            </MessageProvider>
          </MockedProvider>
        </MemoryRouter>
      </Provider>
    );

    // Default sort order on Submission date desc
    expect(await findByTestId('trb-new-cell-0-0')).toHaveTextContent(
      '03/02/2023'
    );
    expect(await findByTestId('trb-new-cell-1-0')).toHaveTextContent(
      '03/01/2023'
    );

    // Default sort order on Consult Dates
    expect(await findByTestId('trb-existing-cell-0-0')).toHaveTextContent(
      '03/03/2023'
    );
    expect(await findByTestId('trb-existing-cell-0-5')).toHaveTextContent(
      'Add date'
    );
    expect(await findByTestId('trb-existing-cell-2-0')).toHaveTextContent(
      '03/01/2023'
    );
    expect(await findByTestId('trb-existing-cell-2-5')).toHaveTextContent(
      'Add date'
    );

    expect(await findByTestId('trb-existing-cell-3-0')).toHaveTextContent(
      '03/06/2023'
    );
    expect(await findByTestId('trb-existing-cell-3-5')).toHaveTextContent(
      '04/02/2023'
    );
    expect(await findByTestId('trb-existing-cell-4-0')).toHaveTextContent(
      '03/04/2023'
    );
    expect(await findByTestId('trb-existing-cell-4-5')).toHaveTextContent(
      '04/01/2023'
    );

    // New Requests table

    // Request Name col request link
    within(await findByTestId('trb-new-cell-0-1')).getByRole('link', {
      name: 'Second brainstorm'
    });

    // Request type
    expect(await findByTestId('trb-new-cell-1-3')).toHaveTextContent(
      i18next.t<string>('technicalAssistance:table.requestTypes.NEED_HELP')
    );

    // Requester without component
    expect(await findByTestId('trb-new-cell-1-2')).toHaveTextContent(
      trbAdminTeamHomeRequests[0].requesterInfo.commonName
    );

    // Action links column of new requests
    within(await findByTestId('trb-new-cell-1-4')).getByRole('button', {
      name: i18next.t<string>(
        'technicalAssistance:adminTeamHome.actions.assignLead'
      )
    });

    // Existing requests
    // TRB Lead with Component
    expect(await findByTestId('trb-existing-cell-3-3')).toHaveTextContent(
      `${trbAdminTeamHomeRequests[5].trbLeadInfo.commonName}, TRB`
    );
    // TRB consult date
    expect(await findByTestId('trb-existing-cell-3-5')).toHaveTextContent(
      '04/02/2023'
    );
    // Add consult date
    within(await findByTestId('trb-existing-cell-2-5')).getByRole('link', {
      name: i18next.t<string>(
        'technicalAssistance:adminTeamHome.actions.addDate'
      )
    });
    // Request status text
    expect(await findByTestId('trb-existing-cell-3-4')).toHaveTextContent(
      i18next.t<string>(
        'technicalAssistance:table.requestStatus.CONSULT_SCHEDULED'
      )
    );
  });

  it('switches table data between open and closed tabs', async () => {
    const { findByRole, findByTestId } = render(
      <Provider store={store}>
        <MemoryRouter>
          <MockedProvider
            mocks={[getTrbAdminTeamHomeQuery, getTrbLeadOptionsQuery]}
          >
            <MessageProvider>
              <TrbAdminTeamHome />
            </MessageProvider>
          </MockedProvider>
        </MemoryRouter>
      </Provider>
    );

    const open = await findByRole('button', {
      name: i18next.t<string>(
        'technicalAssistance:adminTeamHome.existingRequests.tabs.open.name'
      )
    });
    const closed = await findByRole('button', {
      name: i18next.t<string>(
        'technicalAssistance:adminTeamHome.existingRequests.tabs.closed.name'
      )
    });

    // Defaults to open tab
    expect(open.closest('.easi-request-repo__tab')).toHaveClass(
      'easi-request-repo__tab--active'
    );
    expect(closed.closest('.easi-request-repo__tab')).not.toHaveClass(
      'easi-request-repo__tab--active'
    );

    // Check open table contents
    expect(await findByTestId('trb-existing-cell-2-1')).toHaveTextContent(
      'First help'
    );

    // Switch to closed
    userEvent.click(closed);

    expect(open.closest('.easi-request-repo__tab')).not.toHaveClass(
      'easi-request-repo__tab--active'
    );
    expect(closed.closest('.easi-request-repo__tab')).toHaveClass(
      'easi-request-repo__tab--active'
    );

    // Check closed contents
    expect(await findByTestId('trb-existing-cell-0-1')).toHaveTextContent(
      'Fifth closed'
    );

    // Back to open
    userEvent.click(open);
    expect(await findByTestId('trb-existing-cell-1-1')).toHaveTextContent(
      'Second brainstorm'
    );
  });
});
