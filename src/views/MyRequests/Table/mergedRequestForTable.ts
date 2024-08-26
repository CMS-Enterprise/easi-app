export interface MergedRequestsForTable {
  id: string;
  name: string;
  process: 'TRB' | 'IT Governance';
  status: string;
  submissionDate: string | null;
  systems: string[];
  nextMeetingDate: string | null;
  lcid: string | null;
}
