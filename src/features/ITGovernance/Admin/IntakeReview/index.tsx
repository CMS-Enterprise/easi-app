import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  ITGovIntakeFormStatus,
  SystemIntakeFragmentFragment
} from 'gql/generated/graphql';

import PageHeading from 'components/PageHeading';
import PDFExport from 'components/PDFExport';
import SystemIntakeReview from 'components/SystemIntakeReview';
import TaskStatusTag from 'components/TaskStatusTag';
import { formatDateLocal } from 'utils/date';

type IntakeReviewProps = {
  systemIntake: SystemIntakeFragmentFragment;
};

const IntakeReview = ({ systemIntake }: IntakeReviewProps) => {
  const { t } = useTranslation('governanceReviewTeam');
  const filename = `System intake for ${systemIntake.requestName}.pdf`;

  const intakeStatus = systemIntake.itGovTaskStatuses.intakeFormStatus;
  let dateInfo: string | undefined;

  if (
    intakeStatus === ITGovIntakeFormStatus.EDITS_REQUESTED &&
    systemIntake.updatedAt
  ) {
    dateInfo = systemIntake.updatedAt;
  } else if (
    intakeStatus === ITGovIntakeFormStatus.COMPLETED &&
    systemIntake.submittedAt
  ) {
    dateInfo = systemIntake.submittedAt;
  }

  // this is the admin view

  return (
    <div data-testid="intake-review">
      <div className="margin-bottom-4">
        <PageHeading className="margin-y-0">{t('general:intake')}</PageHeading>
        {!!intakeStatus && <TaskStatusTag status={intakeStatus} />}
        {t('general:on')}
        {formatDateLocal(dateInfo, 'MM/dd/yyyy')}
      </div>
      <PDFExport
        title="System Intake"
        filename={filename}
        label={t('intake:viewIntakeRequest.downloadPDF')}
        linkPosition="both"
        helpText={t('intake:viewIntakeRequest.docsNotIncluded')}
      >
        <div className="border-top border-base-light margin-top-2">
          <SystemIntakeReview systemIntake={systemIntake} />
        </div>
      </PDFExport>
    </div>
  );
};

export default IntakeReview;
