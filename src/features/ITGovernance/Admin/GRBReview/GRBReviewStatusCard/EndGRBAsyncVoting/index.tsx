import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { Button, ButtonGroup } from '@trussworks/react-uswds';
import {
  SystemIntakeGRBReviewFragment,
  useEndGRBReviewAsyncVotingMutation
} from 'gql/generated/graphql';

import Alert from 'components/Alert';
import Modal from 'components/Modal';
import useMessage from 'hooks/useMessage';
import { formatDaysHoursMinutes } from 'utils/date';

type EndGRBAsyncVotingProps = {
  grbReviewAsyncEndDate: SystemIntakeGRBReviewFragment['grbReviewAsyncEndDate'];
  grbVotingInformation: SystemIntakeGRBReviewFragment['grbVotingInformation'];
};

/**
 * Displays End Voting button that triggers modal to manually end the GRB voting period
 */
const EndGRBAsyncVoting = ({
  grbReviewAsyncEndDate,
  grbVotingInformation
}: EndGRBAsyncVotingProps) => {
  const { t } = useTranslation('grbReview');

  const { systemId } = useParams<{
    systemId: string;
  }>();

  const { showMessage } = useMessage();

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [err, setError] = useState<boolean>(false);

  const [mutate] = useEndGRBReviewAsyncVotingMutation({
    variables: {
      systemIntakeID: systemId
    }
  });

  const endVoting = () => {
    mutate()
      .then(() =>
        showMessage(t('statusCard.endVotingModal.success'), {
          type: 'success'
        })
      )
      .catch(() => setError(true));
  };

  const { days, hours, minutes } = formatDaysHoursMinutes(
    grbReviewAsyncEndDate
  );

  return (
    <>
      <Modal
        isOpen={isOpen}
        closeModal={() => setIsOpen(false)}
        className="easi-body-normal padding-bottom-1 maxw-mobile-lg height-fit-content"
      >
        <h3 className="margin-top-0 margin-bottom-0">
          {t('statusCard.endVotingModal.heading')}
        </h3>

        {err && (
          <Alert type="error" slim>
            {t('statusCard.endVotingModal.error')}
          </Alert>
        )}

        <p>{t('statusCard.endVotingModal.description')}</p>

        <p className="text-bold margin-top-1 margin-bottom-0">
          {t('statusCard.endVotingModal.timeRemaining')}
        </p>

        <p className="easi-body-medium margin-top-0 margin-bottom-2 margin-right-2">
          {t('statusCard.countdown', {
            days,
            hours,
            minutes
          })}
        </p>

        <p className="text-bold margin-top-1 margin-bottom-0">
          {t('statusCard.endVotingModal.votingStatus')}
        </p>

        <p className="easi-body-medium margin-top-0 margin-bottom-05 margin-right-2">
          {t('decisionCard.voteInfo', {
            noObjection: grbVotingInformation.numberOfNoObjection,
            objection: grbVotingInformation.numberOfObjection,
            notVoted: grbVotingInformation.numberOfNotVoted
          })}
        </p>

        <ButtonGroup className="margin-top-4">
          <Button type="button" secondary onClick={() => endVoting()}>
            {t('statusCard.endVotingModal.endEarly')}
          </Button>

          <Button
            type="button"
            className="margin-left-2"
            unstyled
            onClick={() => setIsOpen(false)}
          >
            {t('statusCard.endVotingModal.goBack')}
          </Button>
        </ButtonGroup>
      </Modal>

      {/* Modal trigger button */}
      <Button
        type="button"
        outline
        onClick={() => {
          setIsOpen(true);
        }}
      >
        {t('statusCard.endVoting')}
      </Button>
    </>
  );
};

export default EndGRBAsyncVoting;
