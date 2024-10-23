import { gql } from '@apollo/client';

const TRBRecommendation = gql`
  fragment TRBRecommendation on TRBGuidanceLetterRecommendation {
    id
    title
    recommendation
    links
  }
`;

/** Guidance letter fields fragment */
export const TRBGuidanceLetter = gql`
  ${TRBRecommendation}
  fragment TRBGuidanceLetter on TRBGuidanceLetter {
    id
    meetingSummary
    nextSteps
    isFollowupRecommended
    dateSent
    followupPoint
    insights {
      ...TRBRecommendation
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
  ${TRBRecommendation}
  query GetTrbRecommendations($id: UUID!) {
    trbRequest(id: $id) {
      guidanceLetter {
        insights {
          ...TRBRecommendation
        }
      }
    }
  }
`;

/** Create guidance letter recommendation */
export const CreateTrbRecommendationQuery = gql`
  ${TRBRecommendation}
  mutation CreateTRBRecommendation(
    $input: CreateTRBGuidanceLetterRecommendationInput!
  ) {
    createTRBGuidanceLetterRecommendation(input: $input) {
      ...TRBRecommendation
    }
  }
`;

/** Update guidance letter recommendation */
export const UpdateTrbRecommendationQuery = gql`
  ${TRBRecommendation}
  mutation UpdateTRBRecommendation(
    $input: UpdateTRBGuidanceLetterRecommendationInput!
  ) {
    updateTRBGuidanceLetterRecommendation(input: $input) {
      ...TRBRecommendation
    }
  }
`;

/** Reorder guidance letters */
export const UpdateTrbRecommendationOrderQuery = gql`
  ${TRBRecommendation}
  mutation UpdateTrbRecommendationOrder(
    $input: UpdateTRBGuidanceLetterRecommendationOrderInput!
  ) {
    updateTRBGuidanceLetterRecommendationOrder(input: $input) {
      ...TRBRecommendation
    }
  }
`;

/** Delete guidance letter recommendation */
export const DeleteTrbRecommendationQuery = gql`
  ${TRBRecommendation}
  mutation DeleteTRBRecommendation($id: UUID!) {
    deleteTRBGuidanceLetterRecommendation(id: $id) {
      ...TRBRecommendation
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
