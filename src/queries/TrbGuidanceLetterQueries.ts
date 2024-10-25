import { gql } from '@apollo/client';

const TRBInsight = gql`
  fragment TRBInsight on TRBGuidanceLetterInsight {
    id
    title
    insight
    links
  }
`;

/** Guidance letter fields fragment */
export const TRBGuidanceLetter = gql`
  ${TRBInsight}
  fragment TRBGuidanceLetter on TRBGuidanceLetter {
    id
    meetingSummary
    nextSteps
    isFollowupRecommended
    dateSent
    followupPoint
    insights {
      ...TRBInsight
    }
    author {
      euaUserId
      commonName
    }
    createdAt
    modifiedAt
  }
`;

/** Get TRB guidance letter and status */
export const GetTrbGuidanceLetterQuery = gql`
  ${TRBGuidanceLetter}
  query GetTrbGuidanceLetter($id: UUID!) {
    trbRequest(id: $id) {
      id
      name
      type
      createdAt
      consultMeetingTime
      taskStatuses {
        guidanceLetterStatus
      }
      guidanceLetter {
        ...TRBGuidanceLetter
      }
    }
  }
`;

/** Create guidance letter */
export const CreateTrbGuidanceLetterQuery = gql`
  ${TRBGuidanceLetter}
  mutation CreateTrbGuidanceLetter($trbRequestId: UUID!) {
    createTRBGuidanceLetter(trbRequestId: $trbRequestId) {
      ...TRBGuidanceLetter
    }
  }
`;

/** Update guidance letter */
export const UpdateTrbGuidanceLetterQuery = gql`
  ${TRBGuidanceLetter}
  mutation UpdateTrbGuidanceLetter($input: UpdateTRBGuidanceLetterInput!) {
    updateTRBGuidanceLetter(input: $input) {
      ...TRBGuidanceLetter
    }
  }
`;

/** Get guidance letter insights */
export const GetTrbInsightsQuery = gql`
  ${TRBInsight}
  query GetTrbInsights($id: UUID!) {
    trbRequest(id: $id) {
      guidanceLetter {
        insights {
          ...TRBInsight
        }
      }
    }
  }
`;

/** Create guidance letter insight */
export const CreateTrbInsightQuery = gql`
  ${TRBInsight}
  mutation CreateTRBInsight($input: CreateTRBGuidanceLetterInsightInput!) {
    createTRBGuidanceLetterInsight(input: $input) {
      ...TRBInsight
    }
  }
`;

/** Update guidance letter insight */
export const UpdateTrbInsightQuery = gql`
  ${TRBInsight}
  mutation UpdateTRBInsight($input: UpdateTRBGuidanceLetterInsightInput!) {
    updateTRBGuidanceLetterInsight(input: $input) {
      ...TRBInsight
    }
  }
`;

/** Reorder guidance letters */
export const UpdateTrbInsightOrderQuery = gql`
  ${TRBInsight}
  mutation UpdateTrbInsightOrder(
    $input: UpdateTRBGuidanceLetterInsightOrderInput!
  ) {
    updateTRBGuidanceLetterInsightOrder(input: $input) {
      ...TRBInsight
    }
  }
`;

/** Delete guidance letter insight */
export const DeleteTrbInsightQuery = gql`
  ${TRBInsight}
  mutation DeleteTRBInsight($id: UUID!) {
    deleteTRBGuidanceLetterInsight(id: $id) {
      ...TRBInsight
    }
  }
`;

export const RequestReviewForTRBGuidanceLetterQuery = gql`
  mutation RequestReviewForTRBGuidanceLetter($id: UUID!) {
    requestReviewForTRBGuidanceLetter(id: $id) {
      id
    }
  }
`;

export const SendTRBGuidanceLetterQuery = gql`
  mutation SendTRBGuidanceLetter($input: SendTRBGuidanceLetterInput!) {
    sendTRBGuidanceLetter(input: $input) {
      id
    }
  }
`;
