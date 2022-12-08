import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import configureMockStore from 'redux-mock-store';

// import { attendees, trbRequest as request } from 'data/mock/trbAttendees';
import GetTrbRequestQuery from 'queries/GetTrbRequestQuery';
import { GetTRBRequestAttendees } from 'queries/TrbAttendeeQueries';
import { CreateTrbRequest_createTRBRequest as TRBRequest } from 'queries/types/CreateTrbRequest';
import { PersonRole } from 'types/graphql-global-types';

import Attendees from './Attendees';

describe('Trb Request form: Attendees', () => {
  const trbRequest = {
    id: '441cb9e0-2cb3-43ca-b168-9d6a2a13ec91',
    name: 'Draft',
    createdBy: 'SF13',
    form: {
      id: '452cf444-69b2-41a9-b8ab-ed354d209307',
      component: null,
      needsAssistanceWith: null,
      hasSolutionInMind: null,
      proposedSolution: null,
      whereInProcess: null,
      whereInProcessOther: null,
      hasExpectedStartEndDates: null,
      expectedStartDate: null,
      expectedEndDate: null,
      collabGroups: [],
      collabDateSecurity: null,
      collabDateEnterpriseArchitecture: null,
      collabDateCloud: null,
      collabDatePrivacyAdvisor: null,
      collabDateGovernanceReviewBoard: null,
      collabDateOther: null,
      collabGroupOther: null,
      __typename: 'TRBRequestForm'
    },
    __typename: 'TRBRequest'
  };

  const requester = {
    __typename: 'TRBRequestAttendee',
    id: 'b3848dbb-ed90-4d54-a647-8d6fb394c173',
    trbRequestId: trbRequest.id,
    userInfo: {
      __typename: 'UserInfo',
      euaUserId: 'SF13',
      commonName: 'Jerry Seinfeld',
      email: 'sf13@local.fake'
    },
    component: 'CMS Wide',
    role: PersonRole.PRODUCT_OWNER,
    createdAt: '2022-11-28T14:58:36.618026Z'
  };
  const additionalAttendees = [
    {
      __typename: 'TRBRequestAttendee',
      component: 'Center for Program Integrity',
      createdAt: '2022-11-28T14:58:36.618026Z',
      id: '9a6a3b4e-1a46-4a07-9e0e-e10f8aaf4f82',
      role: 'PRODUCT_OWNER',
      trbRequestId: trbRequest.id,
      userInfo: {
        __typename: 'UserInfo',
        commonName: 'Anabelle Jerde',
        email: 'anabelle.jerde@local.fake',
        euaUserId: 'JTTC'
      }
    },
    {
      __typename: 'TRBRequestAttendee',
      component: 'Office of Equal Opportunity and Civil Rights',
      createdAt: '2022-11-28T12:43:14.053037Z',
      id: '91a14322-34a8-4838-bde3-17b1d483fb63',
      role: 'PRODUCT_OWNER',
      trbRequestId: trbRequest.id,
      userInfo: {
        __typename: 'UserInfo',
        commonName: 'Jerry Seinfeld',
        email: 'jerry.seinfeld@local.fake',
        euaUserId: 'SF13'
      }
    },
    {
      __typename: 'TRBRequestAttendee',
      component: 'CMS Wide',
      createdAt: '2022-11-28T14:53:32.846882Z',
      id: 'a86ca9bb-518a-4669-9ce9-fd7f79f8262a',
      role: 'SYSTEM_OWNER',
      trbRequestId: trbRequest.id,
      userInfo: {
        __typename: 'UserInfo',
        commonName: 'Audrey Abrams',
        email: 'audrey.abrams@local.fake',
        euaUserId: 'ADMI'
      }
    }
  ];

  const getAttendeesQuery = {
    request: {
      query: GetTRBRequestAttendees,
      variables: {
        id: trbRequest.id
      }
    },
    result: {
      data: {
        trbRequest: { attendees: additionalAttendees }
      }
    }
  };

  const getTrbRequestQuery = {
    request: {
      query: GetTrbRequestQuery,
      variables: {
        id: trbRequest.id
      }
    },
    result: {
      data: trbRequest
    }
  };

  it('Renders the attendees form', async () => {
    const mockStore = configureMockStore();
    const store = mockStore({
      auth: {
        euaId: requester.userInfo.euaUserId,
        name: requester.userInfo.commonName
      }
    });
    const { asFragment, getByTestId } = render(
      <MemoryRouter>
        <MockedProvider
          mocks={[getAttendeesQuery, getTrbRequestQuery]}
          addTypename={false}
        >
          <Provider store={store}>
            <Attendees
              request={trbRequest as TRBRequest}
              stepUrl={{
                current: `/trb/requests/${trbRequest.id}/attendees`,
                next: `/trb/requests/${trbRequest.id}/documents`,
                back: `/trb/requests/${trbRequest.id}/subject`
              }}
              refreshRequest={() => {}}
              setIsStepSubmitting={() => {}}
              setStepSubmit={() => {}}
              setFormError={() => {}}
            />
          </Provider>
        </MockedProvider>
      </MemoryRouter>
    );

    // Check for requester name
    expect(getByTestId('cedar-contact-select')).toHaveValue(
      'Jerry Seinfeld, SF13'
    );

    // Select requester component
    userEvent.selectOptions(getByTestId('trb-requester-component'), [
      'CMS Wide'
    ]);
    expect(getByTestId('trb-requester-component')).toHaveValue('CMS Wide');

    // Select requester role
    userEvent.selectOptions(getByTestId('trb-requester-role'), [
      'PRODUCT_OWNER'
    ]);
    expect(getByTestId('trb-requester-role')).toHaveValue('PRODUCT_OWNER');

    // Wait for contacts to load
    await waitFor(() => {
      // Check for first additional contact
      getByTestId(`trbAttendee-${additionalAttendees[0].userInfo.euaUserId}`);
    });

    // Snapshot
    expect(asFragment()).toMatchSnapshot();
  });
});
