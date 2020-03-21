export type BusinessCaseModel = {
  projectName: string;
  requestor: {
    name: string;
    phoneNumber: string;
  };
  budgetNumber: string;

  businessOwner: {
    name: string;
  };
  businessNeed: string;
  cmsBenefit: string;
  priorityAlignment: string;
  successIndicators: string;
};
