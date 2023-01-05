import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import {
  Breadcrumb,
  BreadcrumbBar,
  BreadcrumbLink,
  Grid,
  GridContainer,
  IconError
} from '@trussworks/react-uswds';
import { DateTime } from 'luxon';

import cmsDivisionsAndOffices from 'constants/enums/cmsDivisionsAndOffices';
import useTRBAttendees from 'hooks/useTRBAttendees';
import { GetTrbRequest_trbRequest_taskStatuses as TRBRequestTaskStatuses } from 'queries/types/GetTrbRequest';
import { TRBRequestStatus, TRBRequestType } from 'types/graphql-global-types';

type SummaryProps = {
  trbRequestId: string;
  name: string;
  requestType: TRBRequestType;
  createdAt: string;
  status: TRBRequestStatus;
  taskStatuses: TRBRequestTaskStatuses;
  trbLead: string | null;
};

export default function Summary({
  trbRequestId,
  name,
  requestType,
  createdAt,
  status,
  taskStatuses,
  trbLead
}: SummaryProps) {
  const { t } = useTranslation('technicalAssistance');

  /**
   * Request submission date for summary
   */
  const submissionDate = createdAt
    ? DateTime.fromISO(createdAt).toLocaleString(DateTime.DATE_FULL)
    : '';

  // Get requester object from request attendees
  const {
    data: { requester }
  } = useTRBAttendees(trbRequestId);

  /**
   * Requester info for display in summary box
   */
  const requesterString = useMemo(() => {
    // If requester component is not set, return name
    if (!requester.component) return requester?.userInfo?.commonName;

    /** Component acronym */
    const componentAcronym = cmsDivisionsAndOffices.find(
      object => object.name === requester.component
    );

    // Return requester name and component acronym
    return `${requester?.userInfo?.commonName}, ${componentAcronym}`;
  }, [requester]);

  /**
   * Text describing current task status
   */
  const taskStatusText: string | undefined = useMemo(() => {
    /** Array of status keys in order of appearance in task list */
    const statusKeysArray = [
      'formStatus',
      'feedbackStatus',
      'consultPrepStatus',
      'attendConsultStatus'
    ] as (keyof TRBRequestTaskStatuses)[];

    /** Current step in the TRB request task list */
    // Finds first task status that is not completed
    // Returns undefined if all steps completed
    let currentStatus = statusKeysArray.find(
      statusKey =>
        statusKey !== '__typename' && taskStatuses[statusKey] !== 'COMPLETED'
    );

    // If all task list steps have been completed, set current status to attendConsultStatus
    if (!currentStatus) {
      currentStatus = 'attendConsultStatus';
    }

    // Return corresponding status text from translation file
    return t(
      `adminHome.taskStatuses.${currentStatus}.${taskStatuses[currentStatus]}`
    );
  }, [t, taskStatuses]);

  return (
    <div className="trb-admin-home__summary">
      <section className="bg-primary-darker padding-bottom-3 text-white">
        <GridContainer>
          {/* Breadcrumbs */}
          <BreadcrumbBar variant="wrap" className="bg-transparent text-white">
            <Breadcrumb>
              <BreadcrumbLink asCustom={Link} to="/">
                <span className="text-white">{t('Home')}</span>
              </BreadcrumbLink>
            </Breadcrumb>
            <Breadcrumb current>
              {t('adminHome.breadcrumb', { trbRequestId })}
            </Breadcrumb>
          </BreadcrumbBar>

          {/* Request name */}
          <h2 className="margin-top-05 margin-bottom-0">{name}</h2>

          {/* Request details */}
          <Grid row>
            <Grid col tablet={{ col: 8 }}>
              {/* Request type */}
              <h5 className="text-normal margin-bottom-05 margin-top-2">
                {t('adminHome.requestType')}
              </h5>
              <h4 className="margin-y-05">
                {t(`requestType.type.${requestType}.heading`)}
              </h4>
            </Grid>
            <Grid col tablet={{ col: 4 }}>
              {/* Requester */}
              <h5 className="text-normal margin-bottom-05 margin-top-2">
                {t('adminHome.requester')}
              </h5>
              <h4 className="margin-y-05">{requesterString}</h4>
              {/* Submission date */}
              <h5 className="text-normal margin-bottom-05 margin-top-2">
                {t('adminHome.submissionDate')}
              </h5>
              <h4 className="margin-y-05">{t(submissionDate)}</h4>
            </Grid>
          </Grid>
        </GridContainer>
      </section>

      {/* Status bar */}
      <section className="bg-base-lightest padding-y-1">
        <GridContainer>
          <Grid row>
            {/* Status */}
            <Grid
              col
              tablet={{ col: 8 }}
              className="display-flex flex-align-center"
            >
              <h4 className="margin-y-0">{t('adminHome.status')}</h4>
              <span className="bg-info-dark text-white text-bold padding-y-1 padding-x-105 margin-x-1">
                {t(`adminHome.${status.toLowerCase()}`)}
              </span>
              <p className="margin-y-0 text-base">{taskStatusText}</p>
            </Grid>

            {/* TRB Lead */}
            <Grid
              col
              tablet={{ col: 4 }}
              className="display-flex flex-align-center"
            >
              <h4 className="margin-y-0">{t('adminHome.trbLead')}</h4>
              <p className="margin-y-0 margin-left-1 display-flex flex-align-center">
                {
                  /**
                   * If TRB lead is set, display name
                   * Otherwise, display Not Assigned and link to assign
                   */
                  trbLead || (
                    <>
                      <IconError className="text-error margin-right-05" />
                      {t('adminHome.notAssigned')}
                      <Link to="/" className="margin-left-1">
                        {t('adminHome.assign')}
                      </Link>
                    </>
                  )
                }
              </p>
            </Grid>
          </Grid>
        </GridContainer>
      </section>
    </div>
  );
}
