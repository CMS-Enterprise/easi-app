import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  fragment SystemIntakeDocumentFragment on SystemIntakeDocument {
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
`);
