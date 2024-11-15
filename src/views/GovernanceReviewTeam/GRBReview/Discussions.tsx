import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Button, Icon } from '@trussworks/react-uswds';
import classNames from 'classnames';
import { SystemIntakeGRBReviewDiscussionFragment } from 'gql/gen/graphql';

import DiscussionReply from 'components/DiscussionReply';
import CollapsableLink from 'components/shared/CollapsableLink';
import IconButton from 'components/shared/IconButton';

type DiscussionsProps = {
  grbDiscussions: SystemIntakeGRBReviewDiscussionFragment[];
  className?: string;
};

/** Displays recent discussions on GRB Review tab */
const Discussions = ({ grbDiscussions, className }: DiscussionsProps) => {
  const { t } = useTranslation('discussions');

  const discussionsWithoutReplies = grbDiscussions.filter(
    discussion => discussion.replies.length === 0
  );

  return (
    <div
      className={classNames(
        'grb-discussions bg-base-lightest padding-x-3 padding-y-3 radius-md',
        className
      )}
    >
      <h2 className="margin-top-0 margin-bottom-1">{t('general.label')}</h2>
      <p className="margin-top-0 line-height-body-5">
        {t('governanceReviewBoard.discussionsDescription')}
      </p>

      <CollapsableLink
        id="discussionBoardTips"
        label={t('general.usageTips.label')}
        className="text-bold"
      >
        <ul className="margin-y-0 padding-left-205">
          {t<string[]>('general.usageTips.content', {
            returnObjects: true
          }).map((item, index) => (
            <li key={item} className="line-height-body-5 margin-bottom-05">
              <Trans
                i18nKey={`discussions:general.usageTips.content.${index}`}
                components={{ span: <span className="text-primary" /> }}
              />
            </li>
          ))}
        </ul>
      </CollapsableLink>

      <div className="internal-discussion-board bg-white padding-3 padding-bottom-4 margin-top-4 border-base-lighter shadow-2">
        <div className="internal-discussions-board__header desktop:display-flex flex-align-start">
          <h3 className="margin-0">
            {t('governanceReviewBoard.internal.label')}
          </h3>
          <p className="margin-0 margin-top-05 text-base display-flex text-no-wrap">
            <Icon.LockOutline className="margin-right-05" />
            <span>
              {t('governanceReviewBoard.internal.visibilityRestricted')}
            </span>
          </p>
          <Button
            type="button"
            // TODO: Open discussion board
            onClick={() => null}
            className="margin-right-0 margin-y-2 desktop:margin-y-0 text-no-wrap"
            outline
          >
            {t('general.viewDiscussionBoard')}
          </Button>
        </div>

        <div className="display-flex">
          <p className="margin-0 margin-right-105 display-flex">
            <Icon.Warning className="text-warning-dark margin-right-05" />
            {t('general.discussionsWithoutReplies', {
              count: discussionsWithoutReplies.length
            })}
          </p>
          <IconButton
            type="button"
            // TODO: Open discussion board
            onClick={() => null}
            icon={<Icon.ArrowForward />}
            iconPosition="after"
            unstyled
          >
            {t('general.view')}
          </IconButton>
        </div>

        <h4 className="margin-bottom-2">{t('general.mostRecentActivity')}</h4>

        <DiscussionReply discussion={grbDiscussions[0]} />
      </div>
    </div>
  );
};

export default Discussions;
