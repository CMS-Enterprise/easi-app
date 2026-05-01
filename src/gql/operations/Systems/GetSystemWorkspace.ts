import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  query GetSystemWorkspace($cedarSystemId: UUID!) {
    cedarSystemWorkspace(cedarSystemId: $cedarSystemId) {
      id
      isMySystem
      cedarSystem {
        id
        name
        isBookmarked
        viewerCanAccessProfile
        linkedTrbRequests(state: OPEN) {
          id
        }
        linkedSystemIntakes(state: OPEN) {
          id
        }
      }
      roles {
        ...CedarRoleFragment
      }
    }
  }
`);
