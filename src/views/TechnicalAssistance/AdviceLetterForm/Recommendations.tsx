import React from 'react';
import { useTranslation } from 'react-i18next';
import { Route, Switch, useHistory, useRouteMatch } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { Alert, Button } from '@trussworks/react-uswds';

import { GetTrbRecommendationsQuery } from 'queries/TrbAdviceLetterQueries';
import { GetTrbRecommendations } from 'queries/types/GetTrbRecommendations';

import Pager from '../RequestForm/Pager';

import RecommendationsForm from './RecommendationsForm';

const Recommendations = ({ trbRequestId }: { trbRequestId: string }) => {
  const { t } = useTranslation('technicalAssistance');
  const { path, url } = useRouteMatch();
  const history = useHistory();

  const { data } = useQuery<GetTrbRecommendations>(GetTrbRecommendationsQuery, {
    variables: { id: trbRequestId }
  });

  const recommendations = data?.trbRequest?.adviceLetter?.recommendations;

  /** Whether recommendations have been added to the request */
  // TODO: Get recommendations query
  const hasRecommendations: boolean =
    !!recommendations && recommendations.length > 0;

  return (
    <Switch>
      {/** Recommendations Form */}
      <Route exact path={`${path}/form`}>
        <RecommendationsForm trbRequestId={trbRequestId} />
      </Route>

      {/** Recommendations list */}
      <Route exact path={`${path}`}>
        {/** Add recommendation button */}
        <Button
          className="margin-top-5 margin-bottom-1"
          type="button"
          onClick={() => history.push(`${url}/form`)}
        >
          {t('adviceLetterForm.addRecommendation')}
        </Button>

        {/** No recommendations message */}
        <Alert type="info" slim>
          {t('adviceLetterForm.noRecommendations')}
        </Alert>

        {/** Form pager buttons */}
        <Pager
          className="margin-top-4"
          back={{
            outline: true,
            onClick: () => {
              history.push(`/trb/${trbRequestId}/advice/summary`);
            }
          }}
          next={{
            // TODO: disabled logic
            // disabled: isSubmitting,
            text: hasRecommendations
              ? t('button.next')
              : t('adviceLetterForm.continueWithoutAdding'),
            onClick: () =>
              history.push(`/trb/${trbRequestId}/advice/next-steps`),
            outline: !hasRecommendations
          }}
          taskListUrl={`/trb/${trbRequestId}/request`}
          saveExitText={t('adviceLetterForm.returnToRequest')}
          border={false}
        />
      </Route>
    </Switch>
  );
};

export default Recommendations;
