import React, { useState } from 'react';
import { Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';
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

  const history = useHistory();

  const [error, setError] = useState<boolean>(false);

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

  const voteType: SystemIntakeAsyncGRBVotingOption = watch('vote');

  const commentRequired =
    voteType === SystemIntakeAsyncGRBVotingOption.OBJECTION ||
    !!grbReviewer.vote;

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
          {voteType === SystemIntakeAsyncGRBVotingOption.NO_OBJECTION
            ? t('reviewTask.voting.modal.titleNoObjection')
            : t('reviewTask.voting.modal.titleObject')}
        </h3>

        {error && (
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
          render={({ field }) => (
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
