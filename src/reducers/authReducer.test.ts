import authReducer, {
  setUserGroups,
  updateLastActiveAt,
  updateLastRenewAt
} from './authReducer';

// const RealDate = Date.now;
const fakeTime = 123456789;

describe('The auth reducer', () => {
  // beforeAll(() => {
  //   global.Date.now = jest.fn(() => fakeTime);
  // });

  // afterAll(() => {
  //   global.Date.now = RealDate;
  // });

  it('returns the initial state', () => {
    expect(authReducer(undefined, { type: 'TEST', payload: {} })).toEqual({
      lastActiveAt: expect.any(Number),
      lastRenewAt: expect.any(Number),
      groups: [],
      userGroupsSet: false
    });
  });

  it('handles updateLastActiveAt', () => {
    const initialReducer = {
      lastActiveAt: 0,
      lastRenewAt: 0,
      groups: [],
      userGroupsSet: false
    };
    const mockAction = updateLastActiveAt;

    expect(authReducer(initialReducer, mockAction).lastActiveAt).toEqual(
      fakeTime
    );
  });

  it('handles updateLastRenewAt', () => {
    const initialReducer = {
      lastActiveAt: 0,
      lastRenewAt: 0,
      groups: [],
      userGroupsSet: false
    };
    const mockAction = updateLastRenewAt;

    expect(authReducer(initialReducer, mockAction).lastRenewAt).toEqual(
      fakeTime
    );
  });

  it('handles setUserGroups', () => {
    const initialReducer = {
      lastActiveAt: 0,
      lastRenewAt: 0,
      groups: [],
      userGroupsSet: false
    };
    const mockAction = setUserGroups(['my-test-group']);

    const newState = authReducer(initialReducer, mockAction);
    expect(newState.groups).toEqual(['my-test-group']);
    expect(newState.userGroupsSet).toEqual(true);
  });
});
