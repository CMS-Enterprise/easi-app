import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import {
  SummaryBox,
  SummaryBoxContent,
  SummaryBoxHeading
} from '@trussworks/react-uswds';
import classNames from 'classnames';
import Pager from 'features/TechnicalAssistance/Requester/RequestForm/Pager';
import {
  SystemIntakeFormState,
  SystemIntakeFragmentFragment,
  useSubmitIntakeMutation
} from 'gql/generated/graphql';

import FeedbackBanner from 'components/FeedbackBanner';
import PageHeading from 'components/PageHeading';
import PageNumber from 'components/PageNumber';
import { SystemIntakeReview } from 'components/SystemIntakeReview';

type ReviewProps = {
  systemIntake: SystemIntakeFragmentFragment;
};

const Review = ({ systemIntake }: ReviewProps) => {
  const history = useHistory();
  const { t } = useTranslation('intake');

  const [mutate, mutationResult] = useSubmitIntakeMutation();

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

      <SystemIntakeReview
        systemIntake={systemIntake}
        showSubmissionDate={false}
        showEditSectionLink
      />

      <SummaryBox className="grid-col-6 margin-top-8 margin-bottom-5">
        <SummaryBoxHeading headingLevel="h3" className="margin-bottom-2">
          {t('review.nextSteps.heading')}
        </SummaryBoxHeading>
        <SummaryBoxContent>
          {t('review.nextSteps.description')}
        </SummaryBoxContent>
      </SummaryBox>

      <Pager
        next={{
          type: 'submit',
          text: t('review.submitIntakeRequest'),
          disabled: mutationResult.loading
        }}
        back={{
          type: 'button',
          onClick: () => history.push('documents')
        }}
        border={false}
        taskListUrl={`/governance-task-list/${systemIntake.id}`}
        saveExitText={t('review.saveWithoutSubmitting')}
        submit={() =>
          mutate({
            variables: {
              input: { id: systemIntake.id }
            }
          }).then(response => {
            if (!response.errors) {
              history.push(`/system/${systemIntake.id}/confirmation`);
            } else {
              history.push(`/system/${systemIntake.id}/confirmation-error`);
            }
          })
        }
        className="margin-top-5"
      />

      <PageNumber className="margin-top-6" currentPage={5} totalPages={5} />
    </div>
  );
};

export default Review;
