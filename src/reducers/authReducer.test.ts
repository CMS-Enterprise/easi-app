import authReducer, { updateLastActiveAt } from './authReducer';

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
      lastActiveAt: expect.any(Number)
    });
  });

  it('handles updateLastActiveAt', () => {
    const mockAction = updateLastActiveAt;

    expect(authReducer(undefined, mockAction)).toEqual({
      lastActiveAt: fakeTime
    });
  });
});
