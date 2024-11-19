import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@trussworks/react-uswds';
import classNames from 'classnames';

type DiscussionsListProps = {
  type: 'discussions' | 'replies';
  children: React.ReactNodeArray;
  initialCount: number;
  /** className for <ul> wrapper element */
  className?: string;
};

/**
 * Truncated list wrapper component for discussion posts
 *
 * Children should be formatted as `<li><DiscussionPost /></li>`
 */
const DiscussionsList = ({
  type,
  children,
  initialCount,
  className
}: DiscussionsListProps) => {
  const { t } = useTranslation('discussions');

  const [isExpanded, setExpanded] = useState(false);

  const defaultContent = children
    .filter(child => child) // Filter out conditional children
    .flat()
    .slice(0, initialCount);

  const expandedContent = children
    .filter(child => child) // Filter out conditional children
    .flat()
    .slice(initialCount);

  return (
    <>
      <ul className={classNames('usa-list--unstyled', className)}>
        {defaultContent}

        {isExpanded && expandedContent}
      </ul>

      {expandedContent.length > 0 && (
        <Button
          type="button"
          unstyled
          onClick={() => setExpanded(!isExpanded)}
          className="margin-top-4"
        >
          {t(`general.view${isExpanded ? 'Less' : 'More'}`, { type })}
        </Button>
      )}
    </>
  );
};

export default DiscussionsList;
