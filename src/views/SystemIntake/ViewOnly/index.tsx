import React from 'react';
import { DateTime } from 'luxon';

import PDFExport from 'components/PDFExport';
import SystemIntakeReview from 'components/SystemIntakeReview';
import { SystemIntakeForm } from 'types/systemIntake';

type SystemIntakeViewOnlyProps = {
  systemIntake: SystemIntakeForm;
};

const SystemIntakeView = ({ systemIntake }: SystemIntakeViewOnlyProps) => {
  return (
    <>
      <h1>Review your Intake Request</h1>
      <PDFExport title="system intake" filename="system-intake.pdf">
        <SystemIntakeReview
          systemIntake={systemIntake}
          now={DateTime.local()}
        />
      </PDFExport>
    </>
  );
};

export default SystemIntakeView;
