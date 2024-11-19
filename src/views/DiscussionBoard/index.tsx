import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { SystemIntakeGRBReviewDiscussionFragment } from 'gql/gen/graphql';

import Alert from 'components/shared/Alert';
import { DiscussionAlert } from 'types/discussions';

import Discussion from './Discussion';
import DiscussionModalWrapper from './DiscussionModalWrapper';

// import ViewDiscussions from './ViewDiscussions';
// import StartDiscussion from './StartDiscussion';
import './index.scss';

type DiscussionBoardProps = {
  systemIntakeID: string;
  grbDiscussions: SystemIntakeGRBReviewDiscussionFragment[];
  isOpen: boolean;
  closeModal: () => void;
};

function DiscussionBoard({
  systemIntakeID,
  grbDiscussions,
  isOpen,
  closeModal
}: DiscussionBoardProps) {
  /** Discussion alert state for form success and error messages */
  const [discussionAlert, setDiscussionAlert] = useState<DiscussionAlert>(null);

  // Reset discussionAlert when side panel is opened or closed
  useEffect(() => {
    setDiscussionAlert(null);
  }, [setDiscussionAlert, isOpen]);

  return (
    <DiscussionModalWrapper isOpen={isOpen} closeModal={closeModal}>
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
      {/* <ViewDiscussions grbDiscussions={grbDiscussions} /> */}

      {/* <StartDiscussion
        systemIntakeID={systemIntakeId}
        closeModal={closeModal}
      /> */}

      <Discussion
        // TODO: Replace with active discussion
        discussion={grbDiscussions[0]}
        closeModal={closeModal}
        setDiscussionAlert={setDiscussionAlert}
      />
    </DiscussionModalWrapper>
  );
}

export default DiscussionBoard;
