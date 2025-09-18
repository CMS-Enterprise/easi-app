import {
  SystemIntakeStatusRequester,
  TRBRequestState,
  TRBRequestStatus
} from 'gql/generated/graphql';

import {
  LinkedSystemIntake,
  LinkedTrbRequest
} from 'types/systemLinkedRequest';

const timeInThePast = new Date('09/08/2024').toISOString();
const aLongTimeFromNow = new Date('09/08/2124').toISOString();

// For now this mock data is used for both OPEN and CLOSED intakes

const linkedSystemIntakes: LinkedSystemIntake[] = [
  {
    id: '29d73aa0-3a29-478e-afb4-374a7594be47',
    name: 'System Intake Relation (Existing System 0A)',
    submittedAt: '2024-07-24T23:41:58.42997Z',
    status: SystemIntakeStatusRequester.INITIAL_REQUEST_FORM_NEW,
    lcid: null,
    requester: {
      __typename: 'SystemIntakeContact',
      id: 'userOne',
      userAccount: {
        __typename: 'UserAccount',
        id: 'userOne',
        commonName: 'User One'
      }
    },
    lastMeetingDate: timeInThePast,
    nextMeetingDate: aLongTimeFromNow,
    __typename: 'SystemIntake'
  },
  {
    id: 'dd31c8bd-b677-434c-aa35-56138f0b443b',
    name: 'Related Intake 2 (system 1B)',
    submittedAt: '2024-07-25T23:41:58.500526Z',
    status: SystemIntakeStatusRequester.INITIAL_REQUEST_FORM_NEW,
    lcid: null,
    requester: {
      __typename: 'SystemIntakeContact',
      id: 'userOne',
      userAccount: {
        __typename: 'UserAccount',
        id: 'userOne',
        commonName: 'User One'
      }
    },
    lastMeetingDate: null,
    nextMeetingDate: null,
    __typename: 'SystemIntake'
  },
  {
    id: '3ccdf44f-4eba-4e1e-ae6a-73faf3ed54a1',
    name: null,
    submittedAt: '2024-07-01T23:41:58.500526Z',
    status: SystemIntakeStatusRequester.INITIAL_REQUEST_FORM_NEW,
    lcid: null,
    requester: {
      __typename: 'SystemIntakeContact',
      id: 'userUSR1',
      userAccount: {
        __typename: 'UserAccount',
        id: 'userUSR1',
        commonName: 'User USR1'
      }
    },
    lastMeetingDate: timeInThePast,
    nextMeetingDate: aLongTimeFromNow,
    __typename: 'SystemIntake'
  }
];

const linkedTrbRequests: LinkedTrbRequest[] = [
  {
    id: '92691063-4acd-4bab-9a72-b6f24a0bee6d',
    name: 'Case 14 - Completed request form with Existing System Relation',
    form: {
      submittedAt: '2024-07-02T23:41:59.187442Z',
      __typename: 'TRBRequestForm'
    },
    status: TRBRequestStatus.REQUEST_FORM_COMPLETE,
    state: TRBRequestState.OPEN,
    requesterInfo: {
      commonName: 'Adeline Aarons',
      __typename: 'UserInfo'
    },
    lastMeetingDate: timeInThePast,
    nextMeetingDate: aLongTimeFromNow,
    __typename: 'TRBRequest'
  },
  {
    id: '453ab061-1ac4-4003-873f-57c51430616e',
    name: 'Case 18 - Completed request with related system (1B)',
    form: {
      submittedAt: '2024-07-03T23:41:59.344629Z',
      __typename: 'TRBRequestForm'
    },
    status: TRBRequestStatus.REQUEST_FORM_COMPLETE,
    state: TRBRequestState.OPEN,
    requesterInfo: {
      commonName: 'Adeline Aarons',
      __typename: 'UserInfo'
    },
    lastMeetingDate: timeInThePast,
    nextMeetingDate: aLongTimeFromNow,
    __typename: 'TRBRequest'
  },
  {
    id: '453ab061-1ac4-4003-873f-57c51430616e',
    name: null,
    form: {
      submittedAt: '2024-07-10T23:41:59.344629Z',
      __typename: 'TRBRequestForm'
    },
    status: TRBRequestStatus.REQUEST_FORM_COMPLETE,
    state: TRBRequestState.CLOSED,
    requesterInfo: {
      commonName: 'Adeline Aarons',
      __typename: 'UserInfo'
    },
    lastMeetingDate: timeInThePast,
    nextMeetingDate: aLongTimeFromNow,
    __typename: 'TRBRequest'
  }
];

export { linkedSystemIntakes, linkedTrbRequests };
