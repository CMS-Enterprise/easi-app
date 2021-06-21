import { accessibilityRequestStatusMap } from './accessibilityRequest';

describe('Accessibility Utils', () => {
  describe('accessibilityRequestStatusMap', () => {
    it('returns Open', () => {
      expect(accessibilityRequestStatusMap.OPEN).toEqual('Open');
    });

    it('returns In remediation', () => {
      expect(accessibilityRequestStatusMap.IN_REMEDIATION).toEqual(
        'In remediation'
      );
    });

    it('returns Closed', () => {
      expect(accessibilityRequestStatusMap.CLOSED).toEqual('Closed');
    });

    it('returns undefined (no such status)', () => {
      expect(accessibilityRequestStatusMap.TEST).toEqual(undefined);
    });
  });
});
