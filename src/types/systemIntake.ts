/**
 * Type for SystemIntakeForm
 * This includes ALL fields, even ones that we DON'T submit data for.
 */
export type SystemIntakeForm = {
  name: string;
  acronym: string;
  requestor: string;
  requestorComponent: string;
  businessOwner: string;
  businessOwnerComponent: string;
  productManager: string;
  productManagerComponent: string;
  governanceTeams: string[];
  description: string;
  currentStage: string;
  needsEaSupport: boolean | null;
  hasContract: string;
  isBusinessOwnerSameAsRequestor: boolean;
};

/**
 * This includes ONLY the data relevant data passed to the API.
 * EXCLUDES presentational form data
 */
export type SystemIntakeData = {
  name: string;
  acronym: string;
  requestor: string;
  requestorComponent: string;
  businessOwner: string;
  businessOwnerComponent: string;
  productManager: string;
  productManagerComponent: string;
  governanceTeams: string[];
  description: string;
  currentStage: string;
  needsEaSupport: boolean | null;
  hasContract: string;
};
