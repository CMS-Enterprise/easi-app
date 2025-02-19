import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { SystemIntake } from 'gql/legacyGQL/types/SystemIntake';

import UswdsReactLink from 'components/LinkWrapper';
import PageHeading from 'components/PageHeading';
import PDFExport from 'components/PDFExport';
import SystemIntakeReview from 'components/SystemIntakeReview';

import ITGovAdminContext from '../ITGovAdminContext';

type IntakeReviewProps = {
  systemIntake: SystemIntake;
};

const IntakeReview = ({ systemIntake }: IntakeReviewProps) => {
  const { t } = useTranslation('governanceReviewTeam');
  const filename = `System intake for ${systemIntake.requestName}.pdf`;

  const isITGovAdmin = useContext(ITGovAdminContext);

  return (
    <div data-testid="intake-review">
      <PageHeading className="margin-top-0">{t('general:intake')}</PageHeading>
      <PDFExport
        title="System Intake"
        filename={filename}
        label="Download System Intake as PDF"
      >
        <SystemIntakeReview systemIntake={systemIntake} />
      </PDFExport>

      {isITGovAdmin && (
        <UswdsReactLink
          className="usa-button margin-top-5"
          variant="unstyled"
          to={`/it-governance/${systemIntake.id}/actions`}
        >
          {t('action:takeAnAction')}
        </UswdsReactLink>
      )}
    </div>
  );
};

export default IntakeReview;
