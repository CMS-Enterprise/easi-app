import { gql } from '@apollo/client';

const SystemIntakeGRBReviewer = gql(/* GraphQL */ `
  fragment SystemIntakeGRBReviewer on SystemIntakeGRBReviewer {
    id
    grbRole
    votingRole
    vote
    voteComment
    dateVoted
    userAccount {
      id
      username
      commonName
      email
    }
  }
`);

export default SystemIntakeGRBReviewer;
