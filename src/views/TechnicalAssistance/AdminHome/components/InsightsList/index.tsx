import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, ButtonGroup, Icon } from '@trussworks/react-uswds';
import classNames from 'classnames';
import {
  TRBGuidanceLetterInsightFragment,
  TRBGuidanceLetterRecommendationCategory,
  useUpdateTRBGuidanceLetterInsightOrderMutation
} from 'gql/gen/graphql';

import { RichTextViewer } from 'components/RichTextEditor';
import Alert from 'components/shared/Alert';

import RemoveInsightModal from '../RemoveInsightModal/Index';

import InsightLinks from './InsightLinks';

type InsightsListProps = {
  insights: TRBGuidanceLetterInsightFragment[];
  trbRequestId: string;
  /** Optional function to set error message if order mutation fails */
  setReorderError?: (error: string | null) => void;
  /** If false, hides edit/remove buttons and reorder controls */
  editable?: boolean;
  edit?: (insight: TRBGuidanceLetterInsightFragment) => void;
  remove?: (insight: TRBGuidanceLetterInsightFragment) => void;
  className?: string;
};

/**
 * Displays list of TRB guidance letter guidance and insights
 * with optional buttons to edit, remove, and order insights
 */
export default function InsightsList({
  insights,
  trbRequestId,
  setReorderError,
  editable = true,
  edit,
  remove,
  className
}: InsightsListProps) {
  const { t } = useTranslation('technicalAssistance');

  const [insightToRemove, setInsightToRemove] =
    useState<TRBGuidanceLetterInsightFragment | null>(null);

  const [updateOrder] = useUpdateTRBGuidanceLetterInsightOrderMutation({
    refetchQueries: ['GetTrbGuidanceLetter']
  });

  const enableReorderControls: boolean = editable && insights.length > 1;

  /** Sort insights and execute updateOrder mutation */
  const sort = (id: string, newIndex: number) => {
    /** Updated sort order array */
    const newOrder: string[] = insights
      // Get just insight IDs
      .map(insight => insight.id)
      // Filter out insight ID to be sorted
      .filter(value => value !== id);

    // Insert insight ID at new index
    newOrder.splice(newIndex, 0, id);

    updateOrder({
      variables: {
        input: {
          trbRequestId,
          newOrder,
          category: TRBGuidanceLetterRecommendationCategory.RECOMMENDATION
        }
      }
    }).catch(() => setReorderError?.(t('guidanceLetterForm.reorderError')));
  };

  // Clear error on initial render
  useEffect(() => {
    setReorderError?.(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={className}>
      {remove && (
        <RemoveInsightModal
          modalProps={{
            isOpen: !!insightToRemove,
            closeModal: () => setInsightToRemove(null)
          }}
          handleDelete={() => insightToRemove && remove(insightToRemove)}
        >
          <p>
            {t('guidanceLetterForm.modal.removingTitle', {
              title: insightToRemove?.title
            })}
          </p>
        </RemoveInsightModal>
      )}

      {insights.length > 0 && editable && (
        <Alert type="info" slim className="margin-bottom-4">
          {t('guidanceLetterForm.reorderGuidance')}
        </Alert>
      )}

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
                  <h3 className="margin-top-0 margin-bottom-05">{title}</h3>

                  <RichTextViewer
                    className="margin-top-1"
                    value={description}
                  />

                  {links.length > 0 && (
                    <>
                      <p className="text-bold margin-bottom-0 margin-top-2">
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
                (edit || remove) && editable && (
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
                    {remove && (
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
}
