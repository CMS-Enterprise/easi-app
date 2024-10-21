import React from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation } from '@apollo/client';
import { Button, ButtonGroup, Icon } from '@trussworks/react-uswds';
import classNames from 'classnames';
import { toLower } from 'lodash';

import { RichTextViewer } from 'components/RichTextEditor';
import { UpdateTrbRecommendationOrderQuery } from 'queries/TrbGuidanceLetterQueries';
import {
  UpdateTrbRecommendationOrder,
  UpdateTrbRecommendationOrderVariables
} from 'queries/types/UpdateTrbRecommendationOrder';
import { MockTRBRecommendation } from 'views/TechnicalAssistance/GuidanceLetterForm/mockTRBRecommendations';

import RecommendationLinks from './RecommendationLinks';

type RecommendationsCategoryProps = {
  trbRequestId: string;
  recommendations: MockTRBRecommendation[];
  editable?: boolean;
  edit?: (recommendation: MockTRBRecommendation) => void;
  setRecommendationToRemove?: (
    recommendation: MockTRBRecommendation | null
  ) => void;
  /** Optional function to set error message if order mutation fails */
  setReorderError?: (error: string | null) => void;
};

const RecommendationsCategory = ({
  trbRequestId,
  recommendations,
  editable,
  edit,
  setRecommendationToRemove,
  setReorderError
}: RecommendationsCategoryProps) => {
  const { t } = useTranslation('technicalAssistance');

  const [updateOrder] = useMutation<
    UpdateTrbRecommendationOrder,
    UpdateTrbRecommendationOrderVariables
  >(UpdateTrbRecommendationOrderQuery, {
    refetchQueries: ['GetTrbGuidanceLetter']
  });

  const categoryString = toLower(recommendations[0].category);

  const enableReorderControls: boolean =
    !!editable && recommendations.length > 1;

  /** Sort recommendations and execute updateOrder mutation */
  const sort = (id: string, newIndex: number) => {
    /** Updated sort order array */
    const newOrder: string[] = recommendations
      // Get just rec IDs
      .map(rec => rec.id)
      // Filter out rec ID to be sorted
      .filter(value => value !== id);

    // Insert rec ID at new index
    newOrder.splice(newIndex, 0, id);

    updateOrder({
      variables: {
        input: {
          trbRequestId,
          newOrder
        }
      }
    }).catch(() => setReorderError?.(t('guidanceLetterForm.reorderError')));
  };

  return (
    <div>
      <h3 className="margin-bottom-05">
        {t(`guidanceLetterForm.${categoryString}`)}
      </h3>
      <p className="margin-top-05 margin-bottom-4 line-height-body-5">
        {t(`guidanceLetterForm.${categoryString}Description`)}
      </p>

      <ul className="usa-list usa-list--unstyled">
        {recommendations.map((recommendation, index) => {
          const {
            title,
            id,
            links,
            recommendation: description
          } = recommendation;
          return (
            <li
              data-testid="recommendations_list-item"
              key={id}
              className="margin-bottom-3"
            >
              <div
                className={classNames(
                  'bg-base-lightest padding-top-2 padding-bottom-105 padding-left-105 padding-right-3 display-flex',
                  { 'padding-x-5': !enableReorderControls }
                )}
              >
                {
                  /* Reorder control buttons */
                  enableReorderControls && (
                    <div
                      data-testid="reorder-controls"
                      className="margin-right-2 display-flex flex-column flex-align-center line-height-body-1"
                    >
                      <Button
                        type="button"
                        onClick={() => sort(id, index - 1)}
                        className="height-3"
                        aria-label={t(
                          'guidanceLetterForm.increaseOrderAriaLabel'
                        )}
                        unstyled
                      >
                        <Icon.ArrowDropUp size={3} className="text-primary" />
                      </Button>
                      <span data-testid="order-index">{index + 1}</span>
                      <Button
                        type="button"
                        onClick={() => sort(id, index + 1)}
                        className="height-3"
                        aria-label={t(
                          'guidanceLetterForm.decreaseOrderAriaLabel'
                        )}
                        unstyled
                      >
                        <Icon.ArrowDropDown size={3} className="text-primary" />
                      </Button>
                    </div>
                  )
                }
                {/* Recommendation content */}
                <div
                  className={classNames(
                    'width-full padding-bottom-2',
                    enableReorderControls ? 'padding-top-105' : 'padding-top-1'
                  )}
                >
                  <h4 className="margin-top-0 margin-bottom-2">{title}</h4>

                  <RichTextViewer
                    className="margin-top-1 font-body-md text-light line-height-body-4"
                    value={description}
                  />

                  {links.length > 0 && (
                    <>
                      <p className="margin-bottom-0 margin-top-2 font-body-xs">
                        {t('guidanceLetter.resources')}
                      </p>
                      <RecommendationLinks
                        links={links}
                        className="margin-bottom-05"
                      />
                    </>
                  )}
                </div>
              </div>
              {
                /* Action buttons if `editable` is true and edit or remove onClick props are provided */
                (edit || !!setRecommendationToRemove) && editable && (
                  <ButtonGroup>
                    {edit && (
                      <Button
                        type="button"
                        onClick={() => edit(recommendation)}
                        unstyled
                      >
                        {t('guidanceLetterForm.editGuidance')}
                      </Button>
                    )}
                    {setRecommendationToRemove && (
                      <Button
                        type="button"
                        className="text-secondary margin-left-1"
                        onClick={() =>
                          setRecommendationToRemove(recommendation)
                        }
                        unstyled
                      >
                        {t('guidanceLetterForm.removeGuidance')}
                      </Button>
                    )}
                  </ButtonGroup>
                )
              }
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default RecommendationsCategory;
