import { gql } from '@apollo/client';

const TRBGuidanceLetterInsight = gql`
  fragment TRBGuidanceLetterInsight on TRBGuidanceLetterRecommendation {
    id
    title
    recommendation
    links
  }
`;

/** Guidance letter fields fragment */
export const TRBGuidanceLetter = gql`
  ${TRBGuidanceLetterInsight}
  fragment TRBGuidanceLetter on TRBGuidanceLetter {
    id
    meetingSummary
    nextSteps
    isFollowupRecommended
    dateSent
    followupPoint
    insights {
      ...TRBGuidanceLetterInsight
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

/** Get guidance letter recommendations */
export const GetTrbRecommendationsQuery = gql`
  ${TRBGuidanceLetterInsight}
  query GetTrbRecommendations($id: UUID!) {
    trbRequest(id: $id) {
      guidanceLetter {
        insights {
          ...TRBGuidanceLetterInsight
        }
      }
    }
  }
`;

/** Create guidance letter recommendation */
export const CreateTrbRecommendationQuery = gql`
  ${TRBGuidanceLetterInsight}
  mutation CreateTRBRecommendation(
    $input: CreateTRBGuidanceLetterRecommendationInput!
  ) {
    createTRBGuidanceLetterRecommendation(input: $input) {
      ...TRBGuidanceLetterInsight
    }
  }
`;

/** Update guidance letter recommendation */
export const UpdateTrbRecommendationQuery = gql`
  ${TRBGuidanceLetterInsight}
  mutation UpdateTRBRecommendation(
    $input: UpdateTRBGuidanceLetterRecommendationInput!
  ) {
    updateTRBGuidanceLetterRecommendation(input: $input) {
      ...TRBGuidanceLetterInsight
    }
  }
`;

/** Reorder guidance letters */
export const UpdateTrbRecommendationOrderQuery = gql`
  ${TRBGuidanceLetterInsight}
  mutation UpdateTrbRecommendationOrder(
    $input: UpdateTRBGuidanceLetterRecommendationOrderInput!
  ) {
    updateTRBGuidanceLetterRecommendationOrder(input: $input) {
      ...TRBGuidanceLetterInsight
    }
  }
`;

/** Delete guidance letter recommendation */
export const DeleteTrbRecommendationQuery = gql`
  ${TRBGuidanceLetterInsight}
  mutation DeleteTRBRecommendation($id: UUID!) {
    deleteTRBGuidanceLetterRecommendation(id: $id) {
      ...TRBGuidanceLetterInsight
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
