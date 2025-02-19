import React from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, Grid } from '@trussworks/react-uswds';
import { formatFundingSourcesForRender } from 'features/TechnicalAssistance/RequestForm/FundingSources/useTrbFundingSources';
import {
  GetTrbRequest_trbRequest as TrbRequest,
  GetTrbRequest_trbRequest_form as TrbRequestForm
} from 'gql/legacyGQL/types/GetTrbRequest';
import { camelCase, upperFirst } from 'lodash';

import Divider from 'components/Divider';
import UswdsReactLink from 'components/LinkWrapper';
import Tag from 'components/Tag';
import useTRBAttendees from 'hooks/useTRBAttendees';
import {
  TRBCollabGroupOption,
  TRBWhereInProcessOption
} from 'types/graphql-global-types';
import { formatDateLocal, formatDateUtc } from 'utils/date';

import { AttendeesTable } from './AttendeesForm/components';
import DocumentsTable from './DocumentsTable';

type SubmittedRequestProps = {
  request: TrbRequest;
  showEditSectionLinks?: boolean;
  showSectionHeadingDescription?: boolean;
  showRequestHeaderInfo?: boolean;
  canRemoveDocument?: boolean;
};

function SubmittedRequest({
  request,
  showEditSectionLinks,
  showSectionHeadingDescription,
  showRequestHeaderInfo,
  canRemoveDocument = true
}: SubmittedRequestProps) {
  const { t } = useTranslation('technicalAssistance');

  const fundingSources = formatFundingSourcesForRender(
    request.form.fundingSources || []
  );

  const {
    data: { requester, attendees }
  } = useTRBAttendees(request.id);

  /** Wraps valid collabDate in parenthesis */
  const collabDate = (date: string | null): string =>
    date ? ` (${date})` : '';

  return (
    <>
      {showRequestHeaderInfo && (
        <>
          <dl className="easi-dl margin-top-4 margin-bottom-3">
            <Grid row gap>
              <Grid tablet={{ col: 12 }} desktop={{ col: 6 }}>
                <dt>{t('table.header.submissionDate')}</dt>
                <dd>
                  {request.form.submittedAt
                    ? formatDateLocal(request.form.submittedAt, 'MMMM d, yyyy')
                    : t('check.notYetSubmitted')}
                </dd>
              </Grid>
              <Grid tablet={{ col: 12 }} desktop={{ col: 6 }}>
                <dt>{t('check.requestType')}</dt>
                <dd>{t(`requestType.type.${request.type}.heading`)}</dd>
              </Grid>
            </Grid>
          </dl>
          <Divider />
        </>
      )}

      {/* Basic request details */}
      <h2 className="margin-top-3 margin-bottom-05">
        {t('requestForm.steps.0.name')}
      </h2>
      {showSectionHeadingDescription && (
        <div className="text-base line-height-body-5">
          {t('requestForm.steps.0.adminDescription')}
        </div>
      )}
      {showEditSectionLinks && (
        <div>
          <UswdsReactLink to={`/trb/requests/${request.id}/basic`}>
            {t('check.edit')}
          </UswdsReactLink>
        </div>
      )}
      <dl className="easi-dl margin-y-3">
        <Grid row gap>
          <Grid tablet={{ col: 12 }} desktop={{ col: 6 }}>
            <dt>{t('basic.labels.name')}</dt>
            <dd>{request.name}</dd>
          </Grid>
          <Grid tablet={{ col: 12 }} desktop={{ col: 6 }}>
            <dt>{t('basic.labels.component')}</dt>
            <dd>{request.form.component}</dd>
          </Grid>
          <Grid col={12}>
            <dt>{t('basic.labels.needsAssistanceWith')}</dt>
            <dd>{request.form.needsAssistanceWith}</dd>
          </Grid>
          <Grid col={12}>
            <dt>{t('basic.labels.hasSolutionInMind')}</dt>
            <dd>
              {t(
                `basic.options.${request.form.hasSolutionInMind ? 'yes' : 'no'}`
              )}
            </dd>
            {request.form.hasSolutionInMind && (
              <>
                <dt>{t('basic.labels.proposedSolution')}</dt>
                <dd>{request.form.proposedSolution}</dd>
              </>
            )}
          </Grid>
          <Grid tablet={{ col: 12 }} desktop={{ col: 6 }}>
            <dt>{t('basic.labels.whereInProcess')}</dt>
            <dd>
              {request.form.whereInProcess !== null &&
                (request.form.whereInProcess === TRBWhereInProcessOption.OTHER
                  ? `${t('basic.options.other')}: ${
                      request.form.whereInProcessOther
                    }`
                  : t(
                      `basic.options.whereInProcess.${camelCase(
                        request.form.whereInProcess
                      )}`
                    ))}
            </dd>
          </Grid>
          <Grid tablet={{ col: 12 }} desktop={{ col: 6 }}>
            <dt>{t('basic.labels.hasExpectedStartEndDates')}</dt>
            <dd>
              {request.form.hasExpectedStartEndDates &&
              (request.form.expectedStartDate || request.form.expectedEndDate)
                ? (() => {
                    const start = request.form.expectedStartDate
                      ? `${formatDateUtc(
                          request.form.expectedStartDate,
                          'MM/dd/yyyy'
                        )} ${t('check.expectedStart')}`
                      : '';
                    const live = request.form.expectedEndDate
                      ? `${formatDateUtc(
                          request.form.expectedEndDate,
                          'MM/dd/yyyy'
                        )} ${t('check.expectedGoLive')}`
                      : '';
                    const and = start && live ? t('check.and') : '';
                    return `${t('basic.options.yes')}, ${start} ${and} ${live}`;
                  })()
                : t('basic.options.no')}
            </dd>
          </Grid>

          <Grid tablet={{ col: 12 }}>
            <dt>{t('basic.labels.fundingSources')}</dt>
          </Grid>

          <Grid row tablet={{ col: 12 }} className="margin-bottom-4">
            {fundingSources.length > 0
              ? fundingSources.map(fundingSource => (
                  <Grid
                    tablet={{ col: 12 }}
                    desktop={{ col: 6 }}
                    key={fundingSource.fundingNumber}
                  >
                    <dt>{t('basic.labels.fundingSource')}</dt>
                    <dd className="margin-bottom-0">
                      {t('basic.labels.fundingNumber')}:{' '}
                      {fundingSource.fundingNumber}
                    </dd>
                    <dd className="margin-bottom-0">
                      {t('basic.labels.fundingSourcesList')}:{' '}
                      {fundingSource.sources.join(', ')}
                    </dd>
                  </Grid>
                ))
              : t('basic.noAnswer')}
          </Grid>

          <Grid tablet={{ col: 12 }} desktop={{ col: 6 }}>
            <dt>{t('basic.labels.listLCIDS')}</dt>
            <dd>
              {request.form.systemIntakes.length > 0
                ? request.form.systemIntakes
                    .map(intake => intake.lcid)
                    .join(', ')
                : t('basic.noAnswer')}
            </dd>
          </Grid>

          {/* Used to break up a potential uneven row */}
          <Grid desktop={{ col: 12 }} />

          <Grid tablet={{ col: 12 }} desktop={{ col: 6 }}>
            <dt>{t('basic.labels.collabGroups')}</dt>
            <dd>
              {request.form.collabGroups.length > 0
                ? request.form.collabGroups
                    .map(v => {
                      if (v === 'OTHER') {
                        return `${t('basic.options.other')}${
                          request.form.collabGroupOther
                            ? `: ${request.form.collabGroupOther}`
                            : ''
                        }${collabDate(request.form.collabDateOther)}`;
                      }
                      return `${t(
                        `basic.options.collabGroups.${camelCase(v)}`
                      )}${collabDate(
                        request.form[
                          `collabDate${upperFirst(
                            camelCase(v)
                          )}` as keyof TrbRequestForm
                        ] as string | null
                      )}`;
                    })
                    .join(', ')
                : t('basic.noAnswer')}
            </dd>
          </Grid>

          <Grid tablet={{ col: 12 }} desktop={{ col: 6 }}>
            {request.form.collabGroups.includes(
              TRBCollabGroupOption.GOVERNANCE_REVIEW_BOARD
            ) && (
              <>
                <dt>{t('basic.labels.collabGRBConsultRequested')}</dt>
                <dd>
                  {t(
                    `basic.options.${
                      request.form.collabGRBConsultRequested ? 'yes' : 'no'
                    }`
                  )}
                </dd>
              </>
            )}
          </Grid>
        </Grid>
      </dl>
      <Divider />

      {/* Subject areas */}
      <h2 className="margin-top-3 margin-bottom-05">
        {t('requestForm.steps.1.name')}
      </h2>
      {showSectionHeadingDescription && (
        <div className="text-base line-height-body-5">
          {t('requestForm.steps.1.adminDescription')}
        </div>
      )}
      {showEditSectionLinks && (
        <div>
          <UswdsReactLink to={`/trb/requests/${request.id}/subject`}>
            {t('check.edit')}
          </UswdsReactLink>
        </div>
      )}
      <div className="margin-top-3 margin-bottom-6">
        {request.form.subjectAreaOptions?.length ||
        request.form.subjectAreaOptionOther ? (
          <div>
            {request.form.subjectAreaOptions?.map(subject => (
              <Tag
                className="text-base-darker bg-base-lighter margin-bottom-1"
                key={subject}
              >
                {t(`subject.labels.${subject}`)}
              </Tag>
            ))}
            {request.form.subjectAreaOptionOther && (
              <dl className="easi-dl margin-top-3">
                <dt>{t('subject.otherSubjectAreas')}</dt>
                <dd>{request.form.subjectAreaOptionOther}</dd>
              </dl>
            )}
          </div>
        ) : (
          <Alert headingLevel="h4" type="info" slim>
            {t('check.noSubjectAreas')}
          </Alert>
        )}
      </div>
      <Divider />

      {/* Attendees */}
      <h2 className="margin-top-3 margin-bottom-05">
        {t('requestForm.steps.2.name')}
      </h2>
      {showSectionHeadingDescription && (
        <div className="text-base line-height-body-5">
          {t('requestForm.steps.2.adminDescription')}
        </div>
      )}
      {showEditSectionLinks && (
        <div>
          <UswdsReactLink to={`/trb/requests/${request.id}/attendees`}>
            {t('check.edit')}
          </UswdsReactLink>
        </div>
      )}
      <div className="margin-top-3 margin-bottom-6">
        {attendees.length === 0 ? (
          <Alert headingLevel="h4" type="info" slim>
            {t('check.noAttendees')}
          </Alert>
        ) : (
          <AttendeesTable
            attendees={[requester, ...attendees]}
            trbRequestId={request.id}
          />
        )}
      </div>
      <Divider />

      {/* Supporting docs */}
      <h2 className="margin-top-3 margin-bottom-05">
        {t('requestForm.steps.3.name')}
      </h2>
      {showSectionHeadingDescription && (
        <div className="text-base line-height-body-5">
          {t('requestForm.steps.3.adminDescription')}
        </div>
      )}
      {showEditSectionLinks && (
        <div>
          <UswdsReactLink to={`/trb/requests/${request.id}/documents`}>
            {t('check.edit')}
          </UswdsReactLink>
        </div>
      )}
      <div className="margin-top-3 margin-bottom-6">
        <DocumentsTable trbRequestId={request.id} canEdit={canRemoveDocument} />
      </div>
      <Divider />
    </>
  );
}

export default SubmittedRequest;
