import isSystemIntakeRequester from './isSystemIntakeRequester';

describe('isSystemIntakeRequester', () => {
  it('returns true when the viewer is the requester', () => {
    expect(
      isSystemIntakeRequester({
        intake: {
          viewerIsRequester: true
        }
      })
    ).toBe(true);
  });

  it('returns false when the viewer is not the requester', () => {
    expect(
      isSystemIntakeRequester({
        intake: {
          viewerIsRequester: false
        }
      })
    ).toBe(false);
  });

  it('returns false when viewer requester access is missing', () => {
    expect(
      isSystemIntakeRequester({
        intake: {
          viewerIsRequester: undefined
        }
      })
    ).toBe(false);
  });

  it('returns false when intake data is missing', () => {
    expect(
      isSystemIntakeRequester({
        intake: null
      })
    ).toBe(false);
  });
});
