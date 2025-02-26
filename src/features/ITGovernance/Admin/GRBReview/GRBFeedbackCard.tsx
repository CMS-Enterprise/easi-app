import React from 'react';
import { useTranslation } from 'react-i18next';
import { CardBody, CardHeader } from '@trussworks/react-uswds';
import FeedbackList from 'features/ITGovernance/Requester/TaskList/Feedback/FeedbackList';
import {
  GovernanceRequestFeedbackFragmentFragment,
  GovernanceRequestFeedbackType
} from 'gql/generated/graphql';

import Alert from 'components/Alert';
import CollapsableLink from 'components/CollapsableLink';

export type GRBFeedbackCardProps = {
  systemIntakeID: string;
  governanceRequestFeedbacks: GovernanceRequestFeedbackFragmentFragment[];
};

function GRBFeedbackCard({
  systemIntakeID,
  governanceRequestFeedbacks
}: GRBFeedbackCardProps) {
  const { t } = useTranslation('grbReview');

  const isGrbFeedback =
    governanceRequestFeedbacks.filter(
      f => f.type === GovernanceRequestFeedbackType.GRB
    ).length > 0;

  return (
    <div className="usa-card__container margin-left-0 border-width-1px shadow-2 margin-top-3 margin-bottom-4">
      <CardHeader>
        <h3 className="display-inline-block margin-right-2 margin-bottom-0">
          {t('reviewDetails.grbFeedback.title')}
        </h3>
        {isGrbFeedback && (
          <p className="margin-top-05 line-height-body-5">
            {t('reviewDetails.grbFeedback.text')}
          </p>
        )}
      </CardHeader>
      <CardBody className="padding-top-2">
        {isGrbFeedback ? (
          <CollapsableLink
            id="grb-feedback-card-list"
            label={t('reviewDetails.grbFeedback.show')}
            closeLabel={t('reviewDetails.grbFeedback.hide')}
            eyeIcon
            styleLeftBar={false}
            bold={false}
          >
            <FeedbackList
              systemIntakeId={systemIntakeID}
              filterType={GovernanceRequestFeedbackType.GRB}
              contentOnly
            />
          </CollapsableLink>
        ) : (
          <Alert type="info" slim>
            {t('reviewDetails.grbFeedback.emptyAlert')}
          </Alert>
        )}
      </CardBody>
    </div>
  );
}

export default GRBFeedbackCard;
