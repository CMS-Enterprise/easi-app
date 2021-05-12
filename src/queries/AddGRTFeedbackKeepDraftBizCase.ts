import { gql } from '@apollo/client';

export default gql`
  mutation AddGRTFeedbackKeepDraftBizCase($input: AddGRTFeedbackInput!) {
    addGRTFeedbackAndKeepBusinessCaseInDraft(input: $input) {
      id
    }
  }
`;
