import React from 'react';
import { useTranslation } from 'react-i18next';
import { Route, Switch, useHistory, useRouteMatch } from 'react-router-dom';
import { Alert, Button, ButtonGroup } from '@trussworks/react-uswds';

import UswdsReactLink from 'components/LinkWrapper';
import { GetTrbAdviceLetter_trbRequest_adviceLetter_recommendations as TRBRecommendation } from 'queries/types/GetTrbAdviceLetter';

import Pager from '../RequestForm/Pager';

import RecommendationsForm from './RecommendationsForm';

export type RecommendationsProps = {
  trbRequestId: string;
  recommendations: TRBRecommendation[];
};

const Recommendations = ({
  trbRequestId,
  recommendations
}: RecommendationsProps) => {
  const { t } = useTranslation('technicalAssistance');
  const { path, url } = useRouteMatch();
  const history = useHistory();

  /** Whether recommendations have been added to the request */
  const hasRecommendations: boolean = recommendations.length > 0;

  // console.log('recommendations', recommendations);

  return (
    <Switch>
      {/* Recommendations Form */}
      <Route exact path={`${path}/form`}>
        <RecommendationsForm trbRequestId={trbRequestId} />
      </Route>

      {/* Recommendations form step */}
      <Route exact path={`${path}`}>
        {/* Add recommendation button */}
        <Button
          className="margin-top-5 margin-bottom-1"
          type="button"
          onClick={() => history.push(`${url}/form`)}
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
            <ul className="usa-list usa-list--unstyled">
              {recommendations.map(({ title, recommendation, links, id }) => {
                return (
                  <li key={id}>
                    <h4 className="margin-bottom-0">{title}</h4>
                    <p className="margin-top-05">{recommendation}</p>
                    {
                      /* Links list */
                      links && (
                        <ul className="usa-list usa-list--unstyled">
                          {links.map((link, index) => (
                            // eslint-disable-next-line react/no-array-index-key
                            <li key={`${id}.${index}`}>
                              <UswdsReactLink to={link} variant="external">
                                {link}
                              </UswdsReactLink>
                            </li>
                          ))}
                        </ul>
                      )
                    }
                    <ButtonGroup>
                      <Button type="button" unstyled>
                        {t('adviceLetterForm.editRecommendation')}
                      </Button>
                      <Button
                        type="button"
                        className="text-secondary margin-left-1"
                        unstyled
                      >
                        {t('adviceLetterForm.removeRecommendation')}
                      </Button>
                    </ButtonGroup>
                  </li>
                );
              })}
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
