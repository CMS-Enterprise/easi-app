import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation } from '@apollo/client';
import { Button, ButtonGroup, Icon } from '@trussworks/react-uswds';
import classNames from 'classnames';

import { RichTextViewer } from 'components/RichTextEditor';
import Alert from 'components/shared/Alert';
import { UpdateTrbRecommendationOrderQuery } from 'queries/TrbGuidanceLetterQueries';
import { TRBRecommendation } from 'queries/types/TRBRecommendation';
import {
  UpdateTrbRecommendationOrder,
  UpdateTrbRecommendationOrderVariables
} from 'queries/types/UpdateTrbRecommendationOrder';

import RemoveRecommendationModal from '../RemoveRecommendationModal/Index';

import RecommendationLinks from './RecommendationLinks';

type RecommendationsListProps = {
  recommendations: TRBRecommendation[];
  trbRequestId: string;
  /** Optional function to set error message if order mutation fails */
  setReorderError?: (error: string | null) => void;
  /** If false, hides edit/remove buttons and reorder controls */
  editable?: boolean;
  edit?: (recommendation: TRBRecommendation) => void;
  remove?: (recommendation: TRBRecommendation) => void;
  className?: string;
};

/**
 * Displays list of TRB guidance letter recommendations
 * with optional buttons to edit, remove, and order recommendations
 */
export default function RecommendationsList({
  recommendations,
  trbRequestId,
  setReorderError,
  editable = true,
  edit,
  remove,
  className
}: RecommendationsListProps) {
  const { t } = useTranslation('technicalAssistance');

  const [recommendationToRemove, setRecommendationToRemove] =
    useState<TRBRecommendation | null>(null);

  const [updateOrder] = useMutation<
    UpdateTrbRecommendationOrder,
    UpdateTrbRecommendationOrderVariables
  >(UpdateTrbRecommendationOrderQuery, {
    refetchQueries: ['GetTrbGuidanceLetter']
  });

  const enableReorderControls: boolean = editable && recommendations.length > 1;

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

  // Clear error on initial render
  useEffect(() => {
    setReorderError?.(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={className}>
      {remove && (
        <RemoveRecommendationModal
          modalProps={{
            isOpen: !!recommendationToRemove,
            closeModal: () => setRecommendationToRemove(null)
          }}
          handleDelete={() =>
            recommendationToRemove && remove(recommendationToRemove)
          }
        >
          <p>
            {t('guidanceLetterForm.modal.removingTitle', {
              title: recommendationToRemove?.title
            })}
          </p>
        </RemoveRecommendationModal>
      )}

      {recommendations.length > 0 && editable && (
        <Alert type="info" slim className="margin-bottom-4">
          {t('guidanceLetterForm.reorderGuidance')}
        </Alert>
      )}

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
                (edit || remove) && editable && (
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
                    {remove && (
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
}
