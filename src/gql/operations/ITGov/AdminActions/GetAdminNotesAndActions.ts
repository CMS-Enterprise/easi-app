import { gql } from '@apollo/client';

// TODO: look into adding id field into systemIntake return object - doing this causes some weird behavior with caching (and thus not refetching system intakes)
export default gql(/* GraphQL */ `
  query GetAdminNotesAndActions($id: UUID!) {
    systemIntake(id: $id) {
      id
      lcid
      lcidDisplay
      notes {
        id
        createdAt
        content
        editor {
          commonName
        }
        modifiedBy
        modifiedAt
        isArchived
        author {
          name
          eua
        }
      }
      actions {
        id
        createdAt
        feedback
        type
        lcidExpirationChange {
          previousDate
          newDate
          previousScope
          newScope
          previousNextSteps
          newNextSteps
          previousCostBaseline
          newCostBaseline
        }
        lcidMetadataChange {
          previousType
          newType
          previousIsPilot
          newIsPilot
          previousIsLowIt
          newIsLowIt
        }
        actor {
          name
          email
        }
      }
    }
  }
`);
