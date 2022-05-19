import React, { createElement } from 'react';
import { useTranslation } from 'react-i18next';
import {
  IconCheckCircleOutline,
  IconErrorOutline
} from '@trussworks/react-uswds';

export default ({ scorePct, date }: { scorePct: number; date: string }) => {
  const { t } = useTranslation('systemProfile');

  let colorClass;
  let iconComponent;
  if (scorePct === 100) {
    colorClass = 'text-success';
    iconComponent = IconCheckCircleOutline;
  } else {
    colorClass = 'text-warning-dark';
    iconComponent = IconErrorOutline;
  }

  return (
    <div>
      {createElement(iconComponent, {
        size: 3,
        className: `${colorClass} margin-right-1 text-middle`
      })}
      <span className="text-middle">
        <span className="margin-right-1 text-base">
          {t('singleSystem.section508.initialTest')} {date}
        </span>
        <span>
          {t('singleSystem.section508.score')} {scorePct}%
        </span>
      </span>
    </div>
  );
};
