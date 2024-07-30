export interface LinkedRequestForTable {
  id: string;
  projectTitle: string;
  process: 'TRB' | 'IT Governance';
  contractNumber: string;
  status: string;
  submissionDate: string;
}

const tableMap = (tableData: LinkedRequestForTable[]) => {};
