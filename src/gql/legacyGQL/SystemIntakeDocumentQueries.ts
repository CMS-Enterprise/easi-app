import { gql } from '@apollo/client';

export const SystemIntakeDocument = gql`
  fragment SystemIntakeDocument on SystemIntakeDocument {
    documentType {
      commonType
      otherTypeDescription
    }
    id
    fileName
    version
    status
    uploadedAt
    url
    canView
    canDelete
    systemIntakeId
  }
`;

export default SystemIntakeDocument;
