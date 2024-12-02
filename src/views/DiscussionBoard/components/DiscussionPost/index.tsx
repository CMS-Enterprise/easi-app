import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Icon } from '@trussworks/react-uswds';
import { SystemIntakeGRBReviewDiscussionPostFragment } from 'gql/gen/graphql';
import { upperFirst } from 'lodash';
import { DateTime } from 'luxon';

import { RichTextViewer } from 'components/RichTextEditor';
import { AvatarCircle } from 'components/shared/Avatar/Avatar';
import IconButton from 'components/shared/IconButton';
import { getRelativeDate } from 'utils/date';

import './index.scss';

type DiscussionPostProps = SystemIntakeGRBReviewDiscussionPostFragment & {
  /**
   * Array of discussion replies
   *
   * Leave undefined if rendering reply or to hide discussion reply data
   */
  replies?: SystemIntakeGRBReviewDiscussionPostFragment[];
};

/**
 * Displays single discussion or reply
 */
const DiscussionPost = ({ replies, ...initialPost }: DiscussionPostProps) => {
  const { t } = useTranslation('discussions');

  const {
    content,
    grbRole,
    votingRole,
    createdByUserAccount: userAccount,
    createdAt
  } = initialPost;

  /** Displays GRB and voting role with fallback if values are null */
  const role =
    votingRole && grbRole
      ? `${t(`grbReview:votingRoles.${votingRole}`)}, ${t(`grbReview:reviewerRoles.${grbRole}`)}`
      : t('governanceReviewBoard.governanceAdminTeam');

  /**
   * Formatted text for date and time of last reply
   *
   * If more than one day since reply, uses formatted date.
   * Otherwise, uses relative date.
   */
  const lastReplyAtText = useMemo(() => {
    if (!replies || replies.length === 0) return '';

    const [lastReply] = replies;

    const dateTime = DateTime.fromISO(lastReply.createdAt);

    return t('general.lastReply', {
      date: getRelativeDate(lastReply.createdAt, 1),
      time: dateTime.toLocaleString(DateTime.TIME_SIMPLE)
    });
  }, [replies, t]);

  return (
    <div className="easi-discussion-post display-flex line-height-body-1">
      <div className="margin-right-105">
        <AvatarCircle
          user={userAccount.commonName}
          className="easi-discussion-avatar"
        />
      </div>

      <div className="width-full">
        <div className="easi-discussion-post__header tablet:display-flex margin-top-1 margin-bottom-105">
          <div>
            <p className="margin-y-0">{userAccount.commonName}</p>

            <h5 className="margin-top-05 margin-bottom-0 font-body-xs text-base text-normal">
              {role}
            </h5>
          </div>

          <p className="margin-top-105 tablet:margin-top-0 margin-bottom-0 text-base">
            {upperFirst(getRelativeDate(createdAt))}
          </p>
        </div>

        {/**
         * TODO:
         *   - Update to use TipTap text area
         *   - Truncate text after 3 lines with `Read more` button
         */}
        <RichTextViewer
          value={content}
          className="easi-discussion-post__content"
        />

        {
          // Only render reply data if `replies` is not undefined
          replies && (
            <div
              className="easi-discussion-post__replies display-flex margin-top-2"
              data-testid="discussionReplies"
            >
              <IconButton
                type="button"
                // TODO: Open discussion panel
                onClick={() => null}
                className="margin-right-205"
                icon={<Icon.Announcement className="text-primary" />}
                unstyled
              >
                {replies.length > 0
                  ? t('general.repliesCount', { count: replies.length })
                  : t('general.reply')}
              </IconButton>

              {replies.length > 0 && (
                <p className="text-base margin-0" data-testid="lastReplyAtText">
                  {lastReplyAtText}
                </p>
              )}
            </div>
          )
        }
      </div>
    </div>
  );
};

export default DiscussionPost;