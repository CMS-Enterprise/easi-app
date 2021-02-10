// Form for reviewer to add dates
export type TestDateForm = {
  testType: 'INITIAL' | 'REMEDIATION' | null;
  DateMonth: string;
  DateYear: string;
  DateDay: string;
  score: {
    isPresent: boolean | null;
    value: number;
  };
};
