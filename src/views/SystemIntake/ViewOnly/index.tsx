import React from 'react';

import SystemIntakeReview from 'components/SystemIntakeReview';
import { SystemIntakeForm } from 'types/systemIntake';

type SystemIntakeViewOnlyProps = {
  systemIntake: SystemIntakeForm;
};
const SystemIntakeView = ({ systemIntake }: SystemIntakeViewOnlyProps) => (
  <>
    <h1>Review your Intake Request</h1>
    <SystemIntakeReview systemIntake={systemIntake} />
  </>
);

export default SystemIntakeView;
