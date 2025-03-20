import React, { useState } from 'react';
import { Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';
import { Button, ButtonGroup, FormGroup, Label } from '@trussworks/react-uswds';
import {
  CastGRBReviewerVoteMutationVariables,
  SystemIntakeAsyncGRBVotingOption,
  useCastGRBReviewerVoteMutation
} from 'gql/generated/graphql';

import { useEasiForm } from 'components/EasiForm';
import Modal from 'components/Modal';
import RequiredFieldsText from 'components/RequiredFieldsText';
import TextAreaField from 'components/TextAreaField';
import useMessage from 'hooks/useMessage';

type GRBVotingModalProps = {
  commentRequired: boolean;
};

const GRBVotingModal = ({ commentRequired }: GRBVotingModalProps) => {
  const { t } = useTranslation('grbReview');

  const { systemId } = useParams<{
    systemId: string;
  }>();

  const history = useHistory();

  const { showMessage } = useMessage();

  const [isOpen, setIsOpen] = useState<boolean>(false);

  const { control, watch, setValue, handleSubmit } = useEasiForm<
    CastGRBReviewerVoteMutationVariables['input']
  >({
    defaultValues: {
      systemIntakeID: systemId,
      vote: SystemIntakeAsyncGRBVotingOption.NO_OBJECTION,
      voteComment: ''
    },
    values: {
      systemIntakeID: systemId,
      vote: SystemIntakeAsyncGRBVotingOption.NO_OBJECTION,
      voteComment: ''
    }
  });

  const [mutation] = useCastGRBReviewerVoteMutation();

  const castVote = handleSubmit(async input => {
    mutation({
      variables: {
        input: {
          systemIntakeID: systemId,
          vote: input.vote,
          voteComment: input.voteComment
        }
      }
    })
      .then(() => {
        history.push('/');
      })
      .catch(() => {
        showMessage(t('technicalAssistance:documents.upload.error'), {
          type: 'error',
          className: 'margin-top-4'
        });
      });
  });

  const voteType: SystemIntakeAsyncGRBVotingOption = watch('vote');

  return (
    <>
      <Modal isOpen={isOpen} closeModal={() => setIsOpen(false)}>
        <h3 className="margin-top-0 margin-bottom-0">
          {voteType === SystemIntakeAsyncGRBVotingOption.NO_OBJECTION
            ? t('reviewTask.voting.modal.titleNoObjection')
            : t('reviewTask.voting.modal.titleObject')}
        </h3>

        <p>{t('reviewTask.voting.modal.description')}</p>

        {commentRequired && (
          <RequiredFieldsText className="margin-top-0 font-body-sm" />
        )}

        <Controller
          name="voteComment"
          control={control}
          render={({ field }) => (
            <FormGroup>
              <Label
                htmlFor="text"
                hint={t('reviewTask.voting.modal.hint')}
                className="text-normal margin-top-6"
                requiredMarker={commentRequired}
              >
                {commentRequired
                  ? t('reviewTask.voting.modal.comments')
                  : t('reviewTask.voting.modal.commentsOptional')}
              </Label>

              <TextAreaField
                {...field}
                ref={null}
                id="text"
                value={field.value || ''}
                aria-describedby="text-info text-hint"
              />
            </FormGroup>
          )}
        />

        <Button
          type="button"
          onClick={() => {
            castVote();
          }}
        >
          {voteType === SystemIntakeAsyncGRBVotingOption.NO_OBJECTION
            ? t('reviewTask.voting.modal.confirmNoObjection')
            : t('reviewTask.voting.modal.confirmObject')}
        </Button>

        <Button
          type="button"
          className="margin-left-2"
          unstyled
          onClick={() => setIsOpen(false)}
        >
          {t('reviewTask.voting.modal.cancel')}
        </Button>
      </Modal>

      <ButtonGroup>
        <Button
          type="button"
          onClick={() => {
            setValue('vote', SystemIntakeAsyncGRBVotingOption.NO_OBJECTION);
            setIsOpen(true);
          }}
        >
          {t('reviewTask.voting.noObjection')}
        </Button>

        <Button
          type="button"
          onClick={() => {
            setValue('vote', SystemIntakeAsyncGRBVotingOption.OBJECTION);
            setIsOpen(true);
          }}
          secondary
        >
          {t('reviewTask.voting.object')}
        </Button>
      </ButtonGroup>
    </>
  );
};

export default GRBVotingModal;
