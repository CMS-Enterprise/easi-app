import React, { useEffect } from 'react';
import { FormProvider } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Route, Switch, useHistory, useRouteMatch } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button } from '@trussworks/react-uswds';
import {
  GetTRBGuidanceLetterDocument,
  TRBGuidanceLetterInsightCategory,
  useDeleteTRBGuidanceLetterInsightMutation
} from 'gql/gen/graphql';

import { useEasiForm } from 'components/EasiForm';
import { Alert } from 'components/shared/Alert';
import Divider from 'components/shared/Divider';
import {
  GuidanceLetterInsightFields,
  StepComponentProps
} from 'types/technicalAssistance';
import { guidanceInsightSchema } from 'validations/trbRequestSchema';

import InsightsList from '../AdminHome/components/InsightsList';
import Pager from '../RequestForm/Pager';

import InsightsForm from './InsightsForm';

/**
 * Guidance and insights step of TRB Guidance Letter form
 */
const Insights = ({
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

  /** Whether insights have been added to the request */
  const hasInsights: boolean = insights.length > 0;

  const formMethods = useEasiForm<GuidanceLetterInsightFields>({
    resolver: yupResolver(guidanceInsightSchema),
    defaultValues: {
      title: '',
      recommendation: '',
      links: []
    }
  });
  const { reset } = formMethods;

  const [remove, { loading }] = useDeleteTRBGuidanceLetterInsightMutation({
    refetchQueries: [
      {
        query: GetTRBGuidanceLetterDocument,
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
      {/* Insights Form */}
      <Route exact path={`${path}/form`}>
        <FormProvider<GuidanceLetterInsightFields> {...formMethods}>
          <InsightsForm
            trbRequestId={trbRequestId}
            setFormAlert={setFormAlert}
          />
        </FormProvider>
      </Route>

      {/* Insights form step */}
      <Route exact path={`${path}`}>
        <div id="trbGuidanceInsights">
          {/* Add insight button */}
          <Button
            className="margin-top-5 margin-bottom-1"
            type="button"
            onClick={() => {
              reset();
              history.push(`${url}/form`);
            }}
            outline={hasInsights}
          >
            {t(
              hasInsights
                ? 'guidanceLetterForm.addAdditionalGuidance'
                : 'guidanceLetterForm.addGuidance'
            )}
          </Button>

          <Divider className="margin-top-2 margin-bottom-4" />

          {
            /* No insights message */
            !hasInsights ? (
              <Alert type="info" slim>
                {t('guidanceLetterForm.noGuidance')}
              </Alert>
            ) : (
              <InsightsList
                className="margin-bottom-7"
                trbRequestId={trbRequestId}
                setReorderError={error =>
                  setFormAlert(error ? { type: 'error', message: error } : null)
                }
                edit={insight => {
                  // Set form field values for editing
                  reset(
                    {
                      ...insight,
                      category:
                        insight?.category ||
                        TRBGuidanceLetterInsightCategory.UNCATEGORIZED,
                      // Revert link strings to object for form array field
                      links: insight.links.map(link => ({ link }))
                    },
                    { keepDefaultValues: true }
                  );

                  history.push(`/trb/${trbRequestId}/guidance/insights/form`);
                }}
                remove={insight =>
                  remove({ variables: { id: insight.id } })
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
              text: hasInsights
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
              outline: !hasInsights
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

export default Insights;
