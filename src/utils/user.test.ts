import {
  BASIC_USER_PROD,
  GOVTEAM_DEV,
  GOVTEAM_PROD,
  TRB_ADMIN_DEV,
  TRB_ADMIN_PROD
} from 'constants/jobCodes';
import { Flags } from 'types/flags';

import { isBasicUser, isITGovAdmin, isTrbAdmin } from './user';

describe('user', () => {
  describe('isITGovAdmin', () => {
    describe('groups', () => {
      const flags = {} as Flags;
      describe('dev job code exists in groups', () => {
        const groups = [GOVTEAM_DEV];

        it('returns true', () => {
          expect(isITGovAdmin(groups, flags)).toBe(true);
        });
      });

      describe('prod job code exists in groups', () => {
        const groups = [GOVTEAM_PROD];

        it('returns true', () => {
          expect(isITGovAdmin(groups, flags)).toBe(true);
        });
      });

      describe('no grt job code exists in groups', () => {
        const groups = [BASIC_USER_PROD];

        it('returns false', () => {
          expect(isITGovAdmin(groups, flags)).toBe(false);
        });
      });
    });

    describe('Gov team downgrade flags', () => {
      const groups = [GOVTEAM_DEV];

      describe('the downgrade flag is false', () => {
        const flags = { downgradeGovTeam: false } as Flags;
        it('returns true', () => {
          expect(isITGovAdmin(groups, flags)).toBe(true);
        });
      });

      describe('the downgrade flag is true', () => {
        const flags = { downgradeGovTeam: true } as Flags;
        it('returns false', () => {
          expect(isITGovAdmin(groups, flags)).toBe(false);
        });
      });
    });

    describe('TRB downgrade flags', () => {
      const groups = [TRB_ADMIN_DEV, TRB_ADMIN_PROD];
      describe('the TRB downgrade flag is false', () => {
        const flags = { downgradeTrbAdmin: false } as Flags;
        it('returns true', () => {
          expect(isTrbAdmin(groups, flags)).toBe(true);
        });
      });

      describe('the TRB downgrade flag is true', () => {
        const flags = { downgradeTrbAdmin: true } as Flags;
        it('returns false', () => {
          expect(isTrbAdmin(groups, flags)).toBe(false);
        });
      });
    });
  });

  describe('isBasicUser', () => {
    const defaultFlags = {} as Flags;
    describe('prod user job code exists in groups', () => {
      const groups = [BASIC_USER_PROD];
      it('returns true', () => {
        expect(isBasicUser(groups, defaultFlags)).toBe(true);
      });
    });

    describe('no job code exists in groups', () => {
      const groups: Array<String> = [];
      it('returns true', () => {
        expect(isBasicUser(groups, defaultFlags)).toBe(true);
      });
    });

    describe('other job codes exist in groups', () => {
      const groups = [GOVTEAM_DEV];
      it('returns false', () => {
        expect(isBasicUser(groups, defaultFlags)).toBe(false);
      });
    });

    describe('other job codes exist in groups, but they have been downgraded with flags', () => {
      it('returns true if GRT admin is downgraded', () => {
        const flags = { downgradeGovTeam: true } as Flags;
        const groups = [GOVTEAM_DEV];
        expect(isBasicUser(groups, flags)).toBe(true);
      });

      it('returns true if everything is downgraded', () => {
        const flags = {
          downgradeGovTeam: true
        } as Flags;
        const groups = [GOVTEAM_DEV];
        expect(isBasicUser(groups, flags)).toBe(true);
      });
    });
  });
});
