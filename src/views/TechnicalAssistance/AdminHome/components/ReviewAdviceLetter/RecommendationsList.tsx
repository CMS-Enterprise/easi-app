import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button, ButtonGroup } from '@trussworks/react-uswds';
import classNames from 'classnames';

import { GetTrbAdviceLetter_trbRequest_adviceLetter_recommendations as TRBRecommendation } from 'queries/types/GetTrbAdviceLetter';

import RecommendationLinks from './RecommendationLinks';

type RecommendationsListProps = {
  type: 'form' | 'admin';
  recommendations: TRBRecommendation[];
  edit?: {
    onClick: (recommendation: TRBRecommendation) => void;
    text?: string;
  };
  remove?: {
    onClick: (recommendation: TRBRecommendation) => void;
    text?: string;
  };
  className?: string;
};

type CardTitleProps = {
  type: RecommendationsListProps['type'];
  children: React.ReactNode;
  className?: string;
};

const CardTitle = ({ type, children, className }: CardTitleProps) => {
  if (type === 'admin') {
    return <h3 className={className}>{children}</h3>;
  }
  return <h4 className={className}>{children}</h4>;
};

export default function RecommendationsList({
  type,
  recommendations,
  edit,
  remove,
  className
}: RecommendationsListProps) {
  const { t } = useTranslation('technicalAssistance');
  return (
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
            <CardTitle type={type} className="margin-bottom-1">
              {title}
            </CardTitle>

            <p className="margin-y-1">{description}</p>

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
                      onClick={() => remove.onClick(recommendation)}
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
  );
}
