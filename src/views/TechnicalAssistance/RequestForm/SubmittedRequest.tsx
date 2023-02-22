import React from 'react';
import { useTranslation } from 'react-i18next';
import { Grid } from '@trussworks/react-uswds';
import { camelCase, upperFirst } from 'lodash';

import UswdsReactLink from 'components/LinkWrapper';
import Divider from 'components/shared/Divider';
import useTRBAttendees from 'hooks/useTRBAttendees';
import {
  GetTrbRequest_trbRequest as TrbRequest,
  GetTrbRequest_trbRequest_form as TrbRequestForm
} from 'queries/types/GetTrbRequest';
import { TRBWhereInProcessOption } from 'types/graphql-global-types';
import { formatDateLocal, formatDateUtc } from 'utils/date';

import { AttendeesTable } from './AttendeesForm/components';
import DocumentsTable from './DocumentsTable';

function SubjectDefinition(
  form: any,
  field: keyof TrbRequestForm
): React.ReactNode {
  const { t } = useTranslation('technicalAssistance');
  return Array.isArray(form[field]) && form[field].length ? (
    form[field]
      .map((v: string) =>
        v === 'OTHER'
          ? `${t('basic.options.other')}: ${form[`${field}Other`]}`
          : t(`subject.options.${field}.${v}`)
      )
      .join(', ')
  ) : (
    <em>{t('check.noTopicsSelected')}</em>
  );
}

type SubmittedRequestProps = {
  request: TrbRequest;
  showEditSectionLinks?: boolean;
  showSectionHeadingDescription?: boolean;
  showRequestHeaderInfo?: boolean;
};

function SubmittedRequest({
  request,
  showEditSectionLinks,
  showSectionHeadingDescription,
  showRequestHeaderInfo
}: SubmittedRequestProps) {
  const { t } = useTranslation('technicalAssistance');

  const {
    data: { requester, attendees }
  } = useTRBAttendees(request.id);

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
          <Grid tablet={{ col: 12 }} desktop={{ col: 6 }}>
            <dt>{t('basic.labels.collabGroups')}</dt>
            <dd>
              {request.form.collabGroups
                .map(v => {
                  if (v === 'OTHER') {
                    return `${t('basic.options.other')}: ${
                      request.form.collabGroupOther
                    } (${request.form.collabDateOther})`;
                  }
                  return `${t(`basic.options.collabGroups.${camelCase(v)}`)} (${
                    request.form[
                      `collabDate${upperFirst(
                        camelCase(v)
                      )}` as keyof TrbRequestForm
                    ]
                  })`;
                })
                .join(', ')}
            </dd>
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
      <dl className="easi-dl margin-y-3">
        <Grid row gap>
          <Grid tablet={{ col: 12 }} desktop={{ col: 6 }}>
            <dt>
              {t('subject.labels.subjectAreaTechnicalReferenceArchitecture')}
            </dt>
            <dd>
              {SubjectDefinition(
                request.form,
                'subjectAreaTechnicalReferenceArchitecture'
              )}
            </dd>
          </Grid>
          <Grid tablet={{ col: 12 }} desktop={{ col: 6 }}>
            <dt>{t('subject.labels.subjectAreaNetworkAndSecurity')}</dt>
            <dd>
              {SubjectDefinition(request.form, 'subjectAreaNetworkAndSecurity')}
            </dd>
          </Grid>
          <Grid tablet={{ col: 12 }} desktop={{ col: 6 }}>
            <dt>{t('subject.labels.subjectAreaCloudAndInfrastructure')}</dt>
            <dd>
              {SubjectDefinition(
                request.form,
                'subjectAreaCloudAndInfrastructure'
              )}
            </dd>
          </Grid>
          <Grid tablet={{ col: 12 }} desktop={{ col: 6 }}>
            <dt>{t('subject.labels.subjectAreaApplicationDevelopment')}</dt>
            <dd>
              {SubjectDefinition(
                request.form,
                'subjectAreaApplicationDevelopment'
              )}
            </dd>
          </Grid>
          <Grid tablet={{ col: 12 }} desktop={{ col: 6 }}>
            <dt>{t('subject.labels.subjectAreaDataAndDataManagement')}</dt>
            <dd>
              {SubjectDefinition(
                request.form,
                'subjectAreaDataAndDataManagement'
              )}
            </dd>
          </Grid>
          <Grid tablet={{ col: 12 }} desktop={{ col: 6 }}>
            <dt>
              {t('subject.labels.subjectAreaGovernmentProcessesAndPolicies')}
            </dt>
            <dd>
              {SubjectDefinition(
                request.form,
                'subjectAreaGovernmentProcessesAndPolicies'
              )}
            </dd>
          </Grid>
          <Grid tablet={{ col: 12 }} desktop={{ col: 6 }}>
            <dt>{t('subject.labels.subjectAreaOtherTechnicalTopics')}</dt>
            <dd>
              {SubjectDefinition(
                request.form,
                'subjectAreaOtherTechnicalTopics'
              )}
            </dd>
          </Grid>
        </Grid>
      </dl>
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
          <span className="font-body-2xs">{t('check.noAttendees')}</span>
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
        <DocumentsTable trbRequestId={request.id} />
      </div>
    </>
  );
}

export default SubmittedRequest;
