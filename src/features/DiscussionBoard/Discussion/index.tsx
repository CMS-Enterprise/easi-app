import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Icon } from '@trussworks/react-uswds';
import { NotFoundPartial } from 'features/Miscellaneous/NotFound';
import { SystemIntakeGRBReviewDiscussionFragment } from 'gql/generated/graphql';

import IconButton from 'components/IconButton';
import { DiscussionAlert, MentionSuggestion } from 'types/discussions';

import DiscussionForm from '../DiscussionForm';
import DiscussionsList from '../DiscussionList';
import DiscussionPost from '../DiscussionPost';

type DiscussionProps = {
  discussion: SystemIntakeGRBReviewDiscussionFragment | null;
  closeModal: () => void;
  setDiscussionAlert: (discussionAlert: DiscussionAlert) => void;
  mentionSuggestions: MentionSuggestion[];
};

/**
 * Single discussion post view
 *
 * Displays discussion, replies, and form to reply to discussion post
 */
const Discussion = ({
  discussion,
  closeModal,
  setDiscussionAlert,
  mentionSuggestions
}: DiscussionProps) => {
  const { t } = useTranslation('discussions');
  const [showReplies, setShowReplies] = useState(true);

  if (!discussion) return <NotFoundPartial />;

  const { initialPost, replies } = discussion;

  return (
    <div>
      <h1 className="margin-bottom-5">{t('general.discussion')}</h1>
      <DiscussionPost {...initialPost} />
      {replies.length > 0 && (
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
            <DiscussionsList
              type="replies"
              initialCount={4}
              className="discussion-replies-thread"
            >
              {replies.map(reply => (
                <li key={reply.id}>
                  <DiscussionPost {...reply} />
                </li>
              ))}
            </DiscussionsList>
          )}
        </>
      )}
      <h2 className="margin-bottom-2 margin-top-8">{t('general.reply')}</h2>
      <DiscussionForm
        type="reply"
        closeModal={closeModal}
        initialPostID={initialPost.id}
        setDiscussionAlert={setDiscussionAlert}
        mentionSuggestions={mentionSuggestions}
      />
    </div>
  );
};

export default Discussion;
