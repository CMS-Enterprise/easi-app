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
import { SystemIntake_systems as System } from 'queries/types/SystemIntake';
import { TRBAttendee } from 'queries/types/TRBAttendee';
import {
  RequestRelationType,
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
  contractName: string | null;
  relationType: RequestRelationType | null;
  systems: System[];
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
  assignLeadModalTrbRequestIdRef,
  contractName,
  relationType,
  systems
}: SummaryProps) {
  const { t } = useTranslation('technicalAssistance');

  const taskStatusText: string = t(
    `adminHome.trbRequestStatuses.${taskStatus}`
  );

  return (
    <div className="easi-admin-summary">
      <section className="easi-admin-summary__request-details bg-primary-darker">
        <GridContainer className="text-white padding-bottom-1">
          {/* Breadcrumbs */}
          <BreadcrumbBar variant="wrap" className="bg-transparent text-white">
            <Breadcrumb>
              <BreadcrumbLink
                asCustom={Link}
                className="text-white text-underline"
                to="/"
              >
                {t('adminHome.home')}
              </BreadcrumbLink>
            </Breadcrumb>
            <Breadcrumb current>{t('adminHome.breadcrumb')}</Breadcrumb>
          </BreadcrumbBar>

          {/* Request summary */}
          <h2 className="margin-top-05 margin-bottom-2">{name}</h2>

          <Grid row gap>
            <Grid tablet={{ col: 8 }}>
              <h5 className="text-normal margin-y-0">
                {t('adminHome.requestType')}
              </h5>
              <h4 className="margin-top-05 margin-bottom-2">
                {t(`requestType.type.${requestType}.heading`)}
              </h4>
            </Grid>

            <Grid tablet={{ col: 4 }}>
              <h5 className="text-normal margin-y-0">
                {t('adminHome.requester')}
              </h5>
              {requesterString && (
                <h4
                  className="margin-top-05 margin-bottom-2"
                  data-testid={`trbSummary-requester_${requester.userInfo?.euaUserId}`}
                >
                  {requesterString}
                </h4>
              )}

              <h5 className="text-normal margin-y-0">
                {t('adminHome.submissionDate')}
              </h5>
              <h4
                className="margin-top-05 margin-bottom-2"
                data-testid="trbSummary-submissionDate"
              >
                {t(submissionDate)}
              </h4>
            </Grid>
          </Grid>
        </GridContainer>
      </section>

      {/* Status & admin lead info */}
      <section className="easi-admin-summary__status bg-base-lightest">
        <GridContainer className="padding-y-1">
          <Grid row gap>
            {/* Status */}
            <Grid desktop={{ col: 8 }}>
              <div>
                <h4 className="margin-right-1">{t('adminHome.status')}</h4>
                <StateTag state={state} />
              </div>
              <p className="text-base-dark" data-testid="trbSummary-status">
                {taskStatusText}
              </p>
            </Grid>

            {/* TRB Lead */}
            <Grid tablet={{ col: 4 }} data-testid="trbSummary-trbLead">
              <h4 className="text-no-wrap width-full tablet:width-auto">
                {t('adminHome.trbLead')}
              </h4>
              <span className="display-flex flex-align-center">
                {!trbLead && (
                  <IconError className="text-error margin-right-05" />
                )}
                {trbLead || t('adminHome.notAssigned')}
              </span>
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
