import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ModalRef } from '@trussworks/react-uswds';
import i18next from 'i18next';
import configureMockStore from 'redux-mock-store';

import useMessage, { MessageProvider } from 'hooks/useMessage';
import GetTrbLeadOptionsQuery from 'queries/GetTrbLeadOptionsQuery';
import UpdateTrbRequestLeadQuery from 'queries/UpdateTrbRequestLeadQuery';
import { TrbRequestIdRef } from 'types/technicalAssistance';

import TrbAssignLeadModal, {
  TrbAssignLeadModalOpener
} from './TrbAssignLeadModal';

function MockMessage() {
  const { message } = useMessage();
  return <>{message}</>;
}

describe('TrbAssignLeadModal', () => {
  const mockStore = configureMockStore();
  const store = mockStore({
    auth: {
      euaId: 'ABCD',
      name: 'Jerry Seinfeld',
      isUserSet: true,
      groups: ['EASI_TRB_ADMIN_D']
    }
  });
  const trbRequestId = '449ea115-8bfa-48c3-b1dd-5a613d79fbae';
  const trbLeadOptions = [
    {
      euaUserId: 'ABCD',
      commonName: 'Adeline Aarons',
      __typename: 'UserInfo'
    },
    {
      euaUserId: 'TEST',
      commonName: 'Terry Thompson',
      __typename: 'UserInfo'
    },
    {
      euaUserId: 'A11Y',
      commonName: 'Ally Anderson',
      __typename: 'UserInfo'
    },
    {
      euaUserId: 'GRTB',
      commonName: 'Gary Gordon',
      __typename: 'UserInfo'
    }
  ];

  it('opens and lists trb members', async () => {
    const modalRef = React.createRef<ModalRef>();
    const trbRequestIdRef = React.createRef<TrbRequestIdRef>();

    const { findByText, getByRole } = render(
      <>
        <Provider store={store}>
          <MockedProvider
            mocks={[
              {
                request: {
                  query: GetTrbLeadOptionsQuery
                },
                result: {
                  data: {
                    trbLeadOptions
                  }
                }
              }
            ]}
          >
            <MemoryRouter>
              <MessageProvider>
                <TrbAssignLeadModalOpener
                  trbRequestId={trbRequestId}
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
          mocks={[
            {
              request: {
                query: GetTrbLeadOptionsQuery
              },
              result: {
                data: {
                  trbLeadOptions
                }
              }
            },
            {
              request: {
                query: UpdateTrbRequestLeadQuery,
                variables: {
                  input: {
                    trbRequestId,
                    trbLead: 'ABCD'
                  }
                }
              },
              result: {
                data: {
                  id: trbRequestId,
                  trbLead: 'ABCD',
                  trbLeadComponent: null,
                  trbLeadInfo: {
                    commonName: 'Adeline Aarons',
                    email: 'adeline.aarons@local.fake',
                    euaUserId: 'ABCD',
                    __typename: 'UserInfo'
                  },
                  __typename: 'TRBRequest'
                }
              }
            }
          ]}
        >
          <MemoryRouter>
            <MessageProvider>
              <MockMessage />
              <TrbAssignLeadModalOpener
                trbRequestId={trbRequestId}
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

    userEvent.click(getByTestId('trbLead-ABCD'));

    userEvent.click(
      getByRole('button', {
        name: i18next.t<string>('technicalAssistance:assignTrbLeadModal.submit')
      })
    );

    await findByText(
      i18next.t<string>('technicalAssistance:assignTrbLeadModal.success', {
        name: 'Adeline Aarons'
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
            {
              request: {
                query: GetTrbLeadOptionsQuery
              },
              result: {
                data: {
                  trbLeadOptions
                }
              }
            },
            {
              request: {
                query: UpdateTrbRequestLeadQuery,
                variables: {
                  input: {
                    trbRequestId,
                    trbLead: 'ABCD'
                  }
                }
              },
              error: new Error()
            }
          ]}
        >
          <MemoryRouter>
            <MessageProvider>
              <MockMessage />
              <TrbAssignLeadModalOpener
                trbRequestId={trbRequestId}
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

    userEvent.click(await findByTestId('trbLead-TEST'));

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
