import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { render, waitForElementToBeRemoved } from '@testing-library/react';
import { ModalRef } from '@trussworks/react-uswds';
import i18next from 'i18next';

import { trbRequestSummary } from 'data/mock/trbRequest';
import GetTrbRequestHomeQuery from 'queries/GetTrbRequestHomeQuery';
import {
  TRBFormStatus,
  TRBGuidanceLetterStatus,
  TRBRequestStatus
} from 'types/graphql-global-types';
import { TrbRequestIdRef } from 'types/technicalAssistance';
import VerboseMockedProvider from 'utils/testing/VerboseMockedProvider';

import RequestHome from './RequestHome';

describe('Trb Admin Request Home', () => {
  Element.prototype.scrollIntoView = vi.fn();

  const trbRequestId = trbRequestSummary.id;
  const modalRef = React.createRef<ModalRef>();
  const trbRequestIdRef = React.createRef<TrbRequestIdRef>();

  it('renders successfully with empty data', async () => {
    const { getByText, asFragment, getByRole, getByTestId } = render(
      <VerboseMockedProvider
        defaultOptions={{
          watchQuery: { fetchPolicy: 'no-cache' },
          query: { fetchPolicy: 'no-cache' }
        }}
        mocks={[
          {
            request: {
              query: GetTrbRequestHomeQuery,
              variables: {
                id: trbRequestId
              }
            },
            result: {
              data: {
                trbRequest: {
                  id: trbRequestId,
                  consultMeetingTime: null,
                  taskStatuses: {
                    formStatus: TRBFormStatus.READY_TO_START,
                    guidanceLetterStatus:
                      TRBGuidanceLetterStatus.CANNOT_START_YET,
                    __typename: 'TRBTaskStatuses'
                  },
                  form: {
                    id: 'c92ec6a6-cd5b-4be3-895a-e88f7de76c22',
                    modifiedAt: null,
                    __typename: 'TRBRequestForm'
                  },
                  guidanceLetter: null,
                  trbLeadInfo: {
                    commonName: '',
                    email: '',
                    __typename: 'UserInfo'
                  },
                  documents: [],
                  adminNotes: [],
                  __typename: 'TRBRequest'
                }
              }
            }
          }
        ]}
      >
        <MemoryRouter initialEntries={[`/trb/${trbRequestId}/request`]}>
          <Route exact path="/trb/:id/:activePage">
            <RequestHome
              trbRequestId={trbRequestId}
              trbRequest={trbRequestSummary}
              assignLeadModalRef={modalRef}
              assignLeadModalTrbRequestIdRef={trbRequestIdRef}
            />
          </Route>
        </MemoryRouter>
      </VerboseMockedProvider>
    );

    await waitForElementToBeRemoved(() => getByTestId('page-loading'));

    expect(
      getByText(i18next.t<string>('technicalAssistance:adminHome.requestHome'))
    ).toBeInTheDocument();

    // Consult meeting time
    expect(
      getByText(
        i18next.t<string>('technicalAssistance:adminHome.reviewInitialRequest')
      )
    ).toBeInTheDocument();

    // Assign lead button
    expect(
      getByRole('button', {
        name: i18next.t<string>('technicalAssistance:adminHome.assignLead')
      })
    ).toBeInTheDocument();

    // Document count
    expect(getByTestId('document-count').textContent).toBe(
      'There are 0 additional documents uploaded as a part of this request.'
    );

    // Start guidance letter button disabled
    expect(
      getByRole('button', {
        name: i18next.t<string>('technicalAssistance:adminHome.startGuidance')
      })
    ).toBeDisabled();

    expect(asFragment()).toMatchSnapshot();
  });

  it('renders successfully with populated data', async () => {
    const { getByText, getByRole, getByTestId } = render(
      <VerboseMockedProvider
        defaultOptions={{
          watchQuery: { fetchPolicy: 'no-cache' },
          query: { fetchPolicy: 'no-cache' }
        }}
        mocks={[
          {
            request: {
              query: GetTrbRequestHomeQuery,
              variables: {
                id: trbRequestId
              }
            },
            result: {
              data: {
                trbRequest: {
                  id: trbRequestId,
                  consultMeetingTime: '2024-01-05T05:00:00Z',
                  taskStatuses: {
                    formStatus: TRBFormStatus.COMPLETED,
                    guidanceLetterStatus:
                      TRBGuidanceLetterStatus.READY_TO_START,
                    __typename: 'TRBTaskStatuses'
                  },
                  form: {
                    id: 'c92ec6a6-cd5b-4be3-895a-e88f7de76c22',
                    modifiedAt: '2023-01-05T05:00:00Z',
                    __typename: 'TRBRequestForm'
                  },
                  guidanceLetter: {
                    __typename: 'TRBGuidanceLetter',
                    id: '123',
                    modifiedAt: '2023-02-05T05:00:00Z'
                  },
                  trbLeadInfo: {
                    commonName: 'Jerry Seinfeld',
                    email: 'js@oddball.io',
                    __typename: 'UserInfo'
                  },
                  documents: [
                    {
                      __typename: 'TRBRequestDocument',
                      id: '456'
                    }
                  ],
                  adminNotes: [],
                  __typename: 'TRBRequest'
                }
              }
            }
          }
        ]}
      >
        <MemoryRouter initialEntries={[`/trb/${trbRequestId}/request`]}>
          <Route exact path="/trb/:id/:activePage">
            <RequestHome
              trbRequestId={trbRequestId}
              trbRequest={{
                ...trbRequestSummary,
                status: TRBRequestStatus.CONSULT_SCHEDULED
              }}
              assignLeadModalRef={modalRef}
              assignLeadModalTrbRequestIdRef={trbRequestIdRef}
            />
          </Route>
        </MemoryRouter>
      </VerboseMockedProvider>
    );

    await waitForElementToBeRemoved(() => getByTestId('page-loading'));

    // Consult meeting time
    expect(getByText('01/05/2024 at 5:00 AM')).toBeInTheDocument();

    // TRB lead info
    expect(getByText('Jerry Seinfeld, TRB')).toBeInTheDocument();

    expect(getByTestId('document-count').textContent).toBe(
      'There is 1 additional document uploaded as a part of this request.'
    );

    expect(
      getByRole('button', {
        name: i18next.t<string>('technicalAssistance:adminHome.startGuidance')
      })
    ).not.toBeDisabled();
  });
});
