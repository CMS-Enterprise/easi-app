import authReducer, {
  updateLastActiveAt,
  updateLastSessionRenew
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
      lastSessionRenew: 0
    });
  });

  it('handles updateLastActiveAt', () => {
    const mockAction = updateLastActiveAt;

    expect(authReducer(undefined, mockAction)).toEqual({
      lastActiveAt: fakeTime,
      lastSessionRenew: 0
    });
  });

  it('handles updateSessionRenew', () => {
    const initialState = {
      lastActiveAt: fakeTime,
      lastSessionRenew: 0
    };
    const mockAction = updateLastSessionRenew;
    expect(authReducer(initialState, mockAction)).toEqual({
      lastActiveAt: fakeTime,
      lastSessionRenew: fakeTime
    });
  });
});
