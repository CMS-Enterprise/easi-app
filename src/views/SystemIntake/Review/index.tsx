import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { Button } from '@trussworks/react-uswds';
import classNames from 'classnames';

import FeedbackBanner from 'components/FeedbackBanner';
import PageHeading from 'components/PageHeading';
import PageNumber from 'components/PageNumber';
import { SystemIntakeReview } from 'components/SystemIntakeReview';
import { SubmitIntake as SubmitIntakeQuery } from 'queries/SystemIntakeQueries';
import {
  SubmitIntake,
  SubmitIntakeVariables
} from 'queries/types/SubmitIntake';
import { SystemIntake } from 'queries/types/SystemIntake';
import { SystemIntakeFormState } from 'types/graphql-global-types';

type ReviewProps = {
  systemIntake: SystemIntake;
};

const Review = ({ systemIntake }: ReviewProps) => {
  const history = useHistory();
  const { t } = useTranslation('intake');

  const [mutate, mutationResult] = useMutation<
    SubmitIntake,
    SubmitIntakeVariables
  >(SubmitIntakeQuery);

  const hasEditsRequested =
    systemIntake.requestFormState === SystemIntakeFormState.EDITS_REQUESTED;

  return (
    <div className="system-intake__review">
      <PageHeading
        className={classNames({ 'margin-bottom-3': hasEditsRequested })}
      >
        {t('review.heading')}
      </PageHeading>

      {hasEditsRequested && (
        <FeedbackBanner
          id={systemIntake.id}
          type="Intake Request"
          className="margin-bottom-3"
        />
      )}

      <SystemIntakeReview systemIntake={systemIntake} />
      <hr className="system-intake__hr" />
      <h2 className="font-heading-xl">{t('review.nextSteps.heading')}</h2>
      <p>
        <Trans i18nKey="intake:review.nextSteps.description" />
      </p>
      <ul className="usa-list">
        <li>{t('review.nextSteps.direct')}</li>
        <li>{t('review.nextSteps.decide')}</li>
      </ul>
      <p className="margin-bottom-6">{t('review.nextSteps.timeline')}</p>
      <Button
        type="button"
        outline
        onClick={() => {
          const newUrl = 'documents';
          history.push(newUrl);
        }}
      >
        {t('Back')}
      </Button>
      <Button
        type="submit"
        disabled={mutationResult.loading}
        onClick={() =>
          mutate({
            variables: {
              input: { id: systemIntake.id }
            }
          }).then(response => {
            if (!response.errors) {
              history.push(`/system/${systemIntake.id}/confirmation`);
            }
          })
        }
      >
        {t('review.sendIntakeRequest')}
      </Button>
      <PageNumber className="margin-top-8" currentPage={5} totalPages={5} />
    </div>
  );
};

export default Review;
