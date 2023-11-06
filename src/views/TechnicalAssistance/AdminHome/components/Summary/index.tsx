import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import {
  Breadcrumb,
  BreadcrumbBar,
  BreadcrumbLink,
  Grid,
  GridContainer,
  IconError,
  ModalRef
} from '@trussworks/react-uswds';

import StateTag from 'components/StateTag';
import { TRBAttendee } from 'queries/types/TRBAttendee';
import {
  TRBRequestState,
  TRBRequestStatus,
  TRBRequestType
} from 'types/graphql-global-types';
import { TrbRequestIdRef } from 'types/technicalAssistance';

import { TrbAssignLeadModalOpener } from '../../TrbAssignLeadModal';

type SummaryProps = {
  trbRequestId: string;
  name: string | null;
  requestType: TRBRequestType;
  state: TRBRequestState;
  taskStatus?: TRBRequestStatus;
  trbLead: string | null;
  requester: TRBAttendee;
  requesterString?: string | null;
  submissionDate: string;
  assignLeadModalRef: React.RefObject<ModalRef>;
  assignLeadModalTrbRequestIdRef: React.MutableRefObject<TrbRequestIdRef>;
};

export default function Summary({
  trbRequestId,
  name,
  requestType,
  state,
  taskStatus,
  trbLead,
  requester,
  requesterString,
  submissionDate,
  assignLeadModalRef,
  assignLeadModalTrbRequestIdRef
}: SummaryProps) {
  const { t } = useTranslation('technicalAssistance');

  const taskStatusText: string = t(
    `adminHome.trbRequestStatuses.${taskStatus}`
  );

  return (
    <div className="trb-admin-home__summary">
      <section className="bg-primary-darker padding-bottom-3 text-white">
        <GridContainer>
          {/* Breadcrumbs */}
          <BreadcrumbBar variant="wrap" className="bg-transparent text-white">
            <Breadcrumb>
              <BreadcrumbLink asCustom={Link} to="/">
                <span className="text-white">{t('adminHome.home')}</span>
              </BreadcrumbLink>
            </Breadcrumb>
            <Breadcrumb current>{t('adminHome.breadcrumb')}</Breadcrumb>
          </BreadcrumbBar>

          {/* Request name */}
          <h2 className="margin-top-05 margin-bottom-0">{name}</h2>

          {/* Request details */}
          <Grid row>
            <Grid tablet={{ col: 8 }}>
              {/* Request type */}
              <div
                data-testid="trbSummary-requestType"
                className="margin-top-2 margin-bottom-05"
              >
                <h5 className="text-normal margin-y-0">
                  {t('adminHome.requestType')}
                </h5>
                <h4 className="margin-y-05">
                  {t(`requestType.type.${requestType}.heading`)}
                </h4>
              </div>
            </Grid>
            <Grid tablet={{ col: 4 }}>
              {/* Requester */}
              <div className="margin-top-2 margin-bottom-05">
                <h5 className="text-normal margin-y-0">
                  {t('adminHome.requester')}
                </h5>
                {requesterString && (
                  <h4
                    className="margin-y-05"
                    data-testid={`trbSummary-requester_${requester.userInfo?.euaUserId}`}
                  >
                    {requesterString}
                  </h4>
                )}
              </div>
              {/* Submission date */}
              <div
                data-testid="trbSummary-submissionDate"
                className="margin-top-2 margin-bottom-05"
              >
                <h5 className="text-normal margin-y-0">
                  {t('adminHome.submissionDate')}
                </h5>
                <h4 className="margin-y-05">{t(submissionDate)}</h4>
              </div>
            </Grid>
          </Grid>
        </GridContainer>
      </section>

      {/* Status bar */}
      <section className="bg-base-lightest padding-y-05">
        <GridContainer>
          <Grid row>
            {/* Status */}
            <Grid
              tablet={{ col: 8 }}
              data-testid="trbSummary-status"
              className="display-flex flex-align-center margin-y-05"
            >
              <h4 className="margin-y-0">{t('adminHome.status')}</h4>
              <StateTag state={state} />
              <p className="margin-y-0 text-base">{taskStatusText}</p>
            </Grid>

            {/* TRB Lead */}
            <Grid
              tablet={{ col: 4 }}
              data-testid="trbSummary-trbLead"
              className="display-flex flex-align-center margin-y-05"
            >
              <h4 className="margin-y-0">{t('adminHome.trbLead')}</h4>
              <p className="margin-y-0 margin-x-1 display-flex flex-align-center">
                {
                  // Display trb lead name or not assigned
                  trbLead || (
                    <>
                      <IconError className="text-error margin-right-05" />
                      {t('adminHome.notAssigned')}
                    </>
                  )
                }
              </p>
              <TrbAssignLeadModalOpener
                trbRequestId={trbRequestId}
                modalRef={assignLeadModalRef}
                trbRequestIdRef={assignLeadModalTrbRequestIdRef}
                className="usa-button--unstyled width-auto"
              >
                {trbLead ? t('adminHome.change') : t('adminHome.assign')}
              </TrbAssignLeadModalOpener>
            </Grid>
          </Grid>
        </GridContainer>
      </section>
    </div>
  );
}
