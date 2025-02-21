import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  fragment TRBAttendeeFragment on TRBRequestAttendee {
    id
    trbRequestId
    userInfo {
      commonName
      email
      euaUserId
    }
    component
    role

    createdAt
  }
`);
