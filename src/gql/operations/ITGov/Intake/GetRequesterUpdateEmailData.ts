import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  query GetRequesterUpdateEmailData {
    requesterUpdateEmailData {
      lcidStatus
      lcidIssuedAt
      lcidExpiresAt
      lcidRetiresAt
      requesterEmail
    }
  }
`);
