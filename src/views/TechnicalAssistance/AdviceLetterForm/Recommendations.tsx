import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { Alert, Button } from '@trussworks/react-uswds';

import { GetTrbAdviceLetter_trbRequest_adviceLetter_recommendations as TRBRecommendation } from 'queries/types/GetTrbAdviceLetter';

import Pager from '../RequestForm/Pager';

export type RecommendationsProps = {
  trbRequestId: string;
  recommendations: TRBRecommendation[];
};

const Recommendations = ({
  trbRequestId,
  recommendations
}: RecommendationsProps) => {
  const { t } = useTranslation('technicalAssistance');
  const history = useHistory();

  /** Whether recommendations have been added to the request */
  const hasRecommendations: boolean = recommendations.length > 0;

  return (
    <div>
      {/* Add recommendation button */}
      <Button
        className="margin-top-5 margin-bottom-1"
        type="button"
        onClick={() => null}
      >
        {t('adviceLetterForm.addRecommendation')}
      </Button>

      {
        /* No recommendations message */
        !hasRecommendations ? (
          <Alert type="info" slim>
            {t('adviceLetterForm.noRecommendations')}
          </Alert>
        ) : (
          /* Recommendations list */
          <ul>
            {recommendations.map(({ title, id }) => (
              <li key={id}>{title}</li>
            ))}
          </ul>
        )
      }

      {/* Form pager buttons */}
      <Pager
        className="margin-top-4"
        back={{
          outline: true,
          onClick: () => {
            history.push(`/trb/${trbRequestId}/advice/summary`);
          }
        }}
        next={{
          text: hasRecommendations
            ? t('button.next')
            : t('adviceLetterForm.continueWithoutAdding'),
          onClick: () => history.push(`/trb/${trbRequestId}/advice/next-steps`),
          outline: !hasRecommendations
        }}
        taskListUrl={`/trb/${trbRequestId}/request`}
        saveExitText={t('adviceLetterForm.returnToRequest')}
        border={false}
      />
    </div>
  );
};

export default Recommendations;
