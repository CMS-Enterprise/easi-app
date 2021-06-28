/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { UpdateSystenIntakeContactDetailsInput } from "./../../types/graphql-global-types";

// ====================================================
// GraphQL mutation operation: UpdateSystemIntakeContactDetails
// ====================================================

export interface UpdateSystemIntakeContactDetails_updateSystemIntakeContactDetails_systemIntake_businessOwner {
  __typename: "SystemIntakeBusinessOwner";
  component: string | null;
  name: string | null;
}

export interface UpdateSystemIntakeContactDetails_updateSystemIntakeContactDetails_systemIntake_governanceTeams_teams {
  __typename: "SystemIntakeCollaborator";
  acronym: string | null;
  collaborator: string | null;
  key: string | null;
  label: string | null;
  name: string | null;
}

export interface UpdateSystemIntakeContactDetails_updateSystemIntakeContactDetails_systemIntake_governanceTeams {
  __typename: "SystemIntakeGovernanceTeam";
  isPresent: boolean | null;
  teams: UpdateSystemIntakeContactDetails_updateSystemIntakeContactDetails_systemIntake_governanceTeams_teams[] | null;
}

export interface UpdateSystemIntakeContactDetails_updateSystemIntakeContactDetails_systemIntake_isso {
  __typename: "SystemIntakeISSO";
  isPresent: boolean | null;
  name: string | null;
}

export interface UpdateSystemIntakeContactDetails_updateSystemIntakeContactDetails_systemIntake_productManager {
  __typename: "SystemIntakeProductManager";
  component: string | null;
  name: string | null;
}

export interface UpdateSystemIntakeContactDetails_updateSystemIntakeContactDetails_systemIntake_requester {
  __typename: "SystemIntakeRequester";
  component: string | null;
  name: string;
}

export interface UpdateSystemIntakeContactDetails_updateSystemIntakeContactDetails_systemIntake {
  __typename: "SystemIntake";
  id: UUID;
  businessOwner: UpdateSystemIntakeContactDetails_updateSystemIntakeContactDetails_systemIntake_businessOwner | null;
  governanceTeams: UpdateSystemIntakeContactDetails_updateSystemIntakeContactDetails_systemIntake_governanceTeams | null;
  isso: UpdateSystemIntakeContactDetails_updateSystemIntakeContactDetails_systemIntake_isso | null;
  productManager: UpdateSystemIntakeContactDetails_updateSystemIntakeContactDetails_systemIntake_productManager | null;
  requester: UpdateSystemIntakeContactDetails_updateSystemIntakeContactDetails_systemIntake_requester;
}

export interface UpdateSystemIntakeContactDetails_updateSystemIntakeContactDetails {
  __typename: "UpdateSystemIntakePayload";
  systemIntake: UpdateSystemIntakeContactDetails_updateSystemIntakeContactDetails_systemIntake | null;
}

export interface UpdateSystemIntakeContactDetails {
  updateSystemIntakeContactDetails: UpdateSystemIntakeContactDetails_updateSystemIntakeContactDetails | null;
}

export interface UpdateSystemIntakeContactDetailsVariables {
  input: UpdateSystenIntakeContactDetailsInput;
}
