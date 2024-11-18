import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Icon } from '@trussworks/react-uswds';
import { SystemIntakeGRBReviewDiscussionFragment } from 'gql/gen/graphql';

import IconButton from 'components/shared/IconButton';

import DiscussionForm from './DiscussionForm.tsx';
import DiscussionPost from './DiscussionPost';

type DiscussionProps = {
  systemIntakeId: string;
  discussion: SystemIntakeGRBReviewDiscussionFragment;
  closeModal: () => void;
};

/**
 * Single discussion post view
 *
 * Displays discussion, replies, and form to reply to discussion post
 */
const Discussion = ({
  systemIntakeId,
  discussion,
  closeModal
}: DiscussionProps) => {
  const { t } = useTranslation('discussions');
  const [showReplies, setShowReplies] = useState(true);

  const { initialPost, replies } = discussion;

  return (
    <div>
      <h1 className="margin-bottom-5">{t('general.discussion')}</h1>

      <DiscussionPost {...initialPost} />

      {replies && (
        <>
          <div className="display-flex flex-justify">
            <h4 className="margin-right-1">
              {t('general.repliesCount', { count: replies.length })}
            </h4>
            <IconButton
              type="button"
              onClick={() => setShowReplies(!showReplies)}
              icon={showReplies ? <Icon.ExpandLess /> : <Icon.ExpandMore />}
              iconPosition="after"
              unstyled
            >
              {showReplies
                ? t('general.hideReplies')
                : t('general.showReplies')}
            </IconButton>
          </div>

          {showReplies && (
            <ul className="discussion-replies-thread usa-list--unstyled">
              {replies.map(reply => (
                <li key={reply.id}>
                  <DiscussionPost {...reply} />
                </li>
              ))}
            </ul>
          )}
        </>
      )}

      <h2 className="margin-bottom-2 margin-top-8">{t('general.reply')}</h2>
      <DiscussionForm type="reply" closeModal={closeModal} />
    </div>
  );
};

export default Discussion;
