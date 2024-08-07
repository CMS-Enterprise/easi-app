import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, within } from '@testing-library/react';
import { ModalRef } from '@trussworks/react-uswds';

import {
  getTRBRequestAttendeesQuery,
  getTrbRequestQuery,
  requester,
  trbRequestSummary
} from 'data/mock/trbRequest';
import { TrbRequestIdRef } from 'types/technicalAssistance';
import easiMockStore from 'utils/testing/easiMockStore';
import { mockTrbRequestId } from 'utils/testing/MockTrbAttendees';

import Summary from '.';

const defaultStore = easiMockStore({
  euaUserId: 'SF13',
  groups: ['EASI_TRB_ADMIN_D']
});

describe('TRB Admin Home summary', () => {
  const modalRef = React.createRef<ModalRef>();
  const trbRequestIdRef = React.createRef<TrbRequestIdRef>();

  it('renders TRB request details', async () => {
    const { asFragment, findByTestId, getByTestId } = render(
      <MemoryRouter>
        <MockedProvider
          mocks={[getTrbRequestQuery, getTRBRequestAttendeesQuery]}
        >
          <Provider store={defaultStore}>
            <Summary
              trbRequestId={mockTrbRequestId}
              name={trbRequestSummary.name || 'Draft'}
              requestType={trbRequestSummary.type}
              state={trbRequestSummary.state}
              taskStatus={trbRequestSummary.status}
              trbLead={trbRequestSummary.trbLeadInfo.commonName}
              requester={requester}
              requesterString="Adeline Aarons, CMS"
              submissionDate="January 5, 2023"
              assignLeadModalRef={modalRef}
              assignLeadModalTrbRequestIdRef={trbRequestIdRef}
              contractName={trbRequestSummary.contractName}
              relationType={trbRequestSummary.relationType}
              systems={trbRequestSummary.systems}
            />
          </Provider>
        </MockedProvider>
      </MemoryRouter>
    );

    /** Formatted requester string */
    const requesterString = await findByTestId(
      `trbSummary-requester_${requester?.userInfo?.euaUserId}`
    );

    // Check that requester shows correct name and component acronym
    expect(requesterString).toHaveTextContent('Adeline Aarons, CMS');

    // Check that submission date is formatted correctly
    expect(getByTestId('trbSummary-submissionDate')).toHaveTextContent(
      'January 5, 2023'
    );

    // Check that correct task status is rendered
    expect(getByTestId('trbSummary-status')).toHaveTextContent(
      'Draft request form'
    );

    /** TRB Lead container */
    const trbLeadContainer = getByTestId('trbSummary-trbLead');

    // Check that TRB lead shows as not assigned
    expect(within(trbLeadContainer).getByText('Not assigned'));

    // Check that assign button is rendered
    expect(within(trbLeadContainer).getByRole('button', { name: 'Assign' }));

    // Snapshot
    expect(asFragment()).toMatchSnapshot();
  });
});
