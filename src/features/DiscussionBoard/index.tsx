import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import {
  SystemIntakeGRBReviewDiscussionFragment,
  SystemIntakeGRBReviewerFragment,
  TagType
} from 'gql/generated/graphql';

import Alert from 'components/Alert';
import useDiscussionParams, { DiscussionMode } from 'hooks/useDiscussionParams';
import { DiscussionAlert, MentionSuggestion } from 'types/discussions';

import Discussion from './Discussion';
import DiscussionModalWrapper from './DiscussionModalWrapper';
import StartDiscussion from './StartDiscussion';
import ViewDiscussions from './ViewDiscussions';

import './index.scss';

type DiscussionBoardProps = {
  systemIntakeID: string;
  grbReviewers: SystemIntakeGRBReviewerFragment[];
  grbDiscussions: SystemIntakeGRBReviewDiscussionFragment[];
};

function DiscussionBoard({
  systemIntakeID,
  grbReviewers,
  grbDiscussions
}: DiscussionBoardProps) {
  /** Discussion alert state for form success and error messages */
  const [discussionAlert, setDiscussionAlert] = useState<DiscussionAlert>(null);

  const { getDiscussionParams, pushDiscussionQuery } = useDiscussionParams();
  const { discussionMode, discussionId } = getDiscussionParams();

  // Reset discussionAlert when the side panel changes from certain modes
  const [lastMode, setLastMode] = useState<DiscussionMode | undefined>(
    discussionMode
  );

  /** Mention suggestions for discussion form tags */
  const mentionSuggestions: MentionSuggestion[] = [
    {
      displayName: 'Governance Admin Team',
      tagType: TagType.GROUP_IT_GOV
    },
    {
      displayName: 'Governance Review Board (GRB)',
      tagType: TagType.GROUP_GRB_REVIEWERS
    },
    ...grbReviewers.map(({ userAccount }) => ({
      key: userAccount.username,
      tagType: TagType.USER_ACCOUNT,
      displayName: userAccount.commonName,
      id: userAccount.id
    }))
  ];

  const activeDiscussion =
    grbDiscussions.find(d => d.initialPost.id === discussionId) || null;

  useEffect(() => {
    if (lastMode !== discussionMode) {
      if (lastMode === 'view' || lastMode === 'reply') {
        setDiscussionAlert(null);
      }
      setLastMode(discussionMode);
    }
  }, [discussionMode, lastMode, setDiscussionAlert]);

  const closeModal = () => {
    pushDiscussionQuery(false);
  };

  return (
    <DiscussionModalWrapper
      isOpen={discussionMode !== undefined}
      closeModal={closeModal}
    >
      {discussionAlert && (
        <Alert
          slim
          {...discussionAlert}
          className={classNames('margin-bottom-6', discussionAlert.className)}
          isClosable={false}
        >
          {discussionAlert.message}
        </Alert>
      )}

      {discussionMode === 'view' && (
        <ViewDiscussions grbDiscussions={grbDiscussions} />
      )}

      {discussionMode === 'start' && (
        <StartDiscussion
          mentionSuggestions={mentionSuggestions}
          systemIntakeID={systemIntakeID}
          closeModal={closeModal}
          setDiscussionAlert={setDiscussionAlert}
        />
      )}

      {discussionMode === 'reply' && (
        <Discussion
          mentionSuggestions={mentionSuggestions}
          discussion={activeDiscussion}
          closeModal={closeModal}
          setDiscussionAlert={setDiscussionAlert}
        />
      )}
    </DiscussionModalWrapper>
  );
}

export default DiscussionBoard;
