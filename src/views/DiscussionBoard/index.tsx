import React, { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import classNames from 'classnames';
import { SystemIntakeGRBReviewDiscussionFragment } from 'gql/gen/graphql';

import Alert from 'components/shared/Alert';
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

type DiscussionMode = 'view' | 'start' | 'reply' | undefined;

function DiscussionBoard({
  systemIntakeID,
  grbDiscussions
}: DiscussionBoardProps) {
  /** Discussion alert state for form success and error messages */
  const [discussionAlert, setDiscussionAlert] = useState<DiscussionAlert>(null);

  // Get the first discussion from the array for testing purposes
  const activeDiscussion = grbDiscussions.length > 0 ? grbDiscussions[0] : null;

  const history = useHistory();

  const location = useLocation();
  const q = new URLSearchParams(location.search);
  const discussionMode = (q.get('discussion') || undefined) as DiscussionMode;

  // Reset discussionAlert when side panel is opened or closed
  useEffect(() => {
    setDiscussionAlert(null);
  }, [setDiscussionAlert, discussionMode]);

  const closeModal = () => {
    history.push(`${location.pathname}`);
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
          // TODO: Update to discussion being viewed
          discussion={activeDiscussion}
          closeModal={closeModal}
          setDiscussionAlert={setDiscussionAlert}
        />
      )}
    </DiscussionModalWrapper>
  );
}

export default DiscussionBoard;
