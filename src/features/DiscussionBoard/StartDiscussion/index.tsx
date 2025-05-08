import React from 'react';
import { useTranslation } from 'react-i18next';
import { NotFoundPartial } from 'features/Miscellaneous/NotFound';
import { SystemIntakeGRBDiscussionBoardType } from 'gql/generated/graphql';

import { DiscussionAlert, MentionSuggestion } from 'types/discussions';

import DiscussionForm from '../_components/DiscussionForm';

type StartDiscussionProps = {
  systemIntakeID: string;
  discussionBoardType: SystemIntakeGRBDiscussionBoardType;
  closeModal: () => void;
  setDiscussionAlert: (discussionAlert: DiscussionAlert) => void;
  mentionSuggestions: MentionSuggestion[];
  readOnly?: boolean;
};

/**
 * Form to start new discussion post
 */
const StartDiscussion = ({
  systemIntakeID,
  discussionBoardType,
  closeModal,
  setDiscussionAlert,
  mentionSuggestions,
  readOnly
}: StartDiscussionProps) => {
  const { t } = useTranslation('discussions');

  if (readOnly) {
    return <NotFoundPartial />;
  }

  return (
    <div>
      <h1 className="margin-bottom-205">
        {t('general.startDiscussion.heading')}
      </h1>
      <p className="line-height-body-5">
        {t('general.startDiscussion.description', {
          context: discussionBoardType
        })}
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
