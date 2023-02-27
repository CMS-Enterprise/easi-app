import { gql } from '@apollo/client';

/** Advice letter fields fragment */
const TRBAdviceLetter = gql`
  fragment TRBAdviceLetter on TRBAdviceLetter {
    id
    meetingSummary
    nextSteps
    isFollowupRecommended
    dateSent
    followupPoint
    recommendations {
      id
      title
      recommendation
      links
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
      name
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
