import React from 'react';
import { SystemIntakeGRBReviewDiscussionFragment } from 'gql/gen/graphql';

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
  return (
    <DiscussionModalWrapper isOpen={isOpen} closeModal={closeModal}>
      {/* <ViewDiscussions grbDiscussions={grbDiscussions} /> */}

      {/* <StartDiscussion
        systemIntakeID={systemIntakeId}
        closeModal={closeModal}
      /> */}

      <Discussion
        // TODO: Replace with active discussion
        discussion={grbDiscussions[0]}
        closeModal={closeModal}
      />
    </DiscussionModalWrapper>
  );
}

export default DiscussionBoard;
