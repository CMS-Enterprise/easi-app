import React, { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Route, Switch, useHistory, useRouteMatch } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button } from '@trussworks/react-uswds';

import { Alert } from 'components/shared/Alert';
import Divider from 'components/shared/Divider';
import {
  DeleteTRBGuidanceLetterInsightQuery,
  GetTrbGuidanceLetterQuery
} from 'queries/TrbGuidanceLetterQueries';
import {
  DeleteTRBGuidanceLetterInsight,
  DeleteTRBGuidanceLetterInsightVariables
} from 'queries/types/DeleteTRBGuidanceLetterInsight';
import {
  GuidanceLetterRecommendationFields,
  StepComponentProps
} from 'types/technicalAssistance';
import { guidanceRecommendationSchema } from 'validations/trbRequestSchema';

import RecommendationsList from '../AdminHome/components/RecommendationsList';
import Pager from '../RequestForm/Pager';

import RecommendationsForm from './RecommendationsForm';

const defaultValues: GuidanceLetterRecommendationFields = {
  id: undefined,
  title: '',
  recommendation: '',
  links: []
};

const Recommendations = ({
  trbRequestId,
  guidanceLetter: { insights },
  setIsStepSubmitting,
  setFormAlert,
  stepsCompleted,
  setStepsCompleted
}: StepComponentProps) => {
  const { t } = useTranslation('technicalAssistance');
  const { path, url } = useRouteMatch();
  const history = useHistory();

  /** Whether recommendations have been added to the request */
  const hasRecommendations: boolean = insights.length > 0;

  const formMethods = useForm<GuidanceLetterRecommendationFields>({
    resolver: yupResolver(guidanceRecommendationSchema),
    defaultValues
  });
  const { reset } = formMethods;

  const [remove, { loading }] = useMutation<
    DeleteTRBGuidanceLetterInsight,
    DeleteTRBGuidanceLetterInsightVariables
  >(DeleteTRBGuidanceLetterInsightQuery, {
    refetchQueries: [
      {
        query: GetTrbGuidanceLetterQuery,
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
        <FormProvider<GuidanceLetterRecommendationFields> {...formMethods}>
          <RecommendationsForm
            trbRequestId={trbRequestId}
            setFormAlert={setFormAlert}
          />
        </FormProvider>
      </Route>

      {/* Recommendations form step */}
      <Route exact path={`${path}`}>
        <div id="trbGuidanceRecommendations">
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
                ? 'guidanceLetterForm.addAdditionalGuidance'
                : 'guidanceLetterForm.addGuidance'
            )}
          </Button>

          <Divider className="margin-top-2 margin-bottom-4" />

          {
            /* No recommendations message */
            !hasRecommendations ? (
              <Alert type="info" slim>
                {t('guidanceLetterForm.noGuidance')}
              </Alert>
            ) : (
              <RecommendationsList
                recommendations={insights}
                trbRequestId={trbRequestId}
                setReorderError={error =>
                  setFormAlert(error ? { type: 'error', message: error } : null)
                }
                edit={recommendation => {
                  // Set form field values for editing
                  reset({
                    ...recommendation,
                    // Revert link strings to object for form array field
                    links: recommendation.links.map(link => ({ link }))
                  });

                  history.push(`/trb/${trbRequestId}/guidance/insights/form`);
                }}
                remove={recommendation =>
                  remove({ variables: { id: recommendation.id } })
                    .then(() => {
                      setFormAlert({
                        type: 'success',
                        message: t('guidanceLetterForm.removeSuccess')
                      });
                    })
                    .catch(() =>
                      setFormAlert({
                        type: 'error',
                        message: t('guidanceLetterForm.error', {
                          action: 'removing',
                          type: 'guidance'
                        })
                      })
                    )
                }
              />
            )
          }

          {/* Form pager buttons */}
          <Pager
            className="margin-top-4"
            back={{
              outline: true,
              onClick: () => {
                setFormAlert(null);
                history.push(`/trb/${trbRequestId}/guidance/summary`);
              }
            }}
            next={{
              disabled: !!loading,
              text: hasRecommendations
                ? t('button.next')
                : t('guidanceLetterForm.continueWithoutAdding'),
              onClick: () => {
                if (
                  setStepsCompleted &&
                  stepsCompleted &&
                  !stepsCompleted?.includes('insights')
                ) {
                  setStepsCompleted([...stepsCompleted, 'insights']);
                }
                setFormAlert(null);
                history.push(`/trb/${trbRequestId}/guidance/next-steps`);
              },
              outline: !hasRecommendations
            }}
            taskListUrl={`/trb/${trbRequestId}/guidance`}
            submit={async callback => callback?.()}
            saveExitText={t('guidanceLetterForm.returnToRequest')}
            border={false}
          />
        </div>
      </Route>
    </Switch>
  );
};

export default Recommendations;
