import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ModalRef } from '@trussworks/react-uswds';
import {
  UpdateTrbRequestLeadDocument,
  UpdateTrbRequestLeadMutation,
  UpdateTrbRequestLeadMutationVariables
} from 'gql/generated/graphql';
import i18next from 'i18next';
import { getTrbLeadOptionsQuery, trbLeadOptions } from 'tests/mock/trbRequest';

import { MessageProvider } from 'hooks/useMessage';
import { TrbRequestIdRef } from 'types/technicalAssistance';
import { MockedQuery } from 'types/util';
import easiMockStore from 'utils/testing/easiMockStore';
import MockMessage from 'utils/testing/MockMessage';
import { mockTrbRequestId } from 'utils/testing/MockTrbAttendees';

import TrbAssignLeadModal, {
  TrbAssignLeadModalOpener
} from './TrbAssignLeadModal';

const trbLeadInfo = trbLeadOptions[0];

const updateTrbRequestLeadMutation: MockedQuery<
  UpdateTrbRequestLeadMutation,
  UpdateTrbRequestLeadMutationVariables
> = {
  request: {
    query: UpdateTrbRequestLeadDocument,
    variables: {
      input: {
        trbRequestId: mockTrbRequestId,
        trbLead: trbLeadInfo.euaUserId
      }
    }
  },
  result: {
    data: {
      __typename: 'Mutation',
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
          mocks={[getTrbLeadOptionsQuery, updateTrbRequestLeadMutation]}
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
              request: updateTrbRequestLeadMutation.request,
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
