import { PersonRole } from 'gql/generated/graphql';
import users, { MockUserInfo } from 'tests/mock/users';

import { CMSOffice } from 'constants/enums/cmsDivisionsAndOffices';

import MockTrbAttendees, {
  defaultMockAttendeeProps,
  MockTrbAttendee
} from './MockTrbAttendees';
import MockUsers from './MockUsers';

const userOne: MockUserInfo = {
  __typename: 'UserInfo',
  commonName: 'Otilia Abbott',
  email: 'otilia.abbott@local.fake',
  euaUserId: 'AX0Q'
};

const userTwo: MockUserInfo = {
  __typename: 'UserInfo',
  commonName: 'Delphia Green',
  email: 'delphia.green@local.fake',
  euaUserId: 'GBRG'
};

const attendeeOne: MockTrbAttendee = {
  ...defaultMockAttendeeProps,
  userInfo: users[0],
  id: `user-${users[0].euaUserId}`
};

describe('Mock user data', () => {
  it('Mocks users for testing', () => {
    const mockUsers = new MockUsers();

    const initialUserCount = mockUsers.length;

    expect(mockUsers.next()?.userInfo).toEqual(users[0]);

    expect(mockUsers.findByEuaUserId(userOne.euaUserId)?.userInfo).toEqual(
      userOne
    );
    // Check that user was removed from array
    expect(mockUsers.findByEuaUserId(userOne.euaUserId)).toBeUndefined();

    expect(mockUsers.findByCommonName(userTwo.commonName)?.userInfo).toEqual(
      userTwo
    );
    // Check that user was removed from array
    expect(mockUsers.findByCommonName(userTwo.commonName)).toBeUndefined();

    // mockUsers should have three less users
    expect(mockUsers.length).toEqual(initialUserCount - 3);
  });

  it('Allows duplicate users', () => {
    const mockUsers = new MockUsers({ allowDuplicates: true });

    const initialUserCount = mockUsers.length;

    // Mock three users
    mockUsers.next();
    mockUsers.next();
    mockUsers.next();

    // mockUsers length should stay the same
    expect(mockUsers.length).toEqual(initialUserCount);
  });

  it('Mocks TRB attendees', () => {
    const attendees = new MockTrbAttendees();

    expect(attendees.next()).toEqual(attendeeOne);
  });

  it('Mocks TRB attendees with props', () => {
    const trbRequestId = 'aed81cfe-e3b5-4152-8924-947586f966e4';

    // Mock attendees with updated trbRequestId
    const attendees = new MockTrbAttendees({ trbRequestId });

    // Check that trbRequestId was updated from default
    expect(attendees.next()).toEqual({ ...attendeeOne, trbRequestId });

    // Mock attendee with props
    const component: CMSOffice = 'Center for Program Integrity';
    const role = PersonRole.SYSTEM_OWNER;
    const attendeeWithProps = attendees.findByEuaUserId(userOne.euaUserId, {
      component,
      role
    });

    expect(attendeeWithProps?.component).toEqual(component);
    expect(attendeeWithProps?.role).toEqual(role);
  });
});
