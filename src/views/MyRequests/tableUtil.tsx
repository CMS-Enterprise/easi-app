import { TFunction } from 'i18next';
import { DateTime } from 'luxon';

import { GetRequests } from 'queries/types/GetRequests';
import { RequestType } from 'types/graphql-global-types';
import { accessibilityRequestStatusMap } from 'utils/accessibilityRequest';
import { formatDate } from 'utils/date';

const mapRequestData = (tableData: GetRequests, t: TFunction) => {
  const requests = tableData?.requests?.edges.map(edge => {
    return edge.node;
  });

  const mappedData = requests?.map(request => {
    const submittedAt = request.submittedAt
      ? formatDate(DateTime.fromISO(request.submittedAt))
      : t('requestsTable.defaultSubmittedAt');

    const name = request.name ? request.name : 'Draft';

    const type: string = request.type
      ? t(`requestsTable.types.${request.type}`)
      : '';

    const nextMeetingDate = request.nextMeetingDate
      ? formatDate(request.submittedAt)
      : 'None';

    const statusCreatedAt = request.statusCreatedAt
      ? DateTime.fromISO(request.statusCreatedAt)
      : null;

    let status;
    switch (request.status) {
      case RequestType.ACCESSIBILITY_REQUEST:
        // Status hasn't changed if the status record created at is the same
        // as the 508 request's submitted at
        if (request.submittedAt.toISO() === request.statusCreatedAt.toISO()) {
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
      submittedAt,
      statusCreatedAt,
      nextMeetingDate,
      name,
      type,
      status
    };
  });

  return mappedData || [];
};

export default mapRequestData;
