import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Icon } from '@trussworks/react-uswds';
import { NotFoundPartial } from 'features/Miscellaneous/NotFound';
import {
  SystemIntakeGRBDiscussionBoardType,
  SystemIntakeGRBReviewDiscussionFragment
} from 'gql/generated/graphql';

import IconButton from 'components/IconButton';
import { DiscussionAlert, MentionSuggestion } from 'types/discussions';

import DiscussionForm from '../_components/DiscussionForm';
import DiscussionsList from '../_components/DiscussionList';
import DiscussionPost from '../_components/DiscussionPost';

type DiscussionProps = {
  discussionBoardType: SystemIntakeGRBDiscussionBoardType;
  discussion: SystemIntakeGRBReviewDiscussionFragment | null;
  setDiscussionAlert: (discussionAlert: DiscussionAlert) => void;
  mentionSuggestions: MentionSuggestion[];
  readOnly?: boolean;
};

/**
 * Single discussion post view
 *
 * Displays discussion, replies, and form to reply to discussion post
 */
const Discussion = ({
  discussionBoardType,
  discussion,
  setDiscussionAlert,
  mentionSuggestions,
  readOnly
}: DiscussionProps) => {
  const { t } = useTranslation('discussions');
  const [showReplies, setShowReplies] = useState(true);

  if (!discussion) return <NotFoundPartial />;

  const { initialPost, replies } = discussion;

  return (
    <div>
      <h1 className="margin-bottom-5">{t('general.discussion')}</h1>
      <DiscussionPost
        {...initialPost}
        discussionBoardType={discussionBoardType}
        readOnly={readOnly}
      />
      {replies.length > 0 && (
        <>
          <div className="display-flex flex-justify">
            <h4 className="margin-right-1">
              {t('general.repliesCount', { count: replies.length })}
            </h4>
            <IconButton
              type="button"
              onClick={() => setShowReplies(!showReplies)}
              icon={
                showReplies ? (
                  <Icon.ExpandLess aria-hidden />
                ) : (
                  <Icon.ExpandMore aria-hidden />
                )
              }
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
                  <DiscussionPost
                    {...reply}
                    discussionBoardType={discussionBoardType}
                    readOnly={readOnly}
                  />
                </li>
              ))}
            </DiscussionsList>
          )}
        </>
      )}

      {!readOnly && (
        <>
          <h2 className="margin-bottom-2 margin-top-8">{t('general.reply')}</h2>
          <DiscussionForm
            type="reply"
            discussionBoardType={discussionBoardType}
            initialPostID={initialPost.id}
            setDiscussionAlert={setDiscussionAlert}
            mentionSuggestions={mentionSuggestions}
          />
        </>
      )}
    </div>
  );
};

export default Discussion;
