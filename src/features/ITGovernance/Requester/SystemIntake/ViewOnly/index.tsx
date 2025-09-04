import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { Icon } from '@trussworks/react-uswds';
import { SystemIntakeFragmentFragment } from 'gql/generated/graphql';

import IconButton from 'components/IconButton';
import PageHeading from 'components/PageHeading';
import PDFExport from 'components/PDFExport';
import SystemIntakeReview from 'components/SystemIntakeReview';

type SystemIntakeViewOnlyProps = {
  systemIntake: SystemIntakeFragmentFragment;
};

const SystemIntakeView = ({ systemIntake }: SystemIntakeViewOnlyProps) => {
  const { t } = useTranslation('intake');
  const history = useHistory();

  const filename = `System intake for ${systemIntake.requestName}.pdf`;
  return (
    <>
      <PageHeading className="margin-bottom-0">
        {t('viewIntakeRequest.heading')}
      </PageHeading>

      <IconButton
        type="button"
        icon={<Icon.ArrowBack aria-hidden />}
        className="margin-bottom-3 margin-top-2"
        onClick={() => {
          history.goBack();
        }}
        unstyled
      >
        {t('taskList:navigation.returnToGovernanceTaskList')}
      </IconButton>
      <PDFExport
        title="System Intake"
        filename={filename}
        label="Download System Intake as PDF"
      >
        <SystemIntakeReview systemIntake={systemIntake} />
      </PDFExport>
    </>
  );
};

export default SystemIntakeView;
