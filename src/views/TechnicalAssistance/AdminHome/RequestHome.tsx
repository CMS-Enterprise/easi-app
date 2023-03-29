import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import {
  Alert,
  Button,
  CardGroup,
  Grid,
  IconArrowForward,
  Link
} from '@trussworks/react-uswds';
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
import { TRBFormStatus } from 'types/graphql-global-types';
import { TrbAdminPageProps } from 'types/technicalAssistance';
import { formatDateLocal } from 'utils/date';

import InformationCard from './components/InformationCard';
import RequestNotes from './components/RequestNotes';

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
    consultMeetingTime,
    trbLeadInfo,
    trbLeadComponent,
    documents
    // adminNotes TODO: once <Note /> PR is merge, implement adminNotes data
  } = data?.trbRequest || {};

  return (
    <div
      className="trb-admin-home__request-home"
      data-testid="trb-admin-home__request-home"
      id={`trbAdminRequestHome-${trbRequestId}`}
    >
      <Grid row gap="lg">
        <Grid tablet={{ col: 8 }}>
          <h1 className="margin-top-0 margin-bottom-4">
            {t('adminHome.subnav.requestHome')}
          </h1>
        </Grid>

        <Grid tablet={{ col: 4 }}>
          <RequestNotes trbRequestId={trbRequestId} />
        </Grid>
      </Grid>

      {loading ? (
        <PageLoading />
      ) : (
        <>
          {/* Consult details */}
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

          {/* TRB lead details */}
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

          {/* Forms and Documents */}
          <h2 className="margin-top-4 margin-bottom-3">
            {t('adminHome.formAndDocs')}
          </h2>

          {data?.trbRequest && (
            <CardGroup className="tablet:grid-col-10">
              <InformationCard
                type="inititalRequestForm"
                trbRequest={data?.trbRequest}
              />

              <InformationCard
                type="adviceLetter"
                trbRequest={data?.trbRequest}
              />
            </CardGroup>
          )}

          <p className="text-bold margin-bottom-105">
            {t('adminHome.supportingDocs')}
          </p>

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

          <UswdsReactLink
            to="documents"
            className="display-flex flex-align-center margin-top-2"
          >
            {t('adminHome.viewDocs')}
            <IconArrowForward className="margin-left-1" />
          </UswdsReactLink>
        </>
      )}
    </div>
  );
};

export default RequestHome;
