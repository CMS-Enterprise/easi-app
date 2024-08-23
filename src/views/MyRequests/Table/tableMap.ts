import {
  GetRequests_mySystemIntakes as GetSystemIntakesType,
  GetRequests_myTrbRequests as GetTRBRequestsType
} from 'queries/types/GetRequests';

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
