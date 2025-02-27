import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  fragment SystemIntakeGRBPresentationLinksFragment on SystemIntakeGRBPresentationLinks {
    recordingLink
    recordingPasscode
    transcriptFileName
    transcriptFileStatus
    transcriptFileURL
    transcriptLink
    presentationDeckFileName
    presentationDeckFileStatus
    presentationDeckFileURL
  }
`);
