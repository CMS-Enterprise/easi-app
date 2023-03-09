import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { MockedProvider } from '@apollo/react-testing';
import { render, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import i18next from 'i18next';

import { trbAdminTeamHomeRequests } from 'data/mock/trbRequest';
import GetTrbAdminTeamHomeQuery from 'queries/GetTrbAdminTeamHomeQuery';

import TrbAdminTeamHome, {
  getTrbRequestDataAsCsv,
  trbRequestsCsvHeader
} from './TrbAdminTeamHome';

describe('Trb Admin Team Home', () => {
  it('parses csv data from trb request data', () => {
    const csv = getTrbRequestDataAsCsv(trbAdminTeamHomeRequests);
    expect(csv).toEqual([
      trbRequestsCsvHeader,
      [
        '03/01/2023',
        'First help',
        'Wava Upton',
        'System problem',
        '',
        i18next.t<string>('technicalAssistance:table.requestStatus.NEW'),
        ''
      ],
      [
        '03/02/2023',
        'Second brainstorm',
        'Derick Koss',
        'Idea feedback',
        '',
        i18next.t<string>('technicalAssistance:table.requestStatus.NEW'),
        ''
      ],
      [
        '03/03/2023',
        'Third open',
        'Loraine Kirlin',
        'System problem',
        'Astrid Howell',
        i18next.t<string>(
          'technicalAssistance:table.requestStatus.DRAFT_REQUEST_FORM'
        ),
        ''
      ],
      [
        '03/04/2023',
        'Fourth open with date',
        'Clotilde Goodwin',
        'System problem',
        'Polly Sauer',
        i18next.t<string>(
          'technicalAssistance:table.requestStatus.REQUEST_FORM_COMPLETE'
        ),
        '04/01/2023'
      ],
      [
        '03/05/2023',
        'Fifth closed',
        'Sylvester Mante',
        'System problem',
        'Sydni Reynolds',
        i18next.t<string>(
          'technicalAssistance:table.requestStatus.READY_FOR_CONSULT'
        ),
        '04/02/2023'
      ],
      [
        '03/06/2023',
        'Sixth open with component',
        'Damaris Langosh, BBQ',
        'System problem',
        'Hosea Lemke, TRB',
        i18next.t<string>(
          'technicalAssistance:table.requestStatus.CONSULT_SCHEDULED'
        ),
        '04/02/2023'
      ]
    ]);
  });

  it('renders empty tables with without any request data', async () => {
    const { getByText, findByText } = render(
      <MemoryRouter>
        <MockedProvider
          mocks={[
            {
              request: { query: GetTrbAdminTeamHomeQuery, variables: {} },
              result: { data: { trbRequests: [] } }
            }
          ]}
        >
          <TrbAdminTeamHome />
        </MockedProvider>
      </MemoryRouter>
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
      <MemoryRouter>
        <MockedProvider
          mocks={[
            {
              request: { query: GetTrbAdminTeamHomeQuery, variables: {} },
              result: { data: { trbRequests: trbAdminTeamHomeRequests } }
            }
          ]}
        >
          <TrbAdminTeamHome />
        </MockedProvider>
      </MemoryRouter>
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
      <MemoryRouter>
        <MockedProvider
          mocks={[
            {
              request: { query: GetTrbAdminTeamHomeQuery, variables: {} },
              result: { data: { trbRequests: trbAdminTeamHomeRequests } }
            }
          ]}
        >
          <TrbAdminTeamHome />
        </MockedProvider>
      </MemoryRouter>
    );

    // Default sort order on Submission Date desc
    expect(await findByTestId('trb-new-cell-0-0')).toHaveTextContent(
      '03/02/2023'
    );
    expect(await findByTestId('trb-new-cell-1-0')).toHaveTextContent(
      '03/01/2023'
    );
    expect(await findByTestId('trb-existing-cell-0-0')).toHaveTextContent(
      '03/06/2023'
    );
    expect(await findByTestId('trb-existing-cell-1-0')).toHaveTextContent(
      '03/04/2023'
    );
    expect(await findByTestId('trb-existing-cell-2-0')).toHaveTextContent(
      '03/03/2023'
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
      'Wava Upton'
    );

    // Action links column of new requests
    within(await findByTestId('trb-new-cell-1-4')).getByRole('link', {
      name: i18next.t<string>(
        'technicalAssistance:adminTeamHome.actions.reviewRequest'
      )
    });
    within(await findByTestId('trb-new-cell-1-4')).getByRole('button', {
      name: i18next.t<string>(
        'technicalAssistance:adminTeamHome.actions.assignLead'
      )
    });

    // Existing requests
    // TRB Lead with Component
    expect(await findByTestId('trb-existing-cell-0-3')).toHaveTextContent(
      'Hosea Lemke, TRB'
    );
    // TRB consult date
    expect(await findByTestId('trb-existing-cell-0-5')).toHaveTextContent(
      '04/02/2023'
    );
    // Add consult date
    within(await findByTestId('trb-existing-cell-2-5')).getByRole('link', {
      name: i18next.t<string>(
        'technicalAssistance:adminTeamHome.actions.addDate'
      )
    });
    // Request status text
    expect(await findByTestId('trb-existing-cell-0-4')).toHaveTextContent(
      i18next.t<string>(
        'technicalAssistance:table.requestStatus.CONSULT_SCHEDULED'
      )
    );
  });

  it('switches table data between open and closed tabs', async () => {
    const { findByRole, findByTestId } = render(
      <MemoryRouter>
        <MockedProvider
          mocks={[
            {
              request: { query: GetTrbAdminTeamHomeQuery, variables: {} },
              result: { data: { trbRequests: trbAdminTeamHomeRequests } }
            }
          ]}
        >
          <TrbAdminTeamHome />
        </MockedProvider>
      </MemoryRouter>
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
      'Third open'
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
      'Fourth open with date'
    );
  });
});
