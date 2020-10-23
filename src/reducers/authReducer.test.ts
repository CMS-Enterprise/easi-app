import authReducer, {
  setUserGroups,
  updateLastActiveAt,
  updateLastRenewAt
} from './authReducer';

const RealDate = Date.now;
const fakeTime = 123456789;

describe('The auth reducer', () => {
  beforeAll(() => {
    global.Date.now = jest.fn(() => fakeTime);
  });

  afterAll(() => {
    global.Date.now = RealDate;
  });

  it('returns the initial state', () => {
    expect(authReducer(undefined, {})).toEqual({
      lastActiveAt: expect.any(Number),
      lastRenewAt: expect.any(Number),
      groups: [],
      userGroupsSet: false
    });
  });

  it('handles updateLastActiveAt', () => {
    const initialReducer = {
      lastActiveAt: 0,
      lastRenewAt: 0
    };
    const mockAction = updateLastActiveAt;

    expect(authReducer(initialReducer, mockAction)).toEqual({
      lastActiveAt: fakeTime,
      lastRenewAt: 0
    });
  });

  it('handles updateLastRenewAt', () => {
    const initialReducer = {
      lastActiveAt: 0,
      lastRenewAt: 0
    };
    const mockAction = updateLastRenewAt;

    expect(authReducer(initialReducer, mockAction)).toEqual({
      lastActiveAt: 0,
      lastRenewAt: fakeTime
    });
  });

  it('handles setUserGroups', () => {
    const initialReducer = {
      groups: [],
      userGroupsSet: false
    };
    const mockAction = setUserGroups(['my-test-group']);

    expect(authReducer(initialReducer, mockAction)).toEqual({
      groups: ['my-test-group'],
      userGroupsSet: true
    });
  });
});
