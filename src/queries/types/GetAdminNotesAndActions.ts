/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { SystemIntakeActionType } from "./../../types/graphql-global-types";

// ====================================================
// GraphQL query operation: GetAdminNotesAndActions
// ====================================================

export interface GetAdminNotesAndActions_systemIntake_notes_editor {
  __typename: "UserInfo";
  commonName: string;
}

export interface GetAdminNotesAndActions_systemIntake_notes_author {
  __typename: "SystemIntakeNoteAuthor";
  name: string;
  eua: string;
}

export interface GetAdminNotesAndActions_systemIntake_notes {
  __typename: "SystemIntakeNote";
  id: UUID;
  createdAt: Time;
  content: HTML;
  editor: GetAdminNotesAndActions_systemIntake_notes_editor | null;
  modifiedBy: string | null;
  modifiedAt: Time | null;
  isArchived: boolean;
  author: GetAdminNotesAndActions_systemIntake_notes_author;
}

export interface GetAdminNotesAndActions_systemIntake_actions_lcidExpirationChange {
  __typename: "SystemIntakeLCIDExpirationChange";
  previousDate: Time;
  newDate: Time;
  previousScope: HTML | null;
  newScope: HTML | null;
  previousNextSteps: HTML | null;
  newNextSteps: HTML | null;
  previousCostBaseline: string | null;
  newCostBaseline: string | null;
}

export interface GetAdminNotesAndActions_systemIntake_actions_actor {
  __typename: "SystemIntakeActionActor";
  name: string;
  email: string;
}

export interface GetAdminNotesAndActions_systemIntake_actions {
  __typename: "SystemIntakeAction";
  id: UUID;
  createdAt: Time;
  feedback: HTML | null;
  type: SystemIntakeActionType;
  lcidExpirationChange: GetAdminNotesAndActions_systemIntake_actions_lcidExpirationChange | null;
  actor: GetAdminNotesAndActions_systemIntake_actions_actor;
}

export interface GetAdminNotesAndActions_systemIntake {
  __typename: "SystemIntake";
  id: UUID;
  lcid: string | null;
  notes: GetAdminNotesAndActions_systemIntake_notes[];
  actions: GetAdminNotesAndActions_systemIntake_actions[];
}

export interface GetAdminNotesAndActions {
  /**
   * Requests fetches a requester's own intake requests
   * first is currently non-functional and can be removed later
   */
  systemIntake: GetAdminNotesAndActions_systemIntake | null;
}

export interface GetAdminNotesAndActionsVariables {
  id: UUID;
}
