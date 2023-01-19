import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { Grid } from '@trussworks/react-uswds';
import { camelCase, capitalize } from 'lodash';
import { DateTime } from 'luxon';

import UswdsReactLink from 'components/LinkWrapper';
import Divider from 'components/shared/Divider';
import useTRBAttendees from 'hooks/useTRBAttendees';
import { GetTrbRequest_trbRequest_form as TrbRequestForm } from 'queries/types/GetTrbRequest';
import {
  UpdateTrbRequestFormStatus,
  UpdateTrbRequestFormStatusVariables
} from 'queries/types/UpdateTrbRequestFormStatus';
import UpdateTrbRequestFormStatusQuery from 'queries/UpdateTrbRequestFormStatusQuery';
import { TRBWhereInProcessOption } from 'types/graphql-global-types';

import { AttendeesTable } from './AttendeesForm/components';
import DocumentsTable from './DocumentsTable';
import Pager from './Pager';
import WhatHappensNext from './WhatHappensNext';
import { FormStepComponentProps, StepSubmit } from '.';

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

function Check({
  request,
  stepUrl,
  taskListUrl,
  setStepSubmit,
  setIsStepSubmitting
}: FormStepComponentProps) {
  const { t } = useTranslation('technicalAssistance');
  const history = useHistory();

  const [update, { loading }] = useMutation<
    UpdateTrbRequestFormStatus,
    UpdateTrbRequestFormStatusVariables
  >(UpdateTrbRequestFormStatusQuery);

  const {
    data: { attendees }
  } = useTRBAttendees(request.id);

  const submitNoop: StepSubmit = async callback => {
    callback?.();
  };

  useEffect(() => {
    setStepSubmit(() => submitNoop);
  }, [setStepSubmit]);

  useEffect(() => {
    setIsStepSubmitting(loading);
  }, [setIsStepSubmitting, loading]);

  return (
    <>
      <dl className="easi-dl margin-top-4 margin-bottom-3">
        <Grid row gap>
          <Grid tablet={{ col: 12 }} desktop={{ col: 6 }}>
            <dt>{t('table.header.submissionDate')}</dt>
            <dd>{t('check.notYetSubmitted')}</dd>
          </Grid>
          <Grid tablet={{ col: 12 }} desktop={{ col: 6 }}>
            <dt>{t('check.requestType')}</dt>
            <dd>{t(`requestType.type.${request.type}.heading`)}</dd>
          </Grid>
        </Grid>
      </dl>
      <Divider />

      {/* Basic request details */}
      <h2 className="margin-top-3 margin-bottom-05">
        {t('requestForm.steps.0.name')}
      </h2>
      <div>
        <UswdsReactLink to={`/trb/requests/${request.id}/basic`}>
          {t('check.edit')}
        </UswdsReactLink>
      </div>
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
              request.form.expectedStartDate &&
              request.form.expectedEndDate
                ? `${t('basic.options.yes')}, ${t(
                    'check.expectedStartAndGoLive',
                    {
                      start: DateTime.fromISO(
                        request.form.expectedStartDate
                      ).toFormat('MM/dd/yyyy'),
                      live: DateTime.fromISO(
                        request.form.expectedEndDate
                      ).toFormat('MM/dd/yyyy')
                    }
                  )}`
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
                      `collabDate${capitalize(
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
      <div>
        <UswdsReactLink to={`/trb/requests/${request.id}/subject`}>
          {t('check.edit')}
        </UswdsReactLink>
      </div>
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
      <div>
        <UswdsReactLink to={`/trb/requests/${request.id}/attendees`}>
          {t('check.edit')}
        </UswdsReactLink>
      </div>
      <div className="margin-top-3 margin-bottom-6">
        {attendees.length === 0 ? (
          <span className="font-body-2xs">{t('check.noAttendees')}</span>
        ) : (
          <AttendeesTable attendees={attendees} trbRequestId={request.id} />
        )}
      </div>
      <Divider />

      {/* Supporting docs */}
      <h2 className="margin-top-3 margin-bottom-05">
        {t('requestForm.steps.3.name')}
      </h2>
      <div>
        <UswdsReactLink to={`/trb/requests/${request.id}/documents`}>
          {t('check.edit')}
        </UswdsReactLink>
      </div>
      <div className="margin-top-3 margin-bottom-6">
        <DocumentsTable trbRequestId={request.id} />
      </div>
      <Divider />

      <Grid row gap>
        <Grid
          tablet={{ col: 12 }}
          desktop={{ col: 6 }}
          className="margin-top-2 margin-bottom-4"
        >
          <WhatHappensNext />
        </Grid>
      </Grid>

      <Pager
        back={{
          disabled: loading,
          onClick: () => {
            history.push(stepUrl.back);
          }
        }}
        next={{
          disabled: loading,
          onClick: () => {
            update({
              variables: { trbRequestId: request.id, isSubmitted: true }
            })
              .then(() => {
                history.push(stepUrl.next, { success: true });
              })
              .catch(() => {
                history.push(stepUrl.next, { success: false });
              });
          },
          text: t('check.submit')
        }}
        saveExitDisabled={loading}
        taskListUrl={taskListUrl}
        submit={submitNoop}
      />
    </>
  );
}

export default Check;
