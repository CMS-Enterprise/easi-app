import { TFunction } from 'i18next';

import {
  GetRequests,
  GetRequests_myTrbRequests as GetTRBRequestsType,
  GetRequests_requests_edges_node as GetRequestsType
} from 'queries/types/GetRequests';
import { RequestType } from 'types/graphql-global-types';

// React table sorts on the data passed table.  The column configuration uses the accessor to access the field of the original dataset.
// Column cell configuration is meant to wrap data in JSX components, not modify data for sorting
// Here is where the data can be modified and used appropriately for sorting.
// Modifed data can then be configured with JSX components in column cell configuration

type MergedRequests = GetRequestsType | GetTRBRequestsType;

// Type guard for checking request is of type GetTRBRequestsType/TRB
// https://www.typescriptlang.org/docs/handbook/advanced-types.html#type-guards-and-differentiating-types
export const isTRBRequestType = (
  request: MergedRequests
): request is GetTRBRequestsType => {
  /* eslint no-underscore-dangle: 0 */
  return request.__typename === 'TRBRequest';
};

const tableMap = (
  tableData: GetRequests,
  t: TFunction,
  requestType?: RequestType
) => {
  const requests: GetRequestsType[] =
    tableData?.requests?.edges
      .filter(data => data.node.statusRequester !== 'CLOSED')
      .map(edge => {
        return edge.node;
      }) || ([] as GetRequestsType[]);

  const myTrbRequests: GetTRBRequestsType[] = tableData?.myTrbRequests || [];

  const mergedRequests: MergedRequests[] = [...requests, ...myTrbRequests];

  const mappedData = mergedRequests
    ?.filter(request =>
      !requestType
        ? true
        : !isTRBRequestType(request) && request.type === requestType
    ) // if filter prop exists, filter by the request type
    .map(request => {
      const name = request.name ? request.name : 'Draft';

      const type: string =
        !isTRBRequestType(request) && request.type
          ? t(`requestsTable.types.${request.type}`)
          : t(`requestsTable.types.TRB`);

      return {
        ...request,
        name,
        type
      };
    });

  return mappedData || [];
};

export default tableMap;
