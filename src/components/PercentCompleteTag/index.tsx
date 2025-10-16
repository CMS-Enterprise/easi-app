import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Tag } from '@trussworks/react-uswds';
import classNames from 'classnames';

type PercentCompleteTagProps = {
  percentComplete: number;
  /**
   * i18next translation key for translating tag text - default is `general:percentComplete`.
   *
   * Translation should accept a single `percent` parameter.
   */
  translationKey?: string;
  className?: string;
};

const PercentCompleteTag = ({
  percentComplete,
  translationKey = 'general:percentComplete',
  className
}: PercentCompleteTagProps) => {
  const { t } = useTranslation();

  // Convert `percentComplete` to an integer between 0 and 100
  const percent: number = Math.min(
    100,
    Math.max(0, Math.round(percentComplete))
  );

  const tagColorClassName = useMemo(() => {
    if (percent >= 0 && percent <= 20) {
      return 'bg-error-dark';
    }

    if (percent >= 21 && percent <= 80) {
      return 'bg-warning text-base-darkest';
    }

    return 'bg-success-dark';
  }, [percent]);

  return (
    <Tag
      data-testid="percent-complete-tag"
      className={classNames(
        'line-height-body-3 padding-y-05 padding-x-105 display-inline-block text-no-uppercase font-body-sm text-bold easi-percent-complete-tag',
        tagColorClassName,
        className
      )}
    >
      {t(translationKey, { percent })}
    </Tag>
  );
};

export default PercentCompleteTag;
