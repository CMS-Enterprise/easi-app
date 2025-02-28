import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { CardGroup, Icon, Link } from '@trussworks/react-uswds';
import {
  TRBRequestStatus,
  useGetTRBRequestHomeQuery
} from 'gql/generated/graphql';
import { DateTime } from 'luxon';

import Alert from 'components/Alert';
import { AvatarCircle } from 'components/Avatar/Avatar';
import Divider from 'components/Divider';
import UswdsReactLink from 'components/LinkWrapper';
import PageLoading from 'components/PageLoading';
import { TrbAdminPageProps } from 'types/technicalAssistance';
import { formatDateLocal } from 'utils/date';
import { getPersonNameAndComponentVal } from 'utils/getPersonNameAndComponent';

import InformationCard from '../_components/InformationCard';
import TrbAdminWrapper from '../_components/TrbAdminWrapper';
import { TrbAssignLeadModalOpener } from '../_components/TrbAssignLeadModal';

const RequestHome = ({
  trbRequest,
  assignLeadModalRef,
  assignLeadModalTrbRequestIdRef
}: TrbAdminPageProps) => {
  const { t } = useTranslation('technicalAssistance');

  const { id } = trbRequest;

  const { data, loading } = useGetTRBRequestHomeQuery({
    variables: { id }
  });

  const { consultMeetingTime, trbLeadInfo, documents } = data?.trbRequest || {};

  if (loading) return <PageLoading />;

  return (
    <TrbAdminWrapper
      activePage="request"
      trbRequestId={id}
      title={t('adminHome.requestHome')}
      noteCount={trbRequest.adminNotes.length}
      adminActionProps={{
        status: trbRequest.status,
        state: trbRequest.state,
        assignLeadModalTrbRequestIdRef,
        assignLeadModalRef
      }}
    >
      {data?.trbRequest && (
        /* Consult details */
        <>
          <h2 className="margin-top-4 margin-bottom-3">
            {t('adminHome.consultDetails')}
          </h2>

          <p className="text-bold margin-bottom-1">{t('adminHome.dateTime')}</p>

          {trbRequest.status === TRBRequestStatus.REQUEST_FORM_COMPLETE ||
          trbRequest.status === TRBRequestStatus.DRAFT_REQUEST_FORM ||
          trbRequest.status === TRBRequestStatus.NEW ? (
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

          {/* TRB lead details */}
          <h3 className="margin-top-4 margin-bottom-3">
            {t('adminHome.representative')}
          </h3>

          <p className="text-bold">{t('adminHome.trbLead')}</p>

          {trbLeadInfo?.commonName ? (
            <>
              <div className="display-flex flex-align-center">
                <AvatarCircle
                  user={trbLeadInfo.commonName}
                  className="margin-right-1"
                />
                <p className="text-bold margin-0">
                  {getPersonNameAndComponentVal(trbLeadInfo.commonName, 'TRB')}
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
            <TrbAssignLeadModalOpener
              trbRequestId={trbRequest.id}
              modalRef={assignLeadModalRef}
              trbRequestIdRef={assignLeadModalTrbRequestIdRef}
              className="usa-button--outline"
            >
              {t('adminHome.assignLead')}
            </TrbAssignLeadModalOpener>
          )}

          <Divider className="margin-top-6 margin-bottom-5" />

          {/* Forms and Documents */}
          <h2 className="margin-y-3">{t('adminHome.formAndDocs')}</h2>

          <CardGroup className="tablet:grid-col-10">
            <InformationCard
              type="initialRequestForm"
              trbRequest={data?.trbRequest}
            />

            <InformationCard
              type="guidanceLetter"
              trbRequest={data?.trbRequest}
            />
          </CardGroup>

          <p className="text-bold margin-bottom-105">
            {t('adminHome.supportingDocs')}
          </p>

          {/* Documents count */}
          <div data-testid="document-count">
            <Trans
              i18nKey={
                documents?.length === 1
                  ? 'technicalAssistance:adminHome.docInfo'
                  : 'technicalAssistance:adminHome.docInfoPlural'
              }
              components={{
                bold: <span className="text-bold" />,
                docCount: documents?.length || 0
              }}
            />
          </div>

          <UswdsReactLink
            to="documents"
            className="display-flex flex-align-center margin-top-2"
          >
            {t('adminHome.viewDocs')}
            <Icon.ArrowForward className="margin-left-1" />
          </UswdsReactLink>
        </>
      )}
    </TrbAdminWrapper>
  );
};

export default RequestHome;
