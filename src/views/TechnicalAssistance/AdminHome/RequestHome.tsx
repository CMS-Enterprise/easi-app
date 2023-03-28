import React from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, Button, Link } from '@trussworks/react-uswds';
import { DateTime } from 'luxon';

import UswdsReactLink from 'components/LinkWrapper';
import PageLoading from 'components/PageLoading';
import Divider from 'components/shared/Divider';
import InitialsIcon from 'components/shared/InitialsIcon';
import useCacheQuery from 'hooks/useCacheQuery';
import GetTrbRequestHomeQuery from 'queries/GetTrbRequestHomeQuery';
import {
  GetTrbRequestHome as GetTrbRequestHomeType,
  GetTrbRequestHomeVariables
} from 'queries/types/GetTrbRequestHome';
import {
  TRBAdviceLetterStatus,
  TRBFormStatus
} from 'types/graphql-global-types';
import { TrbAdminPageProps } from 'types/technicalAssistance';
import { formatDateLocal } from 'utils/date';

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
    // trbLeadInfo,
    // trbLeadComponent,
    requesterInfo,
    documents
  } = data?.trbRequest || {};

  const trbLeadInfo = {
    commonName: 'Jerry Seinfeld',
    email: 'js@oddball.io'
  };
  const trbLeadComponent = 'TRB';

  return (
    <div
      className="trb-admin-home__request-home"
      data-testid="trb-admin-home__request-home"
      id={`trbAdminRequestHome-${trbRequestId}`}
    >
      <h1 className="margin-top-0 margin-bottom-4">
        {t('adminHome.subnav.requestHome')}
      </h1>

      {loading ? (
        <PageLoading />
      ) : (
        <>
          <h2 className="margin-top-4 margin-bottom-3">
            {t('adminHome.consultDetails')}
          </h2>

          <p className="text-bold margin-bottom-1">{t('adminHome.dateTime')}</p>

          {taskStatuses?.formStatus !== TRBFormStatus.COMPLETED ? (
            // Unable to set consult until initial request form complete
            <Alert type="info" slim className="margin-y-1 margin-top-2">
              {t('adminHome.reviewInitialRequest')}
            </Alert>
          ) : (
            <div>
              {!consultMeetingTime ? (
                // Set meeting time
                <UswdsReactLink
                  className="usa-button usa-button--outline margin-top-1"
                  variant="unstyled"
                  to="request/schedule-consult"
                >
                  {t('adminHome.addDateTime')}
                </UswdsReactLink>
              ) : (
                // Display meeting time
                <div className="display-flex flex-align-center">
                  <p className="margin-right-2 margin-y-0">
                    {t('adminHome.consultDate', {
                      date: formatDateLocal(consultMeetingTime, 'MM/dd/yyyy'),
                      time: DateTime.fromISO(consultMeetingTime).toLocaleString(
                        DateTime.TIME_SIMPLE
                      )
                    })}
                  </p>
                  <UswdsReactLink to="request/schedule-consult">
                    {t('adminHome.change')}
                  </UswdsReactLink>
                </div>
              )}
            </div>
          )}

          <h3 className="margin-top-4 margin-bottom-3">
            {t('adminHome.representative')}
          </h3>

          <p className="text-bold">{t('adminHome.trbLead')}</p>

          {trbLeadInfo?.commonName ? (
            <>
              <div className="display-flex flex-align-center">
                <InitialsIcon
                  name={trbLeadInfo.commonName}
                  index={0}
                  className="margin-right-1"
                />
                <p className="text-bold margin-0">
                  {trbLeadInfo.commonName}, {trbLeadComponent}
                </p>
              </div>
              <Link
                aria-label={t('adminHome.sendEmail')}
                className="line-height-body-5 margin-left-5"
                href={trbLeadInfo.email}
                target="_blank"
              >
                {trbLeadInfo.email}
              </Link>
            </>
          ) : (
            <Button
              className="usa-button--outline"
              type="button"
              onClick={() => {
                // TODO: Assign trb lead modal
              }}
            >
              {t('adminHome.assignLead')}
            </Button>
          )}

          <Divider className="margin-y-6" />
        </>
      )}
    </div>
  );
};

export default RequestHome;
