import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Link as UswdsLink } from '@trussworks/react-uswds';

import CollapsableLink from 'components/shared/CollapsableLink';
import { RadioField } from 'components/shared/RadioField';
import SystemIntakeReview from 'components/SystemIntakeReview';
import { SystemIntakeForm } from 'types/systemIntake';

type IntakeReviewProps = {
  systemIntake: SystemIntakeForm;
  handleSetDecision: (x: string) => void;
};

const IntakeReview = ({
  systemIntake,
  handleSetDecision
}: IntakeReviewProps) => {
  const { t } = useTranslation('governanceReviewTeam');
  const handleActionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value);
    handleSetDecision(e.target.value);
  };

  return (
    <div>
      <h1 className="margin-top-0">{t('general:intake')}</h1>
      <SystemIntakeReview systemIntake={systemIntake} />
      <hr className="opacity-30" />
      <h3 className="font-heading-xl">{t('actions.proceedHow')}</h3>
      <RadioField
        id="GrtDecision-IssueLCID"
        name="intakeDecision"
        label={t('actions.issueLCID')}
        value="issueLCID"
        onChange={handleActionChange}
      />
      <RadioField
        id="GrtDecision-ProgressBusinessCase"
        name="intakeDecision"
        label={t('actions.progressBusinessCase')}
        value="moveToBusinessCase"
        onChange={handleActionChange}
      />
      <RadioField
        id="GrtDecision-NotGovernanceRequest"
        name="intakeDecision"
        label={t('actions.notGovernance')}
        value="notGovernanceRequest"
        onChange={handleActionChange}
      />
      <CollapsableLink
        id="GrtDecision-AdditionalDecisionOptions"
        label="show other options"
      >
        <RadioField
          id="GrtDecision-ReadyForGrt"
          name="intakeDecision"
          label={t('actions.readyForGrt')}
          value="readyForGRT"
          onChange={handleActionChange}
        />
        <RadioField
          id="GrtDecision-PassWithFeedback"
          name="intakeDecision"
          label={t('actions.passWithFeedback')}
          value="passWithFeedback"
          onChange={handleActionChange}
        />
        <RadioField
          id="GrtDecision-ReadyForGRB"
          name="intakeDecision"
          label={t('actions.readyForGrb')}
          value="readyForGRB"
          onChange={handleActionChange}
        />
      </CollapsableLink>

      <UswdsLink
        className="usa-button margin-top-5"
        variant="unstyled"
        to="#"
        asCustom={Link}
      >
        Continue
      </UswdsLink>
    </div>
  );
};

export default IntakeReview;
