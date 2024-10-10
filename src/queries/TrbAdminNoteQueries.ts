import { gql } from '@apollo/client';

import { TRBAdminNoteFragment } from './GetTrbAdminNotesQuery';

// General request
export const CreateTrbAdminNoteGeneralRequestQuery = gql`
  ${TRBAdminNoteFragment}
  mutation CreateTRBAdminNoteGeneralRequest(
    $input: CreateTRBAdminNoteGeneralRequestInput!
  ) {
    createTRBAdminNoteGeneralRequest(input: $input) {
      ...TRBAdminNoteFragment
    }
  }
`;

// Initial request form
export const CreateTrbAdminNoteInitialRequestFormQuery = gql`
  ${TRBAdminNoteFragment}
  mutation CreateTRBAdminNoteInitialRequestForm(
    $input: CreateTRBAdminNoteInitialRequestFormInput!
  ) {
    createTRBAdminNoteInitialRequestForm(input: $input) {
      ...TRBAdminNoteFragment
    }
  }
`;

// Supporting documents
export const CreateTrbAdminNoteSupportingDocumentsQuery = gql`
  ${TRBAdminNoteFragment}
  mutation CreateTRBAdminNoteSupportingDocuments(
    $input: CreateTRBAdminNoteSupportingDocumentsInput!
  ) {
    createTRBAdminNoteSupportingDocuments(input: $input) {
      ...TRBAdminNoteFragment
    }
  }
`;

// consult session
export const CreateTrbAdminNoteConsultSessionQuery = gql`
  ${TRBAdminNoteFragment}
  mutation CreateTRBAdminNoteConsultSession(
    $input: CreateTRBAdminNoteConsultSessionInput!
  ) {
    createTRBAdminNoteConsultSession(input: $input) {
      ...TRBAdminNoteFragment
    }
  }
`;

// Advice letter
export const CreateTrbAdminNoteAdviceLetterQuery = gql`
  ${TRBAdminNoteFragment}
  mutation CreateTRBAdminNoteAdviceLetter(
    $input: CreateTRBAdminNoteGuidanceLetterInput!
  ) {
    createTRBAdminNoteAdviceLetter(input: $input) {
      ...TRBAdminNoteFragment
    }
  }
`;
