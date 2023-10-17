import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Button,
  ButtonGroup,
  IconArrowDropDown,
  IconArrowDropUp
} from '@trussworks/react-uswds';
import classNames from 'classnames';

import Alert from 'components/shared/Alert';
import { GetTrbAdviceLetter_trbRequest_adviceLetter_recommendations as TRBRecommendation } from 'queries/types/GetTrbAdviceLetter';

import RemoveRecommendationModal from '../RemoveRecommendationModal/Index';

import RecommendationLinks from './RecommendationLinks';

export type EditRecommendationProp = {
  onClick: (recommendation: TRBRecommendation) => void;
  text?: string;
};

export type RemoveRecommendationProp = {
  onClick: (recommendation: TRBRecommendation) => void;
  text?: string;
};

type RecommendationsListProps = {
  recommendations: TRBRecommendation[];
  editable?: boolean;
  edit?: EditRecommendationProp;
  remove?: RemoveRecommendationProp;
  className?: string;
};

export default function RecommendationsList({
  recommendations,
  editable = true,
  edit,
  remove,
  className
}: RecommendationsListProps) {
  const { t } = useTranslation('technicalAssistance');

  const [
    recommendationToRemove,
    setRecommendationToRemove
  ] = useState<TRBRecommendation | null>(null);

  return (
    <>
      {remove && (
        <RemoveRecommendationModal
          modalProps={{
            isOpen: !!recommendationToRemove,
            closeModal: () => setRecommendationToRemove(null)
          }}
          handleDelete={() =>
            recommendationToRemove && remove.onClick(recommendationToRemove)
          }
        >
          <p>
            {t('adviceLetterForm.modal.removingTitle', {
              title: recommendationToRemove?.title
            })}
          </p>
        </RemoveRecommendationModal>
      )}

      {recommendations.length > 0 && editable && (
        <Alert type="info" slim className="margin-bottom-4">
          {t('adviceLetterForm.reorderRecommendations')}
        </Alert>
      )}

      <ul className={classNames('usa-list usa-list--unstyled', className)}>
        {recommendations.map(recommendation => {
          const {
            title,
            id,
            links,
            recommendation: description
          } = recommendation;

          return (
            <li key={id} className="margin-bottom-3">
              <div className="bg-base-lightest padding-4 padding-top-1 display-flex">
                <div className="margin-right-2 display-flex flex-column flex-align-center line-height-body-1">
                  {/* TODO: reorder button accessibility */}
                  <Button
                    type="button"
                    onClick={() => null}
                    className="height-3"
                    unstyled
                  >
                    <IconArrowDropUp size={3} className="text-primary" />
                  </Button>
                  <span>1</span>
                  {/* TODO: reorder button accessibility */}
                  <Button
                    type="button"
                    onClick={() => null}
                    className="height-3"
                    unstyled
                  >
                    <IconArrowDropDown size={3} className="text-primary" />
                  </Button>
                </div>
                <div className="width-full">
                  <h3 className="margin-top-0 margin-bottom-05">{title}</h3>

                  <p className="margin-top-05 margin-bottom-0 font-body-md line-height-body-4">
                    {description}
                  </p>

                  {links.length > 0 && (
                    <>
                      <p className="text-bold margin-bottom-0 margin-top-2">
                        {t('adviceLetter.resources')}
                      </p>
                      <RecommendationLinks links={links} />
                    </>
                  )}
                </div>
              </div>

              {
                // Show action buttons if edit or remove onClick props are provided
                (edit || remove) && editable && (
                  <ButtonGroup>
                    {edit && (
                      <Button
                        type="button"
                        onClick={() => edit.onClick(recommendation)}
                        unstyled
                      >
                        {t(edit.text || 'adviceLetterForm.editRecommendation')}
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
                        {t(
                          remove.text || 'adviceLetterForm.removeRecommendation'
                        )}
                      </Button>
                    )}
                  </ButtonGroup>
                )
              }
            </li>
          );
        })}
      </ul>
    </>
  );
}
