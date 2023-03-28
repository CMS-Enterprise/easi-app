import React from 'react';
import { useTranslation } from 'react-i18next';

import PageLoading from 'components/PageLoading';
import useCacheQuery from 'hooks/useCacheQuery';
import GetTrbRequestHomeQuery from 'queries/GetTrbRequestHomeQuery';
import {
  GetTrbRequestHome as GetTrbRequestHomeType,
  GetTrbRequestHomeVariables
} from 'queries/types/GetTrbRequestHome';
import { TrbAdminPageProps } from 'types/technicalAssistance';

const RequestHome = ({ trbRequestId }: TrbAdminPageProps) => {
  const { t } = useTranslation('technicalAssistance');

  const { data, loading } = useCacheQuery<
    GetTrbRequestHomeType,
    GetTrbRequestHomeVariables
  >(GetTrbRequestHomeQuery, {
    variables: { id: trbRequestId }
  });

  const {
    taskStatuses,
    form,
    adviceLetter,
    consultMeetingTime,
    trbLeadInfo,
    trbLeadComponent,
    requesterInfo,
    documents
  } = data?.trbRequest || {};

  return (
    <div
      className="trb-admin-home__request-home"
      data-testid="trb-admin-home__request-home"
      id={`trbAdminRequestHome-${trbRequestId}`}
    >
      <h1 className="margin-y-0">{t('adminHome.subnav.requestHome')}</h1>

      {loading ? <PageLoading /> : <></>}
    </div>
  );
};

export default RequestHome;
