import { gql } from '@apollo/client';

export default gql`
  mutation SendReportAProblemEmail($input: SendReportAProblemEmailInput!) {
    sendReportAProblemEmail(input: $input)
  }
`;
