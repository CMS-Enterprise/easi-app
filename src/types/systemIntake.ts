/**
 * Type for SystemIntakeForm
 *
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
};
