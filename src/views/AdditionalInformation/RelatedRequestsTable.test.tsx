import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, screen } from '@testing-library/react';

import { systemIntake } from 'data/mock/systemIntake';
import { trbRequest } from 'data/mock/trbRequest';
import { MessageProvider } from 'hooks/useMessage';
import GetSystemIntakeRelatedRequestsQuery from 'queries/GetSystemIntakeRelatedRequestsQuery';
import GetTRBRequestRelatedRequestsQuery from 'queries/GetTRBRequestRelatedRequestsQuery';
import {
  SystemIntakeDecisionState,
  TRBRequestStatus
} from 'types/graphql-global-types';
import easiMockStore from 'utils/testing/easiMockStore';

import RelatedRequestsTable from './RelatedRequestsTable';

describe('Related Requests table', () => {
  it('renders empty related requests table for system intake', async () => {
    const mockStore = easiMockStore();

    const mocks = [
      {
        request: {
          query: GetSystemIntakeRelatedRequestsQuery,
          variables: {
            systemIntakeID: systemIntake.id
          }
        },
        result: {
          data: {
            systemIntake: {
              __typename: 'SystemIntake',
              id: systemIntake.id,
              relatedIntakes: [],
              relatedTRBRequests: []
            }
          }
        }
      }
    ];

    render(
      <MemoryRouter>
        <MockedProvider mocks={mocks}>
          <Provider store={mockStore}>
            <MessageProvider>
              <RelatedRequestsTable requestID={systemIntake.id} type="itgov" />
            </MessageProvider>
          </Provider>
        </MockedProvider>
      </MemoryRouter>
    );

    expect(await screen.findByRole('heading', { name: 'Related requests' }));
    expect(
      await screen.findByText(
        'There are no additional requests linked to this system'
      )
    );
  });

  it('renders empty related requests table for trb request', async () => {
    const mockStore = easiMockStore();

    const mocks = [
      {
        request: {
          query: GetTRBRequestRelatedRequestsQuery,
          variables: {
            trbRequestID: trbRequest.id
          }
        },
        result: {
          data: {
            trbRequest: {
              __typename: 'TRBRequest',
              id: trbRequest.id,
              relatedIntakes: [],
              relatedTRBRequests: []
            }
          }
        }
      }
    ];

    render(
      <MemoryRouter>
        <MockedProvider mocks={mocks}>
          <Provider store={mockStore}>
            <MessageProvider>
              <RelatedRequestsTable requestID={trbRequest.id} type="trb" />
            </MessageProvider>
          </Provider>
        </MockedProvider>
      </MemoryRouter>
    );

    expect(await screen.findByRole('heading', { name: 'Related requests' }));
    expect(
      await screen.findByText(
        'There are no additional requests linked to this system'
      )
    );
  });

  it('renders system intake related requests table with data', async () => {
    const mockStore = easiMockStore();

    const mocks = [
      {
        request: {
          query: GetSystemIntakeRelatedRequestsQuery,
          variables: {
            systemIntakeID: systemIntake.id
          }
        },
        result: {
          data: {
            systemIntake: {
              __typename: 'SystemIntake',
              id: systemIntake.id,
              relatedIntakes: [
                {
                  id: '1',
                  requestName: 'related intake 1',
                  contractNumbers: ['1', '2'],
                  decisionState: SystemIntakeDecisionState.NO_DECISION,
                  submittedAt: new Date()
                }
              ],
              relatedTRBRequests: [
                {
                  id: '2',
                  name: 'related trb 1',
                  contractNumbers: ['3', '4'],
                  status: TRBRequestStatus.FOLLOW_UP_REQUESTED,
                  createdAt: new Date()
                }
              ]
            }
          }
        }
      }
    ];

    render(
      <MemoryRouter>
        <MockedProvider mocks={mocks}>
          <Provider store={mockStore}>
            <MessageProvider>
              <RelatedRequestsTable requestID={systemIntake.id} type="itgov" />
            </MessageProvider>
          </Provider>
        </MockedProvider>
      </MemoryRouter>
    );

    expect(await screen.findByRole('heading', { name: 'Related requests' }));

    // this should NOT be in rendered if there is incoming table data
    expect(
      screen.queryByText(
        'There are no additional requests linked to this system'
      )
    ).not.toBeInTheDocument();
  });

  it('renders trb request related requests table with data', async () => {
    const mockStore = easiMockStore();

    const mocks = [
      {
        request: {
          query: GetTRBRequestRelatedRequestsQuery,
          variables: {
            trbRequestID: trbRequest.id
          }
        },
        result: {
          data: {
            trbRequest: {
              __typename: 'TRBRequest',
              id: trbRequest.id,
              relatedIntakes: [
                {
                  id: '1',
                  requestName: 'related intake 1',
                  contractNumbers: ['1', '2'],
                  decisionState: SystemIntakeDecisionState.NO_DECISION,
                  submittedAt: new Date()
                }
              ],
              relatedTRBRequests: [
                {
                  id: '2',
                  name: 'related trb 1',
                  contractNumbers: ['3', '4'],
                  status: TRBRequestStatus.FOLLOW_UP_REQUESTED,
                  createdAt: new Date()
                }
              ]
            }
          }
        }
      }
    ];

    render(
      <MemoryRouter>
        <MockedProvider mocks={mocks}>
          <Provider store={mockStore}>
            <MessageProvider>
              <RelatedRequestsTable requestID={trbRequest.id} type="trb" />
            </MessageProvider>
          </Provider>
        </MockedProvider>
      </MemoryRouter>
    );

    expect(await screen.findByRole('heading', { name: 'Related requests' }));

    // this should NOT be in rendered if there is incoming table data
    expect(
      screen.queryByText(
        'There are no additional requests linked to this system'
      )
    ).not.toBeInTheDocument();
  });

  it('should provide clickable admin link if user is admin on system intake related requests table', async () => {
    // mock with both admin types
    const mockStore = easiMockStore({
      groups: [
        'EASI_TRB_ADMIN_D',
        'EASI_TRB_ADMIN_P',
        'EASI_D_GOVTEAM',
        'EASI_P_GOVTEAM'
      ]
    });

    const mocks = [
      {
        request: {
          query: GetSystemIntakeRelatedRequestsQuery,
          variables: {
            systemIntakeID: systemIntake.id
          }
        },
        result: {
          data: {
            systemIntake: {
              __typename: 'SystemIntake',
              id: systemIntake.id,
              relatedIntakes: [
                {
                  id: '1',
                  requestName: 'related intake 1',
                  contractNumbers: ['1', '2'],
                  decisionState: SystemIntakeDecisionState.NO_DECISION,
                  submittedAt: new Date()
                }
              ],
              relatedTRBRequests: [
                {
                  id: '2',
                  name: 'related trb 1',
                  contractNumbers: ['3', '4'],
                  status: TRBRequestStatus.FOLLOW_UP_REQUESTED,
                  createdAt: new Date()
                }
              ]
            }
          }
        }
      }
    ];

    render(
      <MemoryRouter>
        <MockedProvider mocks={mocks}>
          <Provider store={mockStore}>
            <MessageProvider>
              <RelatedRequestsTable requestID={systemIntake.id} type="itgov" />
            </MessageProvider>
          </Provider>
        </MockedProvider>
      </MemoryRouter>
    );

    expect(await screen.findByRole('link', { name: 'related intake 1' }));
    expect(await screen.findByRole('link', { name: 'related trb 1' }));
  });

  it('should provide clickable admin link if user is admin on trb request related requests table', async () => {
    // mock with both admin types
    const mockStore = easiMockStore({
      groups: [
        'EASI_TRB_ADMIN_D',
        'EASI_TRB_ADMIN_P',
        'EASI_D_GOVTEAM',
        'EASI_P_GOVTEAM'
      ]
    });

    const mocks = [
      {
        request: {
          query: GetTRBRequestRelatedRequestsQuery,
          variables: {
            trbRequestID: trbRequest.id
          }
        },
        result: {
          data: {
            trbRequest: {
              __typename: 'TRBRequest',
              id: trbRequest.id,
              relatedIntakes: [
                {
                  id: '1',
                  requestName: 'related intake 1',
                  contractNumbers: ['1', '2'],
                  decisionState: SystemIntakeDecisionState.NO_DECISION,
                  submittedAt: new Date()
                }
              ],
              relatedTRBRequests: [
                {
                  id: '2',
                  name: 'related trb 1',
                  contractNumbers: ['3', '4'],
                  status: TRBRequestStatus.FOLLOW_UP_REQUESTED,
                  createdAt: new Date()
                }
              ]
            }
          }
        }
      }
    ];

    render(
      <MemoryRouter>
        <MockedProvider mocks={mocks}>
          <Provider store={mockStore}>
            <MessageProvider>
              <RelatedRequestsTable requestID={trbRequest.id} type="trb" />
            </MessageProvider>
          </Provider>
        </MockedProvider>
      </MemoryRouter>
    );

    expect(await screen.findByRole('link', { name: 'related intake 1' }));
    expect(await screen.findByRole('link', { name: 'related trb 1' }));
  });

  it('should provide clickable TRB admin link if user is TRB admin for system intake table', async () => {
    // mock with TRB admin only
    const mockStore = easiMockStore({
      groups: ['EASI_TRB_ADMIN_D', 'EASI_TRB_ADMIN_P']
    });

    const mocks = [
      {
        request: {
          query: GetSystemIntakeRelatedRequestsQuery,
          variables: {
            systemIntakeID: systemIntake.id
          }
        },
        result: {
          data: {
            systemIntake: {
              __typename: 'SystemIntake',
              id: systemIntake.id,
              relatedIntakes: [
                {
                  id: '1',
                  requestName: 'related intake 1',
                  contractNumbers: ['1', '2'],
                  decisionState: SystemIntakeDecisionState.NO_DECISION,
                  submittedAt: new Date()
                }
              ],
              relatedTRBRequests: [
                {
                  id: '2',
                  name: 'related trb 1',
                  contractNumbers: ['3', '4'],
                  status: TRBRequestStatus.FOLLOW_UP_REQUESTED,
                  createdAt: new Date()
                }
              ]
            }
          }
        }
      }
    ];

    render(
      <MemoryRouter>
        <MockedProvider mocks={mocks}>
          <Provider store={mockStore}>
            <MessageProvider>
              <RelatedRequestsTable requestID={systemIntake.id} type="itgov" />
            </MessageProvider>
          </Provider>
        </MockedProvider>
      </MemoryRouter>
    );

    // expect only TRB to be clickable
    expect(await screen.findByRole('link', { name: 'related trb 1' }));

    expect(
      screen.queryByRole('link', { name: 'related intake 1' })
    ).not.toBeInTheDocument();
  });

  it('should provide clickable TRB admin link if user is TRB admin for trb request table', async () => {
    // mock with TRB admin only
    const mockStore = easiMockStore({
      groups: ['EASI_TRB_ADMIN_D', 'EASI_TRB_ADMIN_P']
    });

    const mocks = [
      {
        request: {
          query: GetTRBRequestRelatedRequestsQuery,
          variables: {
            trbRequestID: trbRequest.id
          }
        },
        result: {
          data: {
            trbRequest: {
              __typename: 'TRBRequest',
              id: trbRequest.id,
              relatedIntakes: [
                {
                  id: '1',
                  requestName: 'related intake 1',
                  contractNumbers: ['1', '2'],
                  decisionState: SystemIntakeDecisionState.NO_DECISION,
                  submittedAt: new Date()
                }
              ],
              relatedTRBRequests: [
                {
                  id: '2',
                  name: 'related trb 1',
                  contractNumbers: ['3', '4'],
                  status: TRBRequestStatus.FOLLOW_UP_REQUESTED,
                  createdAt: new Date()
                }
              ]
            }
          }
        }
      }
    ];

    render(
      <MemoryRouter>
        <MockedProvider mocks={mocks}>
          <Provider store={mockStore}>
            <MessageProvider>
              <RelatedRequestsTable requestID={trbRequest.id} type="trb" />
            </MessageProvider>
          </Provider>
        </MockedProvider>
      </MemoryRouter>
    );

    // expect only TRB to be clickable
    expect(await screen.findByRole('link', { name: 'related trb 1' }));

    expect(
      screen.queryByRole('link', { name: 'related intake 1' })
    ).not.toBeInTheDocument();
  });

  it('should provide clickable ITGov admin link if user is ITGov admin for system intake table', async () => {
    // mock with ITGov admin only
    const mockStore = easiMockStore({
      groups: ['EASI_D_GOVTEAM', 'EASI_P_GOVTEAM']
    });

    const mocks = [
      {
        request: {
          query: GetSystemIntakeRelatedRequestsQuery,
          variables: {
            systemIntakeID: systemIntake.id
          }
        },
        result: {
          data: {
            systemIntake: {
              __typename: 'SystemIntake',
              id: systemIntake.id,
              relatedIntakes: [
                {
                  id: '1',
                  requestName: 'related intake 1',
                  contractNumbers: ['1', '2'],
                  decisionState: SystemIntakeDecisionState.NO_DECISION,
                  submittedAt: new Date()
                }
              ],
              relatedTRBRequests: [
                {
                  id: '2',
                  name: 'related trb 1',
                  contractNumbers: ['3', '4'],
                  status: TRBRequestStatus.FOLLOW_UP_REQUESTED,
                  createdAt: new Date()
                }
              ]
            }
          }
        }
      }
    ];

    render(
      <MemoryRouter>
        <MockedProvider mocks={mocks}>
          <Provider store={mockStore}>
            <MessageProvider>
              <RelatedRequestsTable requestID={systemIntake.id} type="itgov" />
            </MessageProvider>
          </Provider>
        </MockedProvider>
      </MemoryRouter>
    );

    // expect only ITGov to be clickable
    expect(await screen.findByRole('link', { name: 'related intake 1' }));

    expect(
      screen.queryByRole('link', { name: 'related trb 1' })
    ).not.toBeInTheDocument();
  });

  it('should provide clickable ITGov admin link if user is ITGov admin trb request table', async () => {
    // mock with ITGov admin only
    const mockStore = easiMockStore({
      groups: ['EASI_D_GOVTEAM', 'EASI_P_GOVTEAM']
    });

    const mocks = [
      {
        request: {
          query: GetTRBRequestRelatedRequestsQuery,
          variables: {
            trbRequestID: trbRequest.id
          }
        },
        result: {
          data: {
            trbRequest: {
              __typename: 'TRBRequest',
              id: trbRequest.id,
              relatedIntakes: [
                {
                  id: '1',
                  requestName: 'related intake 1',
                  contractNumbers: ['1', '2'],
                  decisionState: SystemIntakeDecisionState.NO_DECISION,
                  submittedAt: new Date()
                }
              ],
              relatedTRBRequests: [
                {
                  id: '2',
                  name: 'related trb 1',
                  contractNumbers: ['3', '4'],
                  status: TRBRequestStatus.FOLLOW_UP_REQUESTED,
                  createdAt: new Date()
                }
              ]
            }
          }
        }
      }
    ];

    render(
      <MemoryRouter>
        <MockedProvider mocks={mocks}>
          <Provider store={mockStore}>
            <MessageProvider>
              <RelatedRequestsTable requestID={trbRequest.id} type="trb" />
            </MessageProvider>
          </Provider>
        </MockedProvider>
      </MemoryRouter>
    );

    // expect only ITGov to be clickable
    expect(await screen.findByRole('link', { name: 'related intake 1' }));

    expect(
      screen.queryByRole('link', { name: 'related trb 1' })
    ).not.toBeInTheDocument();
  });

  it('should provide non-clickable text if user is not an admin', () => {
    const mockStore = easiMockStore({
      groups: ['EASI_P_USER']
    });

    const mocks = [
      {
        request: {
          query: GetSystemIntakeRelatedRequestsQuery,
          variables: {
            systemIntakeID: systemIntake.id
          }
        },
        result: {
          data: {
            systemIntake: {
              __typename: 'SystemIntake',
              id: systemIntake.id,
              relatedIntakes: [
                {
                  id: '1',
                  requestName: 'related intake 1',
                  contractNumbers: ['1', '2'],
                  decisionState: SystemIntakeDecisionState.NO_DECISION,
                  submittedAt: new Date()
                }
              ],
              relatedTRBRequests: [
                {
                  id: '2',
                  name: 'related trb 1',
                  contractNumbers: ['3', '4'],
                  status: TRBRequestStatus.FOLLOW_UP_REQUESTED,
                  createdAt: new Date()
                }
              ]
            }
          }
        }
      }
    ];

    render(
      <MemoryRouter>
        <MockedProvider mocks={mocks}>
          <Provider store={mockStore}>
            <MessageProvider>
              <RelatedRequestsTable requestID={systemIntake.id} type="itgov" />
            </MessageProvider>
          </Provider>
        </MockedProvider>
      </MemoryRouter>
    );

    expect(
      screen.queryByRole('link', { name: 'related intake 1' })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('link', { name: 'related trb 1' })
    ).not.toBeInTheDocument();
  });

  it('should provide non-clickable text if user is not an admin', () => {
    const mockStore = easiMockStore({
      groups: ['EASI_P_USER']
    });

    const mocks = [
      {
        request: {
          query: GetTRBRequestRelatedRequestsQuery,
          variables: {
            systemIntakeID: trbRequest.id
          }
        },
        result: {
          data: {
            trbRequest: {
              __typename: 'TRBRequest',
              id: trbRequest.id,
              relatedIntakes: [
                {
                  id: '1',
                  requestName: 'related intake 1',
                  contractNumbers: ['1', '2'],
                  decisionState: SystemIntakeDecisionState.NO_DECISION,
                  submittedAt: new Date()
                }
              ],
              relatedTRBRequests: [
                {
                  id: '2',
                  name: 'related trb 1',
                  contractNumbers: ['3', '4'],
                  status: TRBRequestStatus.FOLLOW_UP_REQUESTED,
                  createdAt: new Date()
                }
              ]
            }
          }
        }
      }
    ];

    render(
      <MemoryRouter>
        <MockedProvider mocks={mocks}>
          <Provider store={mockStore}>
            <MessageProvider>
              <RelatedRequestsTable requestID={trbRequest.id} type="trb" />
            </MessageProvider>
          </Provider>
        </MockedProvider>
      </MemoryRouter>
    );

    expect(
      screen.queryByRole('link', { name: 'related intake 1' })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('link', { name: 'related trb 1' })
    ).not.toBeInTheDocument();
  });
});
