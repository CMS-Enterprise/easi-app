import { isIntakeClosed, isIntakeOpen } from './systemIntake';

describe('The system intake utilities', () => {
  describe('isIntakeClosed', () => {
    it('is closed with status LCID_ISSUED', () => {
      expect(isIntakeClosed('LCID_ISSUED')).toEqual(true);
    });

    it('is closed with status LCID_ISSUED', () => {
      expect(isIntakeClosed('LCID_ISSUED')).toEqual(true);
    });

    it('is closed with status NOT_IT_REQUEST', () => {
      expect(isIntakeClosed('NOT_IT_REQUEST')).toEqual(true);
    });

    it('is closed with status NOT_APPROVED', () => {
      expect(isIntakeClosed('NOT_APPROVED')).toEqual(true);
    });

    it('is closed with status NO_GOVERNANCE', () => {
      expect(isIntakeClosed('NO_GOVERNANCE')).toEqual(true);
    });
  });

  describe('isIntakeOpen', () => {
    it('is open with status INTAKE_DRAFT', () => {
      expect(isIntakeOpen('INTAKE_DRAFT')).toEqual(true);
    });

    it('is open with status INTAKE_SUBMITTED', () => {
      expect(isIntakeOpen('INTAKE_SUBMITTED')).toEqual(true);
    });

    it('is open with status NEED_BIZ_CASE', () => {
      expect(isIntakeOpen('NEED_BIZ_CASE')).toEqual(true);
    });

    it('is open with status BIZ_CASE_DRAFT', () => {
      expect(isIntakeOpen('BIZ_CASE_DRAFT')).toEqual(true);
    });

    it('is open with status BIZ_CASE_DRAFT_SUBMITTED', () => {
      expect(isIntakeOpen('BIZ_CASE_DRAFT_SUBMITTED')).toEqual(true);
    });

    it('is open with status BIZ_CASE_CHANGES_NEEDED', () => {
      expect(isIntakeOpen('BIZ_CASE_CHANGES_NEEDED')).toEqual(true);
    });

    it('is open with status BIZ_CASE_FINAL_NEEDED', () => {
      expect(isIntakeOpen('BIZ_CASE_FINAL_NEEDED')).toEqual(true);
    });

    it('is open with status BIZ_CASE_FINAL_SUBMITTED', () => {
      expect(isIntakeOpen('BIZ_CASE_FINAL_SUBMITTED')).toEqual(true);
    });

    it('is open with status READY_FOR_GRT', () => {
      expect(isIntakeOpen('READY_FOR_GRT')).toEqual(true);
    });

    it('is open with status READY_FOR_GRB', () => {
      expect(isIntakeOpen('READY_FOR_GRB')).toEqual(true);
    });
  });
});
