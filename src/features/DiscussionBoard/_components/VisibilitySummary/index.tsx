import React from 'react';
import { useTranslation } from 'react-i18next';
import { Icon, SummaryBox } from '@trussworks/react-uswds';
import { SystemIntakeGRBDiscussionBoardType } from 'gql/generated/graphql';

type VisibilitySummaryProps = {
  discussionBoardType: SystemIntakeGRBDiscussionBoardType;
};

/**
 * Summary box that lists the users who can view
 * and interact with a discussion board
 */
const VisibilitySummary = ({ discussionBoardType }: VisibilitySummaryProps) => {
  const { t } = useTranslation('discussions');

  return (
    <SummaryBox data-testid="visibility-summary">
      <p className="margin-0">
        {t('governanceReviewBoard.discussionsSharedWith')}
      </p>
      <ul className="usa-list usa-list--unstyled margin-top-1">
        {discussionBoardType === SystemIntakeGRBDiscussionBoardType.PRIMARY && (
          <li className="display-flex flex-align-center flex-column-gap-05">
            <Icon.Person aria-hidden />
            {t('tags.REQUESTER')}
          </li>
        )}

        <li className="display-flex flex-align-center flex-column-gap-05">
          <Icon.People aria-hidden />
          {t('tags.GROUP_GRB_REVIEWERS')}
        </li>
        <li className="display-flex flex-align-center flex-column-gap-05">
          <Icon.People aria-hidden />
          {t('tags.GROUP_IT_GOV')}
        </li>
      </ul>
    </SummaryBox>
  );
};

export default VisibilitySummary;
