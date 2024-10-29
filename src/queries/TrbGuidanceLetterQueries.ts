import { gql } from '@apollo/client';

const TRBGuidanceLetterInsight = gql`
  fragment TRBGuidanceLetterInsight on TRBGuidanceLetterRecommendation {
    id
    title
    recommendation
    links
  }
`;

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

export const CreateTrbGuidanceLetterQuery = gql`
  ${TRBGuidanceLetter}
  mutation CreateTrbGuidanceLetter($trbRequestId: UUID!) {
    createTRBGuidanceLetter(trbRequestId: $trbRequestId) {
      ...TRBGuidanceLetter
    }
  }
`;

export const UpdateTrbGuidanceLetterQuery = gql`
  ${TRBGuidanceLetter}
  mutation UpdateTrbGuidanceLetter($input: UpdateTRBGuidanceLetterInput!) {
    updateTRBGuidanceLetter(input: $input) {
      ...TRBGuidanceLetter
    }
  }
`;

export const GetTRBGuidanceLetterInsightsQuery = gql`
  ${TRBGuidanceLetterInsight}
  query GetTRBGuidanceLetterInsights($id: UUID!) {
    trbRequest(id: $id) {
      guidanceLetter {
        insights {
          ...TRBGuidanceLetterInsight
        }
      }
    }
  }
`;

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
