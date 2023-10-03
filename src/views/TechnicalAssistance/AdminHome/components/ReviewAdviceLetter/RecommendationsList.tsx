import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, ButtonGroup } from '@trussworks/react-uswds';
import classNames from 'classnames';

import { RichTextViewer } from 'components/RichTextEditor';
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
  type: 'form' | 'admin';
  recommendations: TRBRecommendation[];
  edit?: EditRecommendationProp;
  remove?: RemoveRecommendationProp;
  className?: string;
};

export default function RecommendationsList({
  type,
  recommendations,
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
      <ul
        className={classNames(
          'usa-list usa-list--unstyled',
          { 'grid-row grid-gap-lg': type === 'form' },
          className
        )}
      >
        {recommendations.map(recommendation => {
          const {
            title,
            id,
            links,
            recommendation: description
          } = recommendation;

          return (
            <li
              key={id}
              className={classNames({
                'desktop:grid-col-6': type === 'form',
                'bg-base-lightest padding-x-4 padding-y-1 padding-bottom-4 margin-bottom-3':
                  type === 'admin'
              })}
            >
              {type === 'admin' ? (
                <h3 className="margin-bottom-1">{title}</h3>
              ) : (
                <h4 className="margin-bottom-1">{title}</h4>
              )}

              {/* <p className="margin-y-1">{description}</p> */}
              <RichTextViewer className="margin-y-1" value={description} />

              {links.length > 0 && (
                <>
                  {type === 'admin' && (
                    <p className="text-bold margin-bottom-0 margin-top-3">
                      {t('adviceLetter.resources')}
                    </p>
                  )}
                  <RecommendationLinks links={links} />
                </>
              )}

              {
                // Show action buttons if edit or remove onClick props are provided
                (edit || remove) && (
                  <ButtonGroup className="margin-top-2">
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
