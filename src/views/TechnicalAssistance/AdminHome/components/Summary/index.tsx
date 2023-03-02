import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import {
  Breadcrumb,
  BreadcrumbBar,
  BreadcrumbLink,
  Button,
  Grid,
  GridContainer,
  IconError
} from '@trussworks/react-uswds';

import { GetTrbRequest_trbRequest_taskStatuses as TRBRequestTaskStatuses } from 'queries/types/GetTrbRequest';
import { TRBAttendee } from 'queries/types/TRBAttendee';
import { TRBRequestState, TRBRequestType } from 'types/graphql-global-types';

type SummaryProps = {
  trbRequestId: string;
  name: string;
  requestType: TRBRequestType;
  createdAt: string;
  state: TRBRequestState;
  taskStatuses: TRBRequestTaskStatuses;
  trbLead: string | null;
  requester: TRBAttendee;
  requesterString?: string | null;
  submissionDate: string;
};

export default function Summary({
  trbRequestId,
  name,
  requestType,
  createdAt,
  state,
  taskStatuses,
  trbLead,
  requester,
  requesterString,
  submissionDate
}: SummaryProps) {
  const { t } = useTranslation('technicalAssistance');

  /** Get current task status */
  const currentTaskStatus: keyof TRBRequestTaskStatuses = useMemo(() => {
    /** Task status object keys */
    const statusKeys = [
      'formStatus',
      'feedbackStatus',
      'attendConsultPrepStatus',
      'consultPrepStatus',
      'adviceLetterStatus'
    ] as (keyof TRBRequestTaskStatuses)[];

    /** Current step in the TRB request task list */
    // Finds first task status that is not completed
    // Returns undefined if all steps completed
    const currentStatus = statusKeys.find(
      statusKey => taskStatuses[statusKey] !== 'COMPLETED'
    );

    // Return current status
    // If all task list steps have been completed, return last step
    return currentStatus || statusKeys[-1]!;
  }, [taskStatuses]);

  /** Corresponding task status text from translation file */
  const taskStatusText: string = t(
    `adminHome.taskStatuses.${currentTaskStatus}.${taskStatuses[currentTaskStatus]}`
  );

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
              <span className="bg-info-dark text-white text-bold padding-y-05 padding-x-105 margin-x-1">
                {t(`adminHome.${state.toLowerCase()}`)}
              </span>
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
              <Button unstyled type="button" className="width-auto">
                {trbLead ? t('adminHome.change') : t('adminHome.assign')}
              </Button>
            </Grid>
          </Grid>
        </GridContainer>
      </section>
    </div>
  );
}
