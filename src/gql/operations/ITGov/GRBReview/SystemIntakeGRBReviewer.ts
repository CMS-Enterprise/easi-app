import { gql } from '@apollo/client';

const SystemIntakeGRBReviewer = gql(/* GraphQL */ `
  fragment SystemIntakeGRBReviewer on SystemIntakeGRBReviewer {
    id
    grbRole
    votingRole
    userAccount {
      id
      username
      commonName
      email
    }
  }
`);

export default SystemIntakeGRBReviewer;
