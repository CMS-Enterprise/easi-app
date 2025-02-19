import { SystemIntakeStatusRequester } from 'gql/generated/graphql';

export interface MergedRequestsForTable {
  id: string;
  name: string;
  type: 'TRB' | 'IT Governance';
  process: 'TRB' | 'IT Governance';
  status: string;
  submissionDate: string | null;
  systems: string[];
  nextMeetingDate: string | null;
  lcid: string | null;
  statusRequester?: SystemIntakeStatusRequester;
}
