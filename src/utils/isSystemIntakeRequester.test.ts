import isSystemIntakeRequester from './isSystemIntakeRequester';

describe('isSystemIntakeRequester', () => {
  it('returns true when the requester username matches', () => {
    expect(
      isSystemIntakeRequester({
        euaId: 'ABCD',
        intake: {
          euaUserId: 'ZZZZ',
          requester: {
            userAccount: {
              username: 'ABCD'
            }
          }
        },
        isUserSet: true
      })
    ).toBe(true);
  });

  it('returns true when the legacy euaUserId matches', () => {
    expect(
      isSystemIntakeRequester({
        euaId: 'ABCD',
        intake: {
          euaUserId: 'ABCD',
          requester: null
        },
        isUserSet: true
      })
    ).toBe(true);
  });

  it('returns false when the requester username is stale', () => {
    expect(
      isSystemIntakeRequester({
        euaId: 'ABCD',
        intake: {
          euaUserId: 'ABCD',
          requester: {
            userAccount: {
              username: 'STALE'
            }
          }
        },
        isUserSet: true
      })
    ).toBe(false);
  });

  it('returns false when neither identifier matches', () => {
    expect(
      isSystemIntakeRequester({
        euaId: 'ABCD',
        intake: {
          euaUserId: 'WXYZ',
          requester: {
            userAccount: {
              username: 'TEST'
            }
          }
        },
        isUserSet: true
      })
    ).toBe(false);
  });
});
