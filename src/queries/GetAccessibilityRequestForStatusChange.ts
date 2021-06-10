import { gql } from '@apollo/client';

const GetAccessibilityRequestForStatusChange = gql`
  query accessibilityRequest($id: UUID!) {
    accessibilityRequest(id: $id) {
      id
      name
      statusRecord {
        status
      }
    }
  }
`;

export default GetAccessibilityRequestForStatusChange;
