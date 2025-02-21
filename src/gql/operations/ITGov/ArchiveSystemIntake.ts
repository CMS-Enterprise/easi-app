import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  mutation ArchiveSystemIntake($id: UUID!) {
    archiveSystemIntake(id: $id) {
      id
      archivedAt
    }
  }
`);
