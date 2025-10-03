import React, { useMemo, useState } from 'react';
import { Button, Icon } from '@trussworks/react-uswds';
import classNames from 'classnames';

type TruncatedContentProps = {
  children: React.ReactNode[];
  initialCount: number;
  labelMore?: string | ((itemCount: number) => string);
  labelLess?: string | ((itemCount: number) => string);
  buttonClassName?: string;
  expanded?: boolean;
  hideToggle?: boolean;
};

export default function TruncatedContent({
  children = [],
  initialCount,
  labelMore = 'Show more',
  labelLess = 'Show less',
  buttonClassName,
  expanded,
  hideToggle
}: TruncatedContentProps) {
  const [isExpanded, setExpanded] = useState(expanded);

  /** Normalizes children to flat array of visible elements */
  const visibleChildren = useMemo(
    () => children.filter(child => Boolean(child)).flat(),
    [children]
  );

  const defaultContent = useMemo(
    () => visibleChildren.slice(0, initialCount),
    [visibleChildren, initialCount]
  );

  const expandedContent = useMemo(
    () => visibleChildren.slice(initialCount),
    [visibleChildren, initialCount]
  );

  const expandedCount = expandedContent.length;

  /**
   * Get toggle label based on expanded state
   *
   * Passes the count of expanded content to the label if prop is a function
   */
  const toggleLabel = useMemo(() => {
    const labelProp = isExpanded ? labelLess : labelMore;

    if (typeof labelProp === 'function') {
      return labelProp(expandedCount);
    }

    return labelProp;
  }, [isExpanded, labelLess, labelMore, expandedCount]);

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
          <ArrowIcon className="margin-x-05" aria-hidden />
          {toggleLabel}
        </Button>
      )}
      {isExpanded && expandedContent}
    </>
  );
}
