import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  mutation SendReportAProblemEmail($input: SendReportAProblemEmailInput!) {
    sendReportAProblemEmail(input: $input)
  }
`);
