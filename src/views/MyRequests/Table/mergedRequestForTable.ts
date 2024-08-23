export interface MergedRequestsForTable {
  id: string;
  name: string;
  process: 'TRB' | 'IT Governance';
  status: string;
  submissionDate: string | null;
  systems: string[];
  nextMeetingDate: string;
  lcid: string | null;
}
