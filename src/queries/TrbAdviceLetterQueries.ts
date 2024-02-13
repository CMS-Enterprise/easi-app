import { gql } from '@apollo/client';

const TRBRecommendation = gql`
  fragment TRBRecommendation on TRBAdviceLetterRecommendation {
    id
    title
    recommendation
    links
  }
`;

/** Advice letter fields fragment */
export const TRBAdviceLetter = gql`
  ${TRBRecommendation}
  fragment TRBAdviceLetter on TRBAdviceLetter {
    id
    meetingSummary
    nextSteps
    isFollowupRecommended
    dateSent
    followupPoint
    recommendations {
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

/** Get TRB advice letter and status */
export const GetTrbAdviceLetterQuery = gql`
  ${TRBAdviceLetter}
  query GetTrbAdviceLetter($id: UUID!) {
    trbRequest(id: $id) {
      id
      name
      type
      createdAt
      consultMeetingTime
      taskStatuses {
        adviceLetterStatus
      }
      adviceLetter {
        ...TRBAdviceLetter
      }
    }
  }
`;

/** Create advice letter */
export const CreateTrbAdviceLetterQuery = gql`
  ${TRBAdviceLetter}
  mutation CreateTrbAdviceLetter($trbRequestId: UUID!) {
    createTRBAdviceLetter(trbRequestId: $trbRequestId) {
      ...TRBAdviceLetter
    }
  }
`;

/** Update advice letter */
export const UpdateTrbAdviceLetterQuery = gql`
  ${TRBAdviceLetter}
  mutation UpdateTrbAdviceLetter($input: UpdateTRBAdviceLetterInput!) {
    updateTRBAdviceLetter(input: $input) {
      ...TRBAdviceLetter
    }
  }
`;

/** Get advice letter recommendations */
export const GetTrbRecommendationsQuery = gql`
  ${TRBRecommendation}
  query GetTrbRecommendations($id: UUID!) {
    trbRequest(id: $id) {
      adviceLetter {
        recommendations {
          ...TRBRecommendation
        }
      }
    }
  }
`;

/** Create advice letter recommendation */
export const CreateTrbRecommendationQuery = gql`
  ${TRBRecommendation}
  mutation CreateTRBRecommendation(
    $input: CreateTRBAdviceLetterRecommendationInput!
  ) {
    createTRBAdviceLetterRecommendation(input: $input) {
      ...TRBRecommendation
    }
  }
`;

/** Update advice letter recommendation */
export const UpdateTrbRecommendationQuery = gql`
  ${TRBRecommendation}
  mutation UpdateTRBRecommendation(
    $input: UpdateTRBAdviceLetterRecommendationInput!
  ) {
    updateTRBAdviceLetterRecommendation(input: $input) {
      ...TRBRecommendation
    }
  }
`;

/** Reorder advice letters */
export const UpdateTrbRecommendationOrderQuery = gql`
  ${TRBRecommendation}
  mutation UpdateTrbRecommendationOrder(
    $input: UpdateTRBAdviceLetterRecommendationOrderInput!
  ) {
    updateTRBAdviceLetterRecommendationOrder(input: $input) {
      ...TRBRecommendation
    }
  }
`;

/** Delete advice letter recommendation */
export const DeleteTrbRecommendationQuery = gql`
  ${TRBRecommendation}
  mutation DeleteTRBRecommendation($id: UUID!) {
    deleteTRBAdviceLetterRecommendation(id: $id) {
      ...TRBRecommendation
    }
  }
`;

export const RequestReviewForTRBAdviceLetterQuery = gql`
  mutation RequestReviewForTRBAdviceLetter($id: UUID!) {
    requestReviewForTRBAdviceLetter(id: $id) {
      id
    }
  }
`;

export const SendTRBAdviceLetterQuery = gql`
  mutation SendTRBAdviceLetter($input: SendTRBAdviceLetterInput!) {
    sendTRBAdviceLetter(input: $input) {
      id
    }
  }
`;
