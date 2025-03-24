import React, { useState } from 'react';
import { Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { ErrorMessage } from '@hookform/error-message';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, ButtonGroup, FormGroup, Label } from '@trussworks/react-uswds';
import {
  CastGRBReviewerVoteMutationVariables,
  SystemIntakeAsyncGRBVotingOption,
  SystemIntakeGRBReviewerFragment,
  useCastGRBReviewerVoteMutation
} from 'gql/generated/graphql';

import Alert from 'components/Alert';
import { useEasiForm } from 'components/EasiForm';
import FieldErrorMsg from 'components/FieldErrorMsg';
import Modal from 'components/Modal';
import RequiredFieldsText from 'components/RequiredFieldsText';
import TextAreaField from 'components/TextAreaField';
import { GRBVoteSchema } from 'validations/grbReviewSchema';

import GRBVoteStatus from '../GRBVoteStatus';

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

  const hasVoted = !!grbReviewer.vote;

  // Default to the opposite of the current vote
  const defaultVote =
    grbReviewer.vote === SystemIntakeAsyncGRBVotingOption.NO_OBJECTION
      ? SystemIntakeAsyncGRBVotingOption.OBJECTION
      : SystemIntakeAsyncGRBVotingOption.NO_OBJECTION;

  const {
    control,
    watch,
    setValue,
    handleSubmit,
    reset,
    formState: { errors }
  } = useEasiForm<CastGRBReviewerVoteMutationVariables['input']>({
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
    },
    resolver: hasVoted
      ? yupResolver(GRBVoteSchema(grbReviewer.voteComment))
      : undefined
  });

  // Current vote type - objection or no objection
  const voteType: SystemIntakeAsyncGRBVotingOption = watch('vote');

  // Comment is required if voting for objection or if the user has already voted
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

  const resetModal = () => {
    setError(false);
    reset();
    setIsOpen(false);
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        closeModal={() => resetModal()}
        className="easi-body-normal padding-bottom-1"
      >
        <h3 className="margin-top-0 margin-bottom-0">
          {hasVoted ? (
            t('reviewTask.voting.modal.titleChangeVote')
          ) : (
            <>
              {voteType === SystemIntakeAsyncGRBVotingOption.NO_OBJECTION
                ? t('reviewTask.voting.modal.titleNoObjection')
                : t('reviewTask.voting.modal.titleObject')}
            </>
          )}
        </h3>

        <GRBVoteStatus
          vote={grbReviewer.vote}
          dateVoted={grbReviewer.dateVoted}
          className="margin-bottom-0 margin-top-1"
        />

        {err && (
          <Alert type="error" slim>
            {t('technicalAssistance:documents.upload.error')}
          </Alert>
        )}

        <p>
          {hasVoted
            ? t('reviewTask.voting.modal.descriptionChangeVote')
            : t('reviewTask.voting.modal.description')}
        </p>

        {commentRequired && (
          <RequiredFieldsText className="margin-top-0 font-body-sm" />
        )}

        <Controller
          name="voteComment"
          control={control}
          render={({ field }) => (
            <FormGroup className="margin-top-0">
              <Label
                id="voteCommentLabel"
                htmlFor="voteComment"
                requiredMarker={commentRequired}
              >
                {commentRequired
                  ? t('reviewTask.voting.modal.comments')
                  : t('reviewTask.voting.modal.commentsOptional')}
              </Label>

              <p className="text-base margin-y-1">
                {hasVoted
                  ? t('reviewTask.voting.modal.hintChangeVote')
                  : t('reviewTask.voting.modal.hint')}
              </p>

              <ErrorMessage
                errors={errors}
                name="voteComment"
                as={<FieldErrorMsg />}
              />

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
          disabled={commentRequired && !watch('voteComment')?.trim()}
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
          onClick={() => {
            resetModal();
          }}
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
            {t(
              `reviewTask.voting.${SystemIntakeAsyncGRBVotingOption.NO_OBJECTION}`
            )}
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
      )}
    </>
  );
};

export default GRBVotingModal;
