import React from 'react';
import { useTranslation } from 'react-i18next';
import { Icon } from '@trussworks/react-uswds';
import { SystemIntakeGRBReviewDiscussionFragment } from 'gql/gen/graphql';

import UswdsReactLink from 'components/LinkWrapper';
import { RichTextViewer } from 'components/RichTextEditor';
import { AvatarCircle } from 'components/shared/Avatar/Avatar';

import './index.scss';

type DiscussionReplyProps = {
  discussion: SystemIntakeGRBReviewDiscussionFragment;
};

/**
 * Reply component for use within discussions
 *
 * TODO:
 *   - Translate text with new translation file
 */
const DiscussionReply = ({
  discussion: { initialPost, replies }
}: DiscussionReplyProps) => {
  const { t } = useTranslation('grbReview');

  const {
    content,
    grbRole,
    votingRole,
    createdByUserAccount: userAccount
    // createdAt
  } = initialPost;

  return (
    <div className="easi-discussion-reply display-flex">
      <div className="margin-right-105">
        <AvatarCircle user={userAccount.commonName} />
      </div>

      <div>
        <div className="easi-discussion-reply__header display-flex margin-top-1 margin-bottom-105">
          <div>
            <p className="margin-y-0">{userAccount.commonName}</p>

            <h5 className="margin-top-1 margin-bottom-0 font-body-xs text-base text-normal">
              {t(`votingRoles.${votingRole}`)}, {t(`reviewerRoles.${grbRole}`)}
            </h5>
          </div>

          {/* TODO: Update to use actual date */}
          <p className="margin-y-0 text-base">2 days ago</p>
        </div>

        {/**
         * TODO:
         *   - Update to use TipTap text area
         *   - Truncate text after 3 lines with `Read more` button
         */}
        <RichTextViewer
          value={content}
          className="easi-discussion-reply__content"
        />

        <div className="easi-discussion-reply__footer display-flex margin-top-2">
          <Icon.Announcement className="text-primary margin-right-1" />

          <UswdsReactLink to="/" className="margin-right-205">
            Reply
          </UswdsReactLink>

          <p className="text-base margin-0">
            {replies.length} replies in this discussion
          </p>
        </div>
      </div>
    </div>
  );
};

export default DiscussionReply;
