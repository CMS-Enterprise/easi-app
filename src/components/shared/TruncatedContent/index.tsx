import React, { useState } from 'react';
import {
  Button,
  IconArrowDropDown,
  IconArrowDropUp
} from '@trussworks/react-uswds';
import classNames from 'classnames';

type TruncatedContentProps = {
  children: React.ReactNodeArray;
  initialCount: number;
  labelMore?: string;
  labelLess?: string;
  buttonClassName?: string;
};

export default function TruncatedContent({
  children,
  initialCount,
  labelMore = 'Show more',
  labelLess = 'Show less',
  buttonClassName
}: TruncatedContentProps) {
  const [expanded, setExpanded] = useState(false);
  const defaultContent = children.flat().slice(0, initialCount);
  const expandedContent = children.flat().slice(initialCount);
  const Icon = expanded ? IconArrowDropUp : IconArrowDropDown;
  return (
    <>
      {defaultContent}
      {expandedContent.length > 0 && (
        <Button
          data-testid="truncatedContentButton"
          type="button"
          unstyled
          onClick={() => setExpanded(!expanded)}
          className={classNames(
            'truncated-content-button',
            'display-flex',
            'flex-align-center',
            buttonClassName
          )}
        >
          <Icon className="margin-x-05" /> {expanded ? labelLess : labelMore}
        </Button>
      )}
      {expanded && expandedContent}
    </>
  );
}
