import React from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Route, Switch, useHistory, useRouteMatch } from 'react-router-dom';
import { Alert, Button } from '@trussworks/react-uswds';

import { AdviceLetterFormFields } from 'types/technicalAssistance';

import Pager from '../RequestForm/Pager';

import RecommendationsForm from './RecommendationsForm';

const Recommendations = ({ trbRequestId }: { trbRequestId: string }) => {
  const { t } = useTranslation('technicalAssistance');
  const { path } = useRouteMatch();
  const history = useHistory();

  const {
    getValues,
    formState: { isSubmitting }
  } = useFormContext<AdviceLetterFormFields>();

  const { recommendations } = getValues();

  /** Whether recommendations have been added to the request */
  const hasRecommendations = recommendations && recommendations.length > 0;

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
          onClick={() => null}
        >
          {t('adviceLetterForm.addRecommendation')}
        </Button>

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
            disabled: isSubmitting,
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
