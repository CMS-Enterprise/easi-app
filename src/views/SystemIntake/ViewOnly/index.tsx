import React from 'react';
import { DateTime } from 'luxon';

import PageHeading from 'components/PageHeading';
import PDFExport from 'components/PDFExport';
import SystemIntakeReview from 'components/SystemIntakeReview';
import { SystemIntakeForm } from 'types/systemIntake';

type SystemIntakeViewOnlyProps = {
  systemIntake: SystemIntakeForm;
};

const SystemIntakeView = ({ systemIntake }: SystemIntakeViewOnlyProps) => {
  const filename = `System intake for ${systemIntake.requestName}.pdf`;
  return (
    <>
      <PageHeading>Review your Intake Request</PageHeading>
      <PDFExport
        title="System Intake"
        filename={filename}
        label="Download System Intake as PDF"
      >
        <SystemIntakeReview
          systemIntake={systemIntake}
          now={DateTime.local()}
        />
      </PDFExport>
    </>
  );
};

export default SystemIntakeView;
