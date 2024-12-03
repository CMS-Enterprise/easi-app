import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { SystemIntakeGRBReviewDiscussionFragment } from 'gql/gen/graphql';

import Alert from 'components/shared/Alert';
import useDiscussionParams, { DiscussionMode } from 'hooks/useDiscussionParams';
import { DiscussionAlert } from 'types/discussions';

import Discussion from './Discussion';
import DiscussionModalWrapper from './DiscussionModalWrapper';
import StartDiscussion from './StartDiscussion';
import ViewDiscussions from './ViewDiscussions';

import './index.scss';

type DiscussionBoardProps = {
  systemIntakeID: string;
  grbDiscussions: SystemIntakeGRBReviewDiscussionFragment[];
};

function DiscussionBoard({
  systemIntakeID,
  grbDiscussions
}: DiscussionBoardProps) {
  /** Discussion alert state for form success and error messages */
  const [discussionAlert, setDiscussionAlert] = useState<DiscussionAlert>(null);

  const { getDiscussionParams, pushDiscussionQuery } = useDiscussionParams();
  const { discussionMode, discussionId } = getDiscussionParams();

  const activeDiscussion =
    grbDiscussions.find(d => d.initialPost.id === discussionId) || null;

  // Reset discussionAlert when the side panel changes from certain modes
  const [lastMode, setLastMode] = useState<DiscussionMode | undefined>(
    discussionMode
  );
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
          systemIntakeID={systemIntakeID}
          closeModal={closeModal}
          setDiscussionAlert={setDiscussionAlert}
        />
      )}

      {discussionMode === 'reply' && (
        <Discussion
          discussion={activeDiscussion}
          closeModal={closeModal}
          setDiscussionAlert={setDiscussionAlert}
        />
      )}
    </DiscussionModalWrapper>
  );
}

export default DiscussionBoard;
