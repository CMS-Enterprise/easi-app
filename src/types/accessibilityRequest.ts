// Form for reviewer to add dates
export type TestDateForm = {
  testType: 'INITIAL' | 'REMEDIATION' | null;
  dateMonth: string;
  dateYear: string;
  dateDay: string;
  score: {
    isPresent: boolean | null;
    value: string;
  };
};
