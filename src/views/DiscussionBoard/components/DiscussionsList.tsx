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

  /** Discussions type list has bottom border when toggle button is shown */
  const hasBorder = type === 'discussions' && children.length > initialCount;

  return (
    <>
      <ul
        data-testid="discussionsList"
        className={classNames('usa-list--unstyled', className, {
          'border-bottom-1px border-base-light': hasBorder
        })}
      >
        {defaultContent}

        {isExpanded && expandedContent}
      </ul>

      {expandedContent.length > 0 && (
        <Button
          type="button"
          unstyled
          onClick={() => setExpanded(!isExpanded)}
          className={classNames('margin-top-4', {
            'margin-bottom-3 width-full text-center': type === 'discussions'
          })}
        >
          {t(`general.view${isExpanded ? 'Less' : 'More'}`, { type })}
        </Button>
      )}
    </>
  );
};

export default DiscussionsList;
