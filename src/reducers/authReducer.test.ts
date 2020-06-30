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
      lastSessionRenew: null
    });
  });

  it('handles updateLastActiveAt', () => {
    const mockAction = updateLastActiveAt;

    expect(authReducer(undefined, mockAction)).toEqual({
      lastActiveAt: fakeTime,
      lastSessionRenew: null
    });
  });

  it('handles updateSessionRenew', () => {
    const initialState = {
      lastActiveAt: fakeTime,
      lastSessionRenew: null
    };
    const mockAction = updateLastSessionRenew;
    expect(authReducer(initialState, mockAction)).toEqual({
      lastActiveAt: fakeTime,
      lastSessionRenew: fakeTime
    });
  });
});
