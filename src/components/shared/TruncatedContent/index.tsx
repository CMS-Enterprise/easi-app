import React, { useState } from 'react';
import { Button, Icon } from '@trussworks/react-uswds';
import classNames from 'classnames';

type TruncatedContentProps = {
  children: React.ReactNodeArray;
  initialCount: number;
  labelMore?: string;
  labelLess?: string;
  buttonClassName?: string;
  expanded?: boolean;
  hideToggle?: boolean;
};

export default function TruncatedContent({
  children,
  initialCount,
  labelMore = 'Show more',
  labelLess = 'Show less',
  buttonClassName,
  expanded,
  hideToggle
}: TruncatedContentProps) {
  const [isExpanded, setExpanded] = useState(expanded);
  const defaultContent = children
    .filter(child => child) // Filter out conditional children
    .flat()
    .slice(0, initialCount);
  const expandedContent = children
    .filter(child => child) // Filter out conditional children
    .flat()
    .slice(initialCount);
  const ArrowIcon = isExpanded ? Icon.ArrowDropUp : Icon.ArrowDropDown;
  return (
    <>
      {defaultContent}
      {expandedContent.length > 0 && !hideToggle && (
        <Button
          data-testid="truncatedContentButton"
          type="button"
          unstyled
          onClick={() => setExpanded(!isExpanded)}
          className={classNames(
            'truncated-content-button',
            'display-flex',
            'flex-align-center',
            buttonClassName
          )}
        >
          <ArrowIcon className="margin-x-05" />{' '}
          {isExpanded ? labelLess : labelMore}
        </Button>
      )}
      {isExpanded && expandedContent}
    </>
  );
}
