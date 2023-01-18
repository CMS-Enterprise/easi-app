import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { Grid } from '@trussworks/react-uswds';
import { camelCase, capitalize } from 'lodash';
import { DateTime } from 'luxon';

import UswdsReactLink from 'components/LinkWrapper';
import {
  DescriptionDefinition,
  DescriptionList,
  DescriptionTerm
} from 'components/shared/DescriptionGroup';
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
      <DescriptionList className="margin-top-4 margin-bottom-6">
        <Grid row gap>
          <Grid tablet={{ col: 12 }} desktop={{ col: 6 }}>
            <DescriptionTerm term={t('table.header.submissionDate')} />
            <DescriptionDefinition definition={t('check.notYetSubmitted')} />
          </Grid>
          <Grid tablet={{ col: 12 }} desktop={{ col: 6 }}>
            <DescriptionTerm term={t('check.requestType')} />
            <DescriptionDefinition
              definition={t(`requestType.type.${request.type}.heading`)}
            />
          </Grid>
        </Grid>
      </DescriptionList>
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
      <DescriptionList className="margin-top-3 margin-bottom-6">
        <Grid row gap>
          <Grid tablet={{ col: 12 }} desktop={{ col: 6 }}>
            <DescriptionTerm term={t('basic.labels.name')} />
            <DescriptionDefinition definition={request.name} />
          </Grid>
          <Grid tablet={{ col: 12 }} desktop={{ col: 6 }}>
            <DescriptionTerm term={t('basic.labels.component')} />
            <DescriptionDefinition definition={request.form.component} />
          </Grid>
          <Grid col={12}>
            <DescriptionTerm term={t('basic.labels.needsAssistanceWith')} />
            <DescriptionDefinition
              definition={request.form.needsAssistanceWith}
            />
          </Grid>
          <Grid col={12}>
            <DescriptionTerm term={t('basic.labels.hasSolutionInMind')} />
            <DescriptionDefinition
              definition={t(
                `basic.options.${request.form.hasSolutionInMind ? 'yes' : 'no'}`
              )}
            />
            {request.form.hasSolutionInMind && (
              <>
                <DescriptionTerm term={t('basic.labels.proposedSolution')} />
                <DescriptionDefinition
                  definition={request.form.proposedSolution}
                />
              </>
            )}
          </Grid>
          <Grid tablet={{ col: 12 }} desktop={{ col: 6 }}>
            <DescriptionTerm term={t('basic.labels.whereInProcess')} />
            <DescriptionDefinition
              definition={
                request.form.whereInProcess === TRBWhereInProcessOption.OTHER
                  ? `${t('basic.options.other')}: ${
                      request.form.whereInProcessOther
                    }`
                  : t(
                      `basic.options.whereInProcess.${camelCase(
                        request.form.whereInProcess || ''
                      )}`
                    )
              }
            />
          </Grid>
          <Grid tablet={{ col: 12 }} desktop={{ col: 6 }}>
            <DescriptionTerm
              term={t('basic.labels.hasExpectedStartEndDates')}
            />
            <DescriptionDefinition
              definition={
                request.form.hasExpectedStartEndDates &&
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
                  : t('basic.options.no')
              }
            />
          </Grid>
          <Grid tablet={{ col: 12 }} desktop={{ col: 6 }}>
            <DescriptionTerm term={t('basic.labels.collabGroups')} />
            <DescriptionDefinition
              definition={request.form.collabGroups
                .map(v => {
                  if (v === 'OTHER') {
                    return `${`${t('basic.options.other')}: ${
                      request.form.collabGroupOther
                    } (`}${request.form.collabDateOther})`;
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
            />
          </Grid>
        </Grid>
      </DescriptionList>
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
      <DescriptionList className="margin-top-3 margin-bottom-6">
        <Grid row gap>
          <Grid tablet={{ col: 12 }} desktop={{ col: 6 }}>
            <DescriptionTerm
              term={t(
                'subject.labels.subjectAreaTechnicalReferenceArchitecture'
              )}
            />
            <DescriptionDefinition
              definition={SubjectDefinition(
                request.form,
                'subjectAreaTechnicalReferenceArchitecture'
              )}
            />
          </Grid>
          <Grid tablet={{ col: 12 }} desktop={{ col: 6 }}>
            <DescriptionTerm
              term={t('subject.labels.subjectAreaNetworkAndSecurity')}
            />
            <DescriptionDefinition
              definition={SubjectDefinition(
                request.form,
                'subjectAreaNetworkAndSecurity'
              )}
            />
          </Grid>
          <Grid tablet={{ col: 12 }} desktop={{ col: 6 }}>
            <DescriptionTerm
              term={t('subject.labels.subjectAreaCloudAndInfrastructure')}
            />
            <DescriptionDefinition
              definition={SubjectDefinition(
                request.form,
                'subjectAreaCloudAndInfrastructure'
              )}
            />
          </Grid>
          <Grid tablet={{ col: 12 }} desktop={{ col: 6 }}>
            <DescriptionTerm
              term={t('subject.labels.subjectAreaApplicationDevelopment')}
            />
            <DescriptionDefinition
              definition={SubjectDefinition(
                request.form,
                'subjectAreaApplicationDevelopment'
              )}
            />
          </Grid>
          <Grid tablet={{ col: 12 }} desktop={{ col: 6 }}>
            <DescriptionTerm
              term={t('subject.labels.subjectAreaDataAndDataManagement')}
            />
            <DescriptionDefinition
              definition={SubjectDefinition(
                request.form,
                'subjectAreaDataAndDataManagement'
              )}
            />
          </Grid>
          <Grid tablet={{ col: 12 }} desktop={{ col: 6 }}>
            <DescriptionTerm
              term={t(
                'subject.labels.subjectAreaGovernmentProcessesAndPolicies'
              )}
            />
            <DescriptionDefinition
              definition={SubjectDefinition(
                request.form,
                'subjectAreaGovernmentProcessesAndPolicies'
              )}
            />
          </Grid>
          <Grid tablet={{ col: 12 }} desktop={{ col: 6 }}>
            <DescriptionTerm
              term={t('subject.labels.subjectAreaOtherTechnicalTopics')}
            />
            <DescriptionDefinition
              definition={SubjectDefinition(
                request.form,
                'subjectAreaOtherTechnicalTopics'
              )}
            />
          </Grid>
        </Grid>
      </DescriptionList>
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
          t('check.noAttendees')
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
        <Grid tablet={{ col: 12 }} desktop={{ col: 6 }}>
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
