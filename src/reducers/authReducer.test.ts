import authReducer, {
  updateLastActiveAt,
  updateSessionExpiration
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
      sessionExpiration: 0
    });
  });

  it('handles updateLastActiveAt', () => {
    const mockAction = updateLastActiveAt;

    expect(authReducer(undefined, mockAction)).toEqual({
      lastActiveAt: fakeTime,
      sessionExpiration: 0
    });
  });

  it('handles updateSessionRenew', () => {
    const initialState = {
      lastActiveAt: 12345,
      sessionExpiration: 0
    };
    const mockAction = updateSessionExpiration(234567890);
    expect(authReducer(initialState, mockAction)).toEqual({
      lastActiveAt: 12345,
      sessionExpiration: 234567890
    });
  });
});
