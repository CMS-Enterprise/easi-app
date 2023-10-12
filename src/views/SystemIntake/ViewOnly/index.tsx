import React from 'react';

import PageHeading from 'components/PageHeading';
import PDFExport from 'components/PDFExport';
import SystemIntakeReview from 'components/SystemIntakeReview';
import { SystemIntake } from 'queries/types/SystemIntake';

type SystemIntakeViewOnlyProps = {
  systemIntake: SystemIntake;
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
        <SystemIntakeReview systemIntake={systemIntake} />
      </PDFExport>
    </>
  );
};

export default SystemIntakeView;
