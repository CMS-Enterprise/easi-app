import React from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
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

  const { t } = useTranslation('discussions');

  return (
    <DiscussionModalWrapper isOpen={isOpen} closeModal={closeModal}>
      {/* Question */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <h1 className="line-height-heading-4 margin-top-0 margin-bottom-1">
          {t('general.startDiscussion')}
        </h1>
        <p className="font-body-md line-height-body-4 margin-top-1 margin-bottom-5">
          {t('general.contribute.description', {
            groupNames:
              'Governance Admin Team or other Governance Review Board (GRB)'
          })}
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
            {t('general.cancel')}
          </Button>
          <Button type="submit" disabled={!isValid}>
            {t('general.saveDiscussion')}
          </Button>
        </ButtonGroup>
      </form>
    </DiscussionModalWrapper>
  );
}

export default DiscussionBoard;
