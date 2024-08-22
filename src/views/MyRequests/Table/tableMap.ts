import {
  GetRequests,
  GetRequests_mySystemIntakes as GetSystemIntakesType,
  GetRequests_myTrbRequests as GetTRBRequestsType
} from 'queries/types/GetRequests';

interface MergedRequestsForTable {
  id: string;
  name: string;
  process: 'TRB' | 'IT Governance';
  status: string;
  submissionDate: string;
  systems: string[];
  nextMeetingDate: string;
}

// React table sorts on the data passed table.  The column configuration uses the accessor to access the field of the original dataset.
// Column cell configuration is meant to wrap data in JSX components, not modify data for sorting
// Here is where the data can be modified and used appropriately for sorting.
// Modifed data can then be configured with JSX components in column cell configuration

type MergedRequests = GetSystemIntakesType | GetTRBRequestsType;

// Type guard for checking request is of type GetTRBRequestsType/TRB
// https://www.typescriptlang.org/docs/handbook/advanced-types.html#type-guards-and-differentiating-types
export const isTRBRequestType = (
  request: MergedRequests
): request is GetTRBRequestsType => {
  /* eslint no-underscore-dangle: 0 */
  return request.__typename === 'TRBRequest';
};

const calcSystemIntakeNextMeetingDate = (
  grb: string | null,
  grt: string | null
): string | null => {
  if (grb === null && grt === null) {
    return null;
  }

  if (grb === null) {
    return grt;
  }

  if (grt === null) {
    return grb;
  }

  // attempt to parse
  const grbDate = Date.parse(grb);
  const grtDate = Date.parse(grt);

  // return latest of the two
  if (grbDate > grtDate) {
    return grb;
  }

  return grt;
};

const tableMap = (tableData: GetRequests) => {
  const merged: MergedRequestsForTable[] = [];

  tableData.mySystemIntakes.forEach((systemIntake: GetSystemIntakesType) => {
    const nextDate = calcSystemIntakeNextMeetingDate(
      systemIntake.grbDate,
      systemIntake.grtDate
    );
    merged.push({
      id: systemIntake.id,
      name: systemIntake.requestName || 'Draft',
      nextMeetingDate: nextDate !== null ? nextDate : 'None',
      process: 'IT Governance',
      status: '',
      submissionDate: systemIntake.submittedAt || 'Not submitted',
      systems: systemIntake.systems.map(system => system.name)
    });
  });

  tableData.myTrbRequests.forEach((trbRequest: GetTRBRequestsType) => {
    merged.push({
      id: trbRequest.id,
      name: trbRequest.name || 'Draft',
      nextMeetingDate: trbRequest.nextMeetingDate || 'None',
      process: 'TRB',
      status: '',
      submissionDate: trbRequest.submittedAt || 'Not yet submitted',
      systems: trbRequest.systems.map(system => system.name)
    });
  });

  return merged;
};

export default tableMap;
