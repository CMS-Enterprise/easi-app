import { gql } from '@apollo/client';

import {
  TRBAdminNoteGuidanceLetterCategoryData,
  TRBAdminNoteInitialRequestFormCategoryData,
  TRBAdminNoteSupportingDocumentsCategoryData
} from './TRBAdminNoteCategorySpecificData';

export default gql(/* GraphQL */ `
  ${TRBAdminNoteInitialRequestFormCategoryData}
  ${TRBAdminNoteSupportingDocumentsCategoryData}
  ${TRBAdminNoteGuidanceLetterCategoryData}

  fragment TRBAdminNote on TRBAdminNote {
    id
    isArchived
    category
    noteText

    author {
      commonName
    }
    createdAt

    categorySpecificData {
      ... on TRBAdminNoteInitialRequestFormCategoryData {
        ...TRBAdminNoteInitialRequestFormCategoryData
      }

      ... on TRBAdminNoteSupportingDocumentsCategoryData {
        ...TRBAdminNoteSupportingDocumentsCategoryData
      }

      ... on TRBAdminNoteGuidanceLetterCategoryData {
        ...TRBAdminNoteGuidanceLetterCategoryData
      }
    }
  }
`);
