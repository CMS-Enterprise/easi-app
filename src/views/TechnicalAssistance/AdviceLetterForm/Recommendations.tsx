import React, { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Route, Switch, useHistory, useRouteMatch } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, ButtonGroup } from '@trussworks/react-uswds';

import UswdsReactLink from 'components/LinkWrapper';
import { Alert } from 'components/shared/Alert';
import {
  DeleteTrbRecommendationQuery,
  GetTrbAdviceLetterQuery
} from 'queries/TrbAdviceLetterQueries';
import {
  DeleteTRBRecommendation,
  DeleteTRBRecommendationVariables
} from 'queries/types/DeleteTRBRecommendation';
import { GetTrbAdviceLetter_trbRequest_adviceLetter_recommendations as TRBRecommendation } from 'queries/types/GetTrbAdviceLetter';
import {
  AdviceLetterRecommendationFields,
  StepComponentProps
} from 'types/technicalAssistance';
import { adviceRecommendationSchema } from 'validations/trbRequestSchema';

import Pager from '../RequestForm/Pager';

import RecommendationsForm from './RecommendationsForm';

export type RecommendationsProps = {
  trbRequestId: string;
  recommendations: TRBRecommendation[];
};

const Recommendations = ({
  trbRequestId,
  adviceLetter,
  setIsStepSubmitting,
  setFormAlert
}: StepComponentProps) => {
  const { t } = useTranslation('technicalAssistance');
  const { path, url } = useRouteMatch();
  const history = useHistory();

  const { recommendations } = adviceLetter;

  /** Whether recommendations have been added to the request */
  const hasRecommendations: boolean = recommendations.length > 0;

  const formMethods = useForm<AdviceLetterRecommendationFields>({
    resolver: yupResolver(adviceRecommendationSchema),
    defaultValues: {
      title: '',
      recommendation: '',
      links: []
    }
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
        <FormProvider {...formMethods}>
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
            onClick={() => history.push(`${url}/form`)}
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
              /* Recommendations list */
              <ul className="usa-list usa-list--unstyled margin-bottom-2 grid-row grid-gap-md">
                {recommendations.map(values => {
                  const { title, recommendation, id, links } = values;

                  return (
                    <li key={id} className="desktop:grid-col-6">
                      <h4 className="margin-bottom-0">{title}</h4>
                      <p className="margin-top-05 margin-bottom-0">
                        {recommendation}
                      </p>
                      {
                        /* Links list */
                        links && (
                          <ul className="usa-list usa-list--unstyled">
                            {links.map((link, index) => (
                              // TODO: Link formatting - remove http and fix href prop
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
                      {/* TODO: Fix ButtonGroup margins - last item has margin-bottom-0 when nested within .usa-list */}
                      <ButtonGroup>
                        {/* Edit */}
                        <Button
                          type="button"
                          onClick={e => {
                            // Set form field values for editing
                            reset({
                              ...values,
                              // Revert link strings to object for form array field
                              links: links.map(link => ({ link }))
                            });

                            history.push(
                              `/trb/${trbRequestId}/advice/recommendations/form`
                            );
                          }}
                          unstyled
                        >
                          {t('adviceLetterForm.editRecommendation')}
                        </Button>
                        {/* Remove */}
                        <Button
                          type="button"
                          className="text-secondary margin-left-1"
                          onClick={() => remove({ variables: { id } })}
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
              disabled: !!loading,
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
        </div>
      </Route>
    </Switch>
  );
};

export default Recommendations;
