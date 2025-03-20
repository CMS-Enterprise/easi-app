import React, { useState } from 'react';
import { Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { Button, ButtonGroup, FormGroup, Label } from '@trussworks/react-uswds';
import {
  CastGRBReviewerVoteMutationVariables,
  SystemIntakeAsyncGRBVotingOption,
  SystemIntakeGRBReviewerFragment,
  useCastGRBReviewerVoteMutation
} from 'gql/generated/graphql';

import Alert from 'components/Alert';
import { useEasiForm } from 'components/EasiForm';
import Modal from 'components/Modal';
import RequiredFieldsText from 'components/RequiredFieldsText';
import TextAreaField from 'components/TextAreaField';

type GRBVotingModalProps = {
  grbReviewer: SystemIntakeGRBReviewerFragment;
};

const GRBVotingModal = ({ grbReviewer }: GRBVotingModalProps) => {
  const { t } = useTranslation('grbReview');

  const { systemId } = useParams<{
    systemId: string;
  }>();

  const [err, setError] = useState<boolean>(false);

  const [isOpen, setIsOpen] = useState<boolean>(false);

  const defaultVote =
    grbReviewer.vote === SystemIntakeAsyncGRBVotingOption.NO_OBJECTION
      ? SystemIntakeAsyncGRBVotingOption.OBJECTION
      : SystemIntakeAsyncGRBVotingOption.NO_OBJECTION;

  const { control, watch, setValue, handleSubmit } = useEasiForm<
    CastGRBReviewerVoteMutationVariables['input']
  >({
    defaultValues: {
      systemIntakeID: systemId,
      vote: grbReviewer.vote
        ? defaultVote
        : SystemIntakeAsyncGRBVotingOption.NO_OBJECTION,
      voteComment: grbReviewer.voteComment || ''
    },
    values: {
      systemIntakeID: systemId,
      vote: grbReviewer.vote
        ? defaultVote
        : SystemIntakeAsyncGRBVotingOption.NO_OBJECTION,
      voteComment: grbReviewer.voteComment || ''
    }
  });

  const hasVoted = !!grbReviewer.vote;

  const voteType: SystemIntakeAsyncGRBVotingOption = watch('vote');

  const commentRequired =
    voteType === SystemIntakeAsyncGRBVotingOption.OBJECTION || hasVoted;

  const [mutation] = useCastGRBReviewerVoteMutation();

  const castVote = handleSubmit(async input => {
    mutation({
      variables: {
        input: {
          systemIntakeID: systemId,
          vote: input.vote,
          voteComment: input.voteComment ? input.voteComment : undefined
        }
      },
      refetchQueries: ['GetSystemIntake']
    })
      .then(() => {
        setIsOpen(false);
      })
      .catch(() => {
        setError(true);
      });
  });

  return (
    <>
      <Modal
        isOpen={isOpen}
        closeModal={() => setIsOpen(false)}
        className="easi-body-normal padding-top-6 padding-bottom-1"
        hideCloseButton
      >
        <h3 className="margin-top-0 margin-bottom-0">
          {grbReviewer.vote ? (
            t('reviewTask.voting.modal.titleChangeVote')
          ) : (
            <>
              {voteType === SystemIntakeAsyncGRBVotingOption.NO_OBJECTION
                ? t('reviewTask.voting.modal.titleNoObjection')
                : t('reviewTask.voting.modal.titleObject')}
            </>
          )}
        </h3>

        {err && (
          <Alert type="error" slim>
            {t('technicalAssistance:documents.upload.error')}
          </Alert>
        )}

        <p>{t('reviewTask.voting.modal.description')}</p>

        {commentRequired && (
          <RequiredFieldsText className="margin-top-0 font-body-sm" />
        )}

        <Controller
          name="voteComment"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <FormGroup>
              <Label
                id="voteCommentLabel"
                htmlFor="voteComment"
                requiredMarker={commentRequired}
              >
                {commentRequired
                  ? t('reviewTask.voting.modal.comments')
                  : t('reviewTask.voting.modal.commentsOptional')}
              </Label>

              <p className="text-base margin-top-1">
                {t('reviewTask.voting.modal.hint')}
              </p>

              <TextAreaField
                {...field}
                ref={null}
                id="voteComment"
                value={field.value || ''}
                aria-describedby="voteCommentLabel"
                size="sm"
                className="margin-bottom-3"
              />
            </FormGroup>
          )}
        />

        <Button
          type="button"
          disabled={commentRequired && !watch('voteComment')}
          onClick={() => {
            castVote();
          }}
        >
          {hasVoted ? (
            <>
              {voteType === SystemIntakeAsyncGRBVotingOption.NO_OBJECTION
                ? t('reviewTask.voting.modal.confirmChangeVoteNoObjection')
                : t('reviewTask.voting.modal.confirmChangeVoteObjection')}
            </>
          ) : (
            <>
              {voteType === SystemIntakeAsyncGRBVotingOption.NO_OBJECTION
                ? t('reviewTask.voting.modal.confirmNoObjection')
                : t('reviewTask.voting.modal.confirmObject')}
            </>
          )}
        </Button>

        <Button
          type="button"
          className="margin-left-2"
          unstyled
          onClick={() => setIsOpen(false)}
        >
          {hasVoted
            ? t('reviewTask.voting.modal.keepExistingVote')
            : t('reviewTask.voting.modal.cancel')}
        </Button>
      </Modal>

      {hasVoted ? (
        <Button
          type="button"
          outline
          onClick={() => {
            setIsOpen(true);
          }}
        >
          {t('reviewTask.voting.changeVote')}
        </Button>
      ) : (
        <ButtonGroup>
          <Button
            type="button"
            onClick={() => {
              setValue('vote', SystemIntakeAsyncGRBVotingOption.NO_OBJECTION);
              setIsOpen(true);
            }}
          >
            {t('reviewTask.voting.NO_OBJECTION')}
          </Button>

          <Button
            type="button"
            onClick={() => {
              setValue('vote', SystemIntakeAsyncGRBVotingOption.OBJECTION);
              setIsOpen(true);
            }}
            secondary
          >
            {t('reviewTask.voting.OBJECTION')}
          </Button>
        </ButtonGroup>
      )}
    </>
  );
};

export default GRBVotingModal;
