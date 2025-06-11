import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import {
  Breadcrumb,
  BreadcrumbBar,
  BreadcrumbLink,
  Grid,
  GridContainer,
  Icon,
  ModalRef
} from '@trussworks/react-uswds';
import {
  GetTRBRequestSummaryQuery,
  RequestRelationType,
  TRBRequestState,
  TRBRequestStatus,
  TRBRequestType
} from 'gql/generated/graphql';

import AdminRequestHeaderSummary from 'components/AdminRequestHeaderSummary';
import StateTag from 'components/StateTag';
import { TRBAttendee, TrbRequestIdRef } from 'types/technicalAssistance';

import { TrbAssignLeadModalOpener } from '../TrbAssignLeadModal';

type SummaryProps = {
  trbRequestId: string;
  name: string;
  requestType: TRBRequestType;
  state: TRBRequestState;
  taskStatus?: TRBRequestStatus;
  trbLead: string | null;
  requester: TRBAttendee;
  requesterString?: string | null;
  submittedAt: string;
  assignLeadModalRef: React.RefObject<ModalRef>;
  assignLeadModalTrbRequestIdRef: React.MutableRefObject<TrbRequestIdRef>;
  contractNumbers: string[];
  contractName?: string | null;
  relationType?: RequestRelationType | null;
  systems: GetTRBRequestSummaryQuery['trbRequest']['systems'];
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
  submittedAt,
  assignLeadModalRef,
  assignLeadModalTrbRequestIdRef,
  contractNumbers,
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

          <AdminRequestHeaderSummary
            requestName={name}
            submittedAt={submittedAt}
            requestType={t(`requestType.type.${requestType}.heading`)}
            relationType={relationType}
            contractName={contractName}
            systems={systems}
            requester={requesterString || ''}
            trbRequesterTestId={`trbSummary-requester_${requester.userInfo?.euaUserId}`}
            contractNumbers={contractNumbers}
          />
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
                  <Icon.Error
                    className="text-error margin-right-05"
                    aria-hidden
                  />
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
