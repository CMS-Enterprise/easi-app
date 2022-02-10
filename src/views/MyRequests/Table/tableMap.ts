import { TFunction } from 'i18next';

import { GetRequests } from 'queries/types/GetRequests';
import { RequestType } from 'types/graphql-global-types';
import { accessibilityRequestStatusMap } from 'utils/accessibilityRequest';

// React table sorts on the data passed table.  The column configuration uses the accessor to access the field of the original dataset.
// Column cell configuration is meant to wrap data in JSX components, not modify data for sorting
// Here is where the data can be modified and used appropriately for sorting.
// Modifed data can then be configured with JSX components in column cell configuration

const tableMap = (tableData: GetRequests, t: TFunction) => {
  const requests = tableData?.requests?.edges.map(edge => {
    return edge.node;
  });

  const mappedData = requests?.map(request => {
    const name = request.name ? request.name : 'Draft';

    const type: string = request.type
      ? t(`requestsTable.types.${request.type}`)
      : '';

    let status;
    switch (request.type) {
      case RequestType.ACCESSIBILITY_REQUEST:
        // Status hasn't changed if the status record created at is the same
        // as the 508 request's submitted at
        if (
          new Date(request.submittedAt).toISOString() ===
          new Date(request.statusCreatedAt).toISOString()
        ) {
          status = accessibilityRequestStatusMap[request.status];
        }
        status = accessibilityRequestStatusMap[request.status];
        break;
      case RequestType.GOVERNANCE_REQUEST:
        status = t(`intake:statusMap.${request.status}`);
        if (request.lcid) {
          status = `${status}: ${request.lcid}`;
        }
        break;
      default:
        status = '';
        break;
    }

    return {
      ...request,
      name,
      type,
      status
    };
  });

  return mappedData || [];
};

export default tableMap;
