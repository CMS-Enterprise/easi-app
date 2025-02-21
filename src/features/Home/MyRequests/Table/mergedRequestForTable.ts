import { SystemIntakeStatusRequester } from 'gql/generated/graphql';

export interface MergedRequestsForTable {
  id: string;
  name: string;
  type: 'TRB' | 'IT Governance';
  process: 'TRB' | 'IT Governance';
  status: string;
  submissionDate: string | null | undefined;
  systems: string[];
  nextMeetingDate: string | null | undefined;
  lcid: string | null | undefined;
  statusRequester?: SystemIntakeStatusRequester;
}
