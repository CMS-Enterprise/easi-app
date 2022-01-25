import { gql } from '@apollo/client';

export default gql`
  query GetAdminNotesAndActions($id: UUID!) {
    systemIntake(id: $id) {
      lcid
      notes {
        id
        createdAt
        content
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
        actor {
          name
          email
        }
      }
    }
  }
`;
