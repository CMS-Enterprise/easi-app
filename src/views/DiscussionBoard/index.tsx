import React from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { Button, ButtonGroup } from '@trussworks/react-uswds';

import MentionTextArea from '../../components/MentionTextArea';

import DiscussionModalWrapper from './DiscussionModalWrapper';

type DiscussionBoardProps = {
  isOpen: boolean;
  closeModal: () => void;
  id: string;
};

type DiscussionForm = {
  content: string;
};

function DiscussionBoard({ isOpen, closeModal, id }: DiscussionBoardProps) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { isValid }
  } = useForm<DiscussionForm>({
    defaultValues: {
      content: ''
    },
    values: {
      content: 'initial content todo'
    }
  });

  const onSubmit: SubmitHandler<DiscussionForm> = data => console.log(data);

  return (
    <DiscussionModalWrapper isOpen={isOpen} closeModal={closeModal}>
      {/* Question */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <h1 className="line-height-heading-4 margin-top-0 margin-bottom-1">
          Start a discussion
        </h1>
        <p className="font-body-md line-height-body-4 margin-top-1 margin-bottom-5">
          Have a question or comment that you want to discuss internally with
          the Governance Admin Team or other Governance Review Board (GRB)
          members involved in this request? Start a discussion and you’ll be
          notified when they reply.
        </p>
        <div className="position-relative">
          <Controller
            name="content"
            control={control}
            rules={{ required: true }}
            render={({ field }) => {
              return (
                <MentionTextArea
                  id={`${id}-mention-question`}
                  editable
                  className="font-body-md"
                  initialContent={field.value}
                  setFieldValue={(fieldname, value) => field.onChange(value)}
                />
              );
            }}
          />
        </div>
        <ButtonGroup className="margin-top-3">
          <Button
            type="button"
            outline
            onClick={() => {
              reset();
              closeModal();
            }}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={!isValid}>
            Save discussion
          </Button>
        </ButtonGroup>
      </form>
    </DiscussionModalWrapper>
  );
}

export default DiscussionBoard;
