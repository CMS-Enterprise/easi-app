import React from 'react';
import { useTranslation } from 'react-i18next';
import { SystemIntakeGRBDiscussionBoardType } from 'gql/generated/graphql';

import { DiscussionAlert, MentionSuggestion } from 'types/discussions';

import DiscussionForm from '../DiscussionForm';

type StartDiscussionProps = {
  systemIntakeID: string;
  discussionBoardType: SystemIntakeGRBDiscussionBoardType;
  closeModal: () => void;
  setDiscussionAlert: (discussionAlert: DiscussionAlert) => void;
  mentionSuggestions: MentionSuggestion[];
};

/**
 * Form to start new discussion post
 */
const StartDiscussion = ({
  systemIntakeID,
  discussionBoardType,
  closeModal,
  setDiscussionAlert,
  mentionSuggestions
}: StartDiscussionProps) => {
  const { t } = useTranslation('discussions');

  return (
    <div>
      <h1 className="margin-bottom-205">
        {t('general.startDiscussion.heading')}
      </h1>
      <p className="line-height-body-5 margin-bottom-5">
        {t('general.startDiscussion.description')}
      </p>

      <DiscussionForm
        discussionBoardType={discussionBoardType}
        closeModal={closeModal}
        type="discussion"
        systemIntakeID={systemIntakeID}
        setDiscussionAlert={setDiscussionAlert}
        mentionSuggestions={mentionSuggestions}
      />
    </div>
  );
};

export default StartDiscussion;
