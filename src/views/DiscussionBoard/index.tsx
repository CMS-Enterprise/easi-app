import React from 'react';
import { SystemIntakeGRBReviewDiscussionFragment } from 'gql/gen/graphql';

// import Discussion from './Discussion';
import DiscussionModalWrapper from './DiscussionModalWrapper';
import ViewDiscussions from './ViewDiscussions';
// import StartDiscussion from './StartDiscussion';

type DiscussionBoardProps = {
  systemIntakeId: string;
  grbDiscussions: SystemIntakeGRBReviewDiscussionFragment[];
  isOpen: boolean;
  closeModal: () => void;
};

function DiscussionBoard({
  systemIntakeId,
  grbDiscussions,
  isOpen,
  closeModal
}: DiscussionBoardProps) {
  return (
    <DiscussionModalWrapper isOpen={isOpen} closeModal={closeModal}>
      <ViewDiscussions grbDiscussions={grbDiscussions} />

      {/* <StartDiscussion
        systemIntakeId={systemIntakeId}
        closeModal={closeModal}
      /> */}

      {/* <Discussion
        // TODO: Replace with active discussion
        discussion={grbDiscussions[0]}
        systemIntakeId={systemIntakeId}
      /> */}
    </DiscussionModalWrapper>
  );
}

export default DiscussionBoard;
