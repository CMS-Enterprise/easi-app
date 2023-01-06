import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';

import {
  DescriptionDefinition,
  DescriptionList,
  DescriptionTerm
} from 'components/shared/DescriptionGroup';
import useTRBAttendees from 'hooks/useTRBAttendees';

import { AttendeesTable } from './AttendeesForm/components';
import DocumentsTable from './DocumentsTable';
import Pager from './Pager';
import { FormStepComponentProps, StepSubmit } from '.';

function Check({
  request,
  stepUrl,
  taskListUrl,
  setStepSubmit
}: FormStepComponentProps) {
  const { t } = useTranslation('technicalAssistance');
  const history = useHistory();

  const {
    data: { attendees }
  } = useTRBAttendees(request.id);

  const submitNoop: StepSubmit = async callback => {
    callback?.();
  };

  useEffect(() => {
    setStepSubmit(() => submitNoop);
  }, [setStepSubmit]);

  return (
    <>
      <div>
        <DescriptionList>
          <DescriptionTerm term={t('table.header.submissionDate')} />
          <DescriptionDefinition definition={t('check.notYetSubmitted')} />

          <DescriptionTerm term={t('check.requestType')} />
          <DescriptionDefinition
            definition={t(`requestType.type.${request.type}.heading`)}
          />
        </DescriptionList>
      </div>

      {/* Basic request details */}
      <div>
        <h2>{t('requestForm.steps.0.name')}</h2>
        <div>
          <DescriptionList>
            <DescriptionTerm term={t('basic.labels.name')} />
            <DescriptionDefinition definition={request.name} />
            <DescriptionTerm term={t('basic.labels.component')} />
            <DescriptionDefinition definition={request.form.component} />
            <DescriptionTerm term={t('basic.labels.needsAssistanceWith')} />
            <DescriptionDefinition
              definition={request.form.needsAssistanceWith}
            />
            <DescriptionTerm term={t('basic.labels.hasSolutionInMind')} />
            <DescriptionDefinition
              definition={request.form.hasSolutionInMind}
            />
            <DescriptionTerm term={t('basic.labels.proposedSolution')} />
            <DescriptionDefinition definition={request.form.proposedSolution} />
            <DescriptionTerm term={t('basic.labels.whereInProcess')} />
            <DescriptionDefinition
              definition={`${request.form.whereInProcess} ${request.form.whereInProcessOther}`}
            />
            <DescriptionTerm
              term={t('basic.labels.hasExpectedStartEndDates')}
            />
            <DescriptionDefinition
              definition={`${request.form.hasExpectedStartEndDates} ${request.form.expectedStartDate} ${request.form.expectedEndDate}`}
            />
            <DescriptionTerm term={t('basic.labels.collabGroups')} />
            <DescriptionDefinition definition={request.form.collabGroups} />
          </DescriptionList>
        </div>
      </div>

      {/* Subject areas */}
      <div>
        <h2>{t('requestForm.steps.1.name')}</h2>
        <div>
          <DescriptionList>
            <DescriptionTerm
              term={t(
                'subject.labels.subjectAreaTechnicalReferenceArchitecture'
              )}
            />
            <DescriptionDefinition
              definition={
                request.form.subjectAreaTechnicalReferenceArchitecture
              }
            />
            <DescriptionDefinition
              className="text-italic"
              definition={t('check.noTopicsSelected')}
            />
            <DescriptionTerm
              term={t('subject.labels.subjectAreaNetworkAndSecurity')}
            />
            <DescriptionDefinition
              definition={request.form.subjectAreaNetworkAndSecurity}
            />
            <DescriptionTerm
              term={t('subject.labels.subjectAreaCloudAndInfrastructure')}
            />
            <DescriptionDefinition
              definition={request.form.subjectAreaCloudAndInfrastructure}
            />
            <DescriptionTerm
              term={t('subject.labels.subjectAreaApplicationDevelopment')}
            />
            <DescriptionDefinition
              definition={request.form.subjectAreaApplicationDevelopment}
            />
            <DescriptionTerm
              term={t('subject.labels.subjectAreaDataAndDataManagement')}
            />
            <DescriptionDefinition
              definition={request.form.subjectAreaDataAndDataManagement}
            />
            <DescriptionTerm
              term={t(
                'subject.labels.subjectAreaGovernmentProcessesAndPolicies'
              )}
            />
            <DescriptionDefinition
              definition={
                request.form.subjectAreaGovernmentProcessesAndPolicies
              }
            />
            <DescriptionTerm
              term={t('subject.labels.subjectAreaOtherTechnicalTopics')}
            />
            <DescriptionDefinition
              definition={request.form.subjectAreaOtherTechnicalTopics}
            />
          </DescriptionList>
        </div>
      </div>

      {/* Attendees */}
      <div>
        <h2>{t('requestForm.steps.2.name')}</h2>
        <AttendeesTable attendees={attendees} trbRequestId={request.id} />
      </div>

      {/* Supporting docs */}
      <div>
        <h2>{t('requestForm.steps.3.name')}</h2>
        <DocumentsTable trbRequestId={request.id} />
      </div>

      <Pager
        back={{
          onClick: () => {
            history.push(stepUrl.back);
          }
        }}
        next={{
          onClick: () => {
            history.push(stepUrl.next);
          },
          text: t('check.submit')
        }}
        taskListUrl={taskListUrl}
        submit={submitNoop}
      />
    </>
  );
}

export default Check;
