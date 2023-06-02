import React, { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Route, Switch, useHistory, useRouteMatch } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button } from '@trussworks/react-uswds';

import { Alert } from 'components/shared/Alert';
import {
  DeleteTrbRecommendationQuery,
  GetTrbAdviceLetterQuery
} from 'queries/TrbAdviceLetterQueries';
import {
  DeleteTRBRecommendation,
  DeleteTRBRecommendationVariables
} from 'queries/types/DeleteTRBRecommendation';
import {
  AdviceLetterRecommendationFields,
  StepComponentProps
} from 'types/technicalAssistance';
import { adviceRecommendationSchema } from 'validations/trbRequestSchema';

import RecommendationsList from '../AdminHome/components/ReviewAdviceLetter/RecommendationsList';
import Pager from '../RequestForm/Pager';

import RecommendationsForm from './RecommendationsForm';

const defaultValues: AdviceLetterRecommendationFields = {
  id: undefined,
  title: '',
  recommendation: '',
  links: []
};

const Recommendations = ({
  trbRequestId,
  adviceLetter,
  setIsStepSubmitting,
  setFormAlert,
  stepsCompleted,
  setStepsCompleted
}: StepComponentProps) => {
  const { t } = useTranslation('technicalAssistance');
  const { path, url } = useRouteMatch();
  const history = useHistory();

  const { recommendations } = adviceLetter;

  /** Whether recommendations have been added to the request */
  const hasRecommendations: boolean = recommendations.length > 0;

  const formMethods = useForm<AdviceLetterRecommendationFields>({
    resolver: yupResolver(adviceRecommendationSchema),
    defaultValues
  });
  const { reset } = formMethods;

  const [remove, { loading }] = useMutation<
    DeleteTRBRecommendation,
    DeleteTRBRecommendationVariables
  >(DeleteTrbRecommendationQuery, {
    refetchQueries: [
      {
        query: GetTrbAdviceLetterQuery,
        variables: {
          id: trbRequestId
        }
      }
    ]
  });

  useEffect(() => {
    setIsStepSubmitting(loading);
  }, [setIsStepSubmitting, loading]);

  return (
    <Switch>
      {/* Recommendations Form */}
      <Route exact path={`${path}/form`}>
        <FormProvider<AdviceLetterRecommendationFields> {...formMethods}>
          <RecommendationsForm
            trbRequestId={trbRequestId}
            setFormAlert={setFormAlert}
          />
        </FormProvider>
      </Route>

      {/* Recommendations form step */}
      <Route exact path={`${path}`}>
        <div id="trbAdviceRecommendations">
          {/* Add recommendation button */}
          <Button
            className="margin-top-5 margin-bottom-1"
            type="button"
            onClick={() => {
              reset(defaultValues);
              history.push(`${url}/form`);
            }}
            outline={hasRecommendations}
          >
            {t(
              hasRecommendations
                ? 'adviceLetterForm.addAnotherRecommendation'
                : 'adviceLetterForm.addRecommendation'
            )}
          </Button>

          {
            /* No recommendations message */
            !hasRecommendations ? (
              <Alert type="info" slim>
                {t('adviceLetterForm.noRecommendations')}
              </Alert>
            ) : (
              <RecommendationsList
                type="form"
                recommendations={recommendations}
                edit={{
                  onClick: recommendation => {
                    // Set form field values for editing
                    reset({
                      ...recommendation,
                      // Revert link strings to object for form array field
                      links: recommendation.links.map(link => ({ link }))
                    });

                    history.push(
                      `/trb/${trbRequestId}/advice/recommendations/form`
                    );
                  }
                }}
                remove={{
                  onClick: recommendation =>
                    remove({ variables: { id: recommendation.id } })
                      .then(() => {
                        setFormAlert({
                          type: 'success',
                          message: t('adviceLetterForm.removeSuccess', {
                            action: 'removing',
                            type: 'recommendation'
                          })
                        });
                      })
                      .catch(() =>
                        setFormAlert({
                          type: 'error',
                          message: t('adviceLetterForm.error', {
                            action: 'removing',
                            type: 'recommendation'
                          })
                        })
                      )
                }}
              />
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
              disabled: !!loading,
              text: hasRecommendations
                ? t('button.next')
                : t('adviceLetterForm.continueWithoutAdding'),
              onClick: () => {
                if (
                  setStepsCompleted &&
                  stepsCompleted &&
                  !stepsCompleted?.includes('recommendations')
                ) {
                  setStepsCompleted([...stepsCompleted, 'recommendations']);
                }
                history.push(`/trb/${trbRequestId}/advice/next-steps`);
              },
              outline: !hasRecommendations
            }}
            taskListUrl={`/trb/${trbRequestId}/advice`}
            submit={async callback => callback?.()}
            saveExitText={t('adviceLetterForm.returnToRequest')}
            border={false}
          />
        </div>
      </Route>
    </Switch>
  );
};

export default Recommendations;
