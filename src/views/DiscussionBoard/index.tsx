import React from 'react';
import { Button, ButtonGroup } from '@trussworks/react-uswds';

import MentionTextArea from '../../components/MentionTextArea';

import DiscussionModalWrapper from './DiscussionModalWrapper';

type DiscussionBoardProps = {
  isOpen: boolean;
  closeModal: () => void;
  id: string;
};

function DiscussionBoard({ isOpen, closeModal, id }: DiscussionBoardProps) {
  return (
    <DiscussionModalWrapper isOpen={isOpen} closeModal={closeModal}>
      {/* Question */}
      <h1 className="line-height-heading-4 margin-top-0 margin-bottom-1">
        Start a discussion
      </h1>
      <p className="font-body-md line-height-body-4 margin-top-1 margin-bottom-5">
        Have a question or comment that you want to discuss internally with the
        Governance Admin Team or other Governance Review Board (GRB) members
        involved in this request? Start a discussion and you’ll be notified when
        they reply.
      </p>
      <div className="position-relative">
        <MentionTextArea
          id={`${id}-mention-question`}
          editable
          className="font-body-md"
        />
      </div>
      <ButtonGroup className="margin-top-3">
        <Button type="button" outline onClick={() => closeModal()}>
          Cancel
        </Button>
        <Button type="button" disabled>
          Save discussion
        </Button>
      </ButtonGroup>
    </DiscussionModalWrapper>
  );
}

export default DiscussionBoard;
