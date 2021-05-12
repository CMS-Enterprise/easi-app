import {
  ACCESSIBILITY_ADMIN_DEV,
  ACCESSIBILITY_ADMIN_PROD,
  ACCESSIBILITY_TESTER_DEV,
  ACCESSIBILITY_TESTER_PROD,
  BASIC_USER_PROD,
  GOVTEAM_DEV,
  GOVTEAM_PROD
} from 'constants/jobCodes';

import {
  isAccessibilityAdmin,
  isAccessibilityTeam,
  isAccessibilityTester,
  isBasicUser,
  isGrtReviewer
} from './user';

describe('user', () => {
  describe('isGrtReviewer', () => {
    describe('groups', () => {
      const flags = {};
      describe('dev job code exists in groups', () => {
        const groups = [GOVTEAM_DEV];

        it('returns true', () => {
          expect(isGrtReviewer(groups, flags)).toBe(true);
        });
      });

      describe('prod job code exists in groups', () => {
        const groups = [GOVTEAM_PROD];

        it('returns true', () => {
          expect(isGrtReviewer(groups, flags)).toBe(true);
        });
      });

      describe('no grt job code exists in groups', () => {
        const groups = [BASIC_USER_PROD];

        it('returns false', () => {
          expect(isGrtReviewer(groups, flags)).toBe(false);
        });
      });
    });

    describe('flags', () => {
      const groups = [GOVTEAM_DEV];

      describe('the downgrade flag is false', () => {
        const flags = { downgradeGovTeam: false };
        it('returns true', () => {
          expect(isGrtReviewer(groups, flags)).toBe(true);
        });
      });

      describe('the downgrade flag is true', () => {
        const flags = { downgradeGovTeam: true };
        it('returns false', () => {
          expect(isGrtReviewer(groups, flags)).toBe(false);
        });
      });
    });
  });

  describe('isAccessibilityTester', () => {
    describe('groups', () => {
      const flags = {};
      describe('dev job code exists in groups', () => {
        const groups = [ACCESSIBILITY_TESTER_DEV];

        it('returns true', () => {
          expect(isAccessibilityTester(groups, flags)).toBe(true);
        });
      });

      describe('prod job code exists in groups', () => {
        const groups = [ACCESSIBILITY_TESTER_PROD];

        it('returns true', () => {
          expect(isAccessibilityTester(groups, flags)).toBe(true);
        });
      });

      describe('no grt job code exists in groups', () => {
        const groups = [BASIC_USER_PROD];

        it('returns false', () => {
          expect(isAccessibilityTester(groups, flags)).toBe(false);
        });
      });
    });

    describe('flags', () => {
      const groups = [ACCESSIBILITY_TESTER_DEV];

      describe('the downgrade flag is false', () => {
        const flags = { downgrade508Tester: false };
        it('returns true', () => {
          expect(isAccessibilityTester(groups, flags)).toBe(true);
        });
      });

      describe('the downgrade flag is true', () => {
        const flags = { downgrade508Tester: true };
        it('returns false', () => {
          expect(isAccessibilityTester(groups, flags)).toBe(false);
        });
      });
    });
  });

  describe('isAccessibilityAdmin', () => {
    describe('groups', () => {
      const flags = {};
      describe('dev job code exists in groups', () => {
        const groups = [ACCESSIBILITY_ADMIN_DEV];

        it('returns true', () => {
          expect(isAccessibilityAdmin(groups, flags)).toBe(true);
        });
      });

      describe('prod job code exists in groups', () => {
        const groups = [ACCESSIBILITY_ADMIN_PROD];

        it('returns true', () => {
          expect(isAccessibilityAdmin(groups, flags)).toBe(true);
        });
      });

      describe('no grt job code exists in groups', () => {
        const groups = [BASIC_USER_PROD];

        it('returns false', () => {
          expect(isAccessibilityAdmin(groups, flags)).toBe(false);
        });
      });
    });

    describe('flags', () => {
      const groups = [ACCESSIBILITY_ADMIN_DEV];

      describe('the downgrade flag is false', () => {
        const flags = { downgrade508User: false };
        it('returns true', () => {
          expect(isAccessibilityAdmin(groups, flags)).toBe(true);
        });
      });

      describe('the downgrade flag is true', () => {
        const flags = { downgrade508User: true };
        it('returns false', () => {
          expect(isAccessibilityAdmin(groups, flags)).toBe(false);
        });
      });
    });
  });

  describe('isAccessibilityTeam', () => {
    const flags = {};

    describe('user has the accessibility tester code', () => {
      const groups = [ACCESSIBILITY_TESTER_PROD, BASIC_USER_PROD];

      it('returns true', () => {
        expect(isAccessibilityTeam(groups, flags)).toBe(true);
      });
    });

    describe('user has the accessibility admin code', () => {
      const groups = [ACCESSIBILITY_ADMIN_PROD, BASIC_USER_PROD];

      it('returns true', () => {
        expect(isAccessibilityTeam(groups, flags)).toBe(true);
      });
    });

    describe('user has neither accessibility code', () => {
      const groups = [BASIC_USER_PROD];

      it('returns false', () => {
        expect(isAccessibilityTeam(groups, flags)).toBe(false);
      });
    });
  });

  describe('isBasicUser', () => {
    const flags = {};
    describe('prod user job code exists in groups', () => {
      const groups = [BASIC_USER_PROD];
      it('returns true', () => {
        expect(isBasicUser(groups, flags)).toBe(true);
      });
    });

    describe('no job code exists in groups', () => {
      const groups = [];
      it('returns true', () => {
        expect(isBasicUser(groups, flags)).toBe(true);
      });
    });

    describe('other job codes exist in groups', () => {
      const groups = [ACCESSIBILITY_ADMIN_DEV];
      it('returns false', () => {
        expect(isBasicUser(groups, flags)).toBe(false);
      });
    });
  });
});
