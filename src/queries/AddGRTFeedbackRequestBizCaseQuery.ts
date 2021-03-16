import { gql } from '@apollo/client';

export default gql`
  mutation AddGRTFeedbackRequestBizCase($input: AddGRTFeedbackInput!) {
    addGRTFeedbackAndRequestBusinessCase(input: $input) {
      id
    }
  }
`;
