/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { UpdateSystemIntakeContactDetailsInput } from "./../../types/graphql-global-types";

// ====================================================
// GraphQL mutation operation: UpdateSystemIntakeContactDetails
// ====================================================

export interface UpdateSystemIntakeContactDetails_updateSystemIntakeContactDetails_systemIntake_governanceTeams_teams {
  __typename: "SystemIntakeCollaborator";
  acronym: string;
  collaborator: string;
  key: string;
  label: string;
  name: string;
}

export interface UpdateSystemIntakeContactDetails_updateSystemIntakeContactDetails_systemIntake_governanceTeams {
  __typename: "SystemIntakeGovernanceTeam";
  isPresent: boolean | null;
  teams: UpdateSystemIntakeContactDetails_updateSystemIntakeContactDetails_systemIntake_governanceTeams_teams[] | null;
}

export interface UpdateSystemIntakeContactDetails_updateSystemIntakeContactDetails_systemIntake_requester {
  __typename: "SystemIntakeRequester";
  component: string | null;
  name: string;
}

export interface UpdateSystemIntakeContactDetails_updateSystemIntakeContactDetails_systemIntake {
  __typename: "SystemIntake";
  id: UUID;
  governanceTeams: UpdateSystemIntakeContactDetails_updateSystemIntakeContactDetails_systemIntake_governanceTeams;
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
  input: UpdateSystemIntakeContactDetailsInput;
}
