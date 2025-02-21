import { PersonRole } from 'gql/generated/graphql';

import { CMSOffice } from 'constants/enums/cmsDivisionsAndOffices';

import MockUsers, { MockUser, MockUserOptions } from './MockUsers';

export interface MockTrbAttendee extends MockUser {
  __typename: 'TRBRequestAttendee';
  trbRequestId: string;
  id: string;
  component: CMSOffice;
  role: PersonRole;
  createdAt: string;
}

export const mockTrbRequestId = 'd8ebedca-0031-4ccd-9690-37390726c50e';

export const defaultMockAttendeeProps: Omit<MockTrbAttendee, 'userInfo'> = {
  __typename: 'TRBRequestAttendee',
  id: '',
  trbRequestId: mockTrbRequestId,
  component: 'CMS Wide',
  role: PersonRole.PRODUCT_OWNER,
  createdAt: '2023-01-05T07:26:16.036618Z'
};

type MockTrbAttendeeOptions = MockUserOptions<
  Omit<MockTrbAttendee, 'trbRequestId'>
> & {
  trbRequestId?: string;
};

/** Extends MockUsers class to mock TRB attendees for testing */
export default class MockTrbAttendees extends MockUsers<MockTrbAttendee> {
  constructor({
    trbRequestId,
    allowDuplicates = false,
    defaultProps
  }: MockTrbAttendeeOptions = {}) {
    super({
      allowDuplicates,
      defaultProps: userInfo => ({
        ...defaultMockAttendeeProps,
        ...defaultProps,
        ...(trbRequestId ? { trbRequestId } : {}),
        id: `user-${userInfo.euaUserId}`
      })
    });
  }
}
