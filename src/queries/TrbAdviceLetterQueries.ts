import { gql } from '@apollo/client';

/**
 * Get TRB advice letter and status
 */

export default gql`
  query GetTrbAdviceLetter($id: UUID!) {
    trbRequest(id: $id) {
      taskStatuses {
        adviceLetterStatus
      }
      adviceLetter {
        id
        meetingSummary
        nextSteps
        isFollowupRecommended
        followupPoint
        createdBy
        createdAt
        modifiedBy
        modifiedAt
      }
    }
  }
`;
