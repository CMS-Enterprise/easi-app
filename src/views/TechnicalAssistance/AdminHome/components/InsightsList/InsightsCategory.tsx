import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button, ButtonGroup, Icon } from '@trussworks/react-uswds';
import classNames from 'classnames';
import {
  TRBGuidanceLetterInsightFragment,
  TRBGuidanceLetterRecommendationCategory,
  useUpdateTRBGuidanceLetterInsightOrderMutation
} from 'gql/gen/graphql';
import { toLower } from 'lodash';

import { RichTextViewer } from 'components/RichTextEditor';

import InsightLinks from './InsightLinks';

type InsightsCategoryProps = {
  trbRequestId: string;
  insights: TRBGuidanceLetterInsightFragment[];
  editable?: boolean;
  edit?: (insight: TRBGuidanceLetterInsightFragment) => void;
  setInsightToRemove?: (
    insight: TRBGuidanceLetterInsightFragment | null
  ) => void;
  /** Optional function to set error message if order mutation fails */
  setReorderError?: (error: string | null) => void;
};

const InsightsCategory = ({
  trbRequestId,
  insights,
  editable,
  edit,
  setInsightToRemove,
  setReorderError
}: InsightsCategoryProps) => {
  const { t } = useTranslation('technicalAssistance');

  const [updateOrder] = useUpdateTRBGuidanceLetterInsightOrderMutation({
    refetchQueries: ['GetTrbGuidanceLetter']
  });

  // TODO: Fix hard coded category
  const category =
    insights[0].category ||
    TRBGuidanceLetterRecommendationCategory.RECOMMENDATION;

  const categoryString = toLower(category);

  const enableReorderControls: boolean = !!editable && insights.length > 1;

  /** Sort insights and execute updateOrder mutation */
  const sort = (id: string, newIndex: number) => {
    /** Updated sort order array */
    const newOrder: string[] = insights
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
          category,
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
        {insights.map((insight, index) => {
          const { title, id, links, recommendation: description } = insight;
          return (
            <li
              data-testid="insights_list-item"
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
                {/* Insight content */}
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
                      <InsightLinks
                        links={links}
                        className="margin-bottom-05"
                      />
                    </>
                  )}
                </div>
              </div>
              {
                /* Action buttons if `editable` is true and edit or remove onClick props are provided */
                (edit || !!setInsightToRemove) && editable && (
                  <ButtonGroup>
                    {edit && (
                      <Button
                        type="button"
                        onClick={() => edit(insight)}
                        unstyled
                      >
                        {t('guidanceLetterForm.editGuidance')}
                      </Button>
                    )}
                    {setInsightToRemove && (
                      <Button
                        type="button"
                        className="text-secondary margin-left-1"
                        onClick={() => setInsightToRemove(insight)}
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

export default InsightsCategory;
