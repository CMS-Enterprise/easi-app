// eslint-disable-next-line
export type AccessibilityRequestForm = {
  intakeId: string;
  businessOwner: {
    name: string;
    component: string;
  };
  requestName: string;
};

// Form for reviewer to add dates
export type TestDateFormType = {
  testType: 'INITIAL' | 'REMEDIATION' | null;
  dateMonth: string;
  dateYear: string;
  dateDay: string;
  score: {
    isPresent: boolean | null;
    value: string;
  };
};
