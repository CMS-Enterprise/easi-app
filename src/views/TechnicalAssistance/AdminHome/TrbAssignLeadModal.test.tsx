import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ModalRef } from '@trussworks/react-uswds';
import i18next from 'i18next';

import { getTrbLeadOptionsQuery, trbLeadOptions } from 'data/mock/trbRequest';
import useMessage, { MessageProvider } from 'hooks/useMessage';
import {
  UpdateTrbRequestLead,
  UpdateTrbRequestLeadVariables
} from 'queries/types/UpdateTrbRequestLead';
import UpdateTrbRequestLeadQuery from 'queries/UpdateTrbRequestLeadQuery';
import { TrbRequestIdRef } from 'types/technicalAssistance';
import { MockedQuery } from 'types/util';
import easiMockStore from 'utils/testing/easiMockStore';
import { mockTrbRequestId } from 'utils/testing/MockTrbAttendees';

import TrbAssignLeadModal, {
  TrbAssignLeadModalOpener
} from './TrbAssignLeadModal';

function MockMessage() {
  const { Message } = useMessage();
  return <Message />;
}

const trbLeadInfo = trbLeadOptions[0];

const updateTrbRequestLeadQuery: MockedQuery<
  UpdateTrbRequestLead,
  UpdateTrbRequestLeadVariables
> = {
  request: {
    query: UpdateTrbRequestLeadQuery,
    variables: {
      input: {
        trbRequestId: mockTrbRequestId,
        trbLead: trbLeadInfo.euaUserId
      }
    }
  },
  result: {
    data: {
      updateTRBRequestTRBLead: {
        id: mockTrbRequestId,
        trbLead: trbLeadInfo.euaUserId,
        trbLeadInfo,
        __typename: 'TRBRequest'
      }
    }
  }
};

describe('TrbAssignLeadModal', () => {
  const store = easiMockStore({ euaUserId: trbLeadInfo.euaUserId });

  it('opens and lists trb members', async () => {
    const modalRef = React.createRef<ModalRef>();
    const trbRequestIdRef = React.createRef<TrbRequestIdRef>();

    const { findByText, getByRole } = render(
      <>
        <Provider store={store}>
          <MockedProvider mocks={[getTrbLeadOptionsQuery]}>
            <MemoryRouter>
              <MessageProvider>
                <TrbAssignLeadModalOpener
                  trbRequestId={mockTrbRequestId}
                  modalRef={modalRef}
                  trbRequestIdRef={trbRequestIdRef}
                  className="usa-button--unstyled"
                >
                  {i18next.t<string>(
                    'technicalAssistance:adminHome.assignLead'
                  )}
                </TrbAssignLeadModalOpener>
                <TrbAssignLeadModal
                  modalRef={modalRef}
                  trbRequestIdRef={trbRequestIdRef}
                />
              </MessageProvider>
            </MemoryRouter>
          </MockedProvider>
        </Provider>
      </>
    );

    const open = getByRole('button', {
      name: i18next.t<string>('technicalAssistance:adminHome.assignLead')
    });

    userEvent.click(open);

    await findByText(
      i18next.t<string>('technicalAssistance:assignTrbLeadModal.heading')
    );

    await findByText('Gary Gordon');
  });

  it('assigns a trb lead to myself successfully', async () => {
    const modalRef = React.createRef<ModalRef>();
    const trbRequestIdRef = React.createRef<TrbRequestIdRef>();

    const { findByText, getByRole, getByTestId } = render(
      <Provider store={store}>
        <MockedProvider
          mocks={[getTrbLeadOptionsQuery, updateTrbRequestLeadQuery]}
        >
          <MemoryRouter>
            <MessageProvider>
              <MockMessage />
              <TrbAssignLeadModalOpener
                trbRequestId={mockTrbRequestId}
                modalRef={modalRef}
                trbRequestIdRef={trbRequestIdRef}
                className="usa-button--unstyled"
              >
                {i18next.t<string>('technicalAssistance:adminHome.assignLead')}
              </TrbAssignLeadModalOpener>
              <TrbAssignLeadModal
                modalRef={modalRef}
                trbRequestIdRef={trbRequestIdRef}
              />
            </MessageProvider>
          </MemoryRouter>
        </MockedProvider>
      </Provider>
    );

    const open = getByRole('button', {
      name: i18next.t<string>('technicalAssistance:adminHome.assignLead')
    });
    userEvent.click(open);

    // See that "Assign myself" is parsed
    await findByText(
      i18next.t<string>('technicalAssistance:assignTrbLeadModal.assignMyself')
    );

    userEvent.click(getByTestId(`trbLead-${trbLeadInfo.euaUserId}`));

    userEvent.click(
      getByRole('button', {
        name: i18next.t<string>('technicalAssistance:assignTrbLeadModal.submit')
      })
    );

    await findByText(
      i18next.t<string>('technicalAssistance:assignTrbLeadModal.success', {
        name: trbLeadInfo.commonName
      })
    );
  });

  it('shows an error when something failed', async () => {
    const modalRef = React.createRef<ModalRef>();
    const trbRequestIdRef = React.createRef<TrbRequestIdRef>();

    const { findByText, getByRole, findByTestId } = render(
      <Provider store={store}>
        <MockedProvider
          mocks={[
            getTrbLeadOptionsQuery,
            {
              request: updateTrbRequestLeadQuery.request,
              error: new Error()
            }
          ]}
        >
          <MemoryRouter>
            <MessageProvider>
              <MockMessage />
              <TrbAssignLeadModalOpener
                trbRequestId={mockTrbRequestId}
                modalRef={modalRef}
                trbRequestIdRef={trbRequestIdRef}
                className="usa-button--unstyled"
              >
                {i18next.t<string>('technicalAssistance:adminHome.assignLead')}
              </TrbAssignLeadModalOpener>
              <TrbAssignLeadModal
                modalRef={modalRef}
                trbRequestIdRef={trbRequestIdRef}
              />
            </MessageProvider>
          </MemoryRouter>
        </MockedProvider>
      </Provider>
    );

    const open = getByRole('button', {
      name: i18next.t<string>('technicalAssistance:adminHome.assignLead')
    });
    userEvent.click(open);

    userEvent.click(await findByTestId(`trbLead-${trbLeadInfo.euaUserId}`));

    userEvent.click(
      getByRole('button', {
        name: i18next.t<string>('technicalAssistance:assignTrbLeadModal.submit')
      })
    );

    await findByText(
      i18next.t<string>('technicalAssistance:assignTrbLeadModal.error')
    );
  });
});
