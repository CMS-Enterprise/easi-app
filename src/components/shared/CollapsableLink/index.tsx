import React, { useState } from 'react';
import { Button } from '@trussworks/react-uswds';
import classnames from 'classnames';

import './index.scss';

type CollapsableLinkProps = {
  id: string;
  children: React.ReactNode | React.ReactNodeArray;
  label: string;
  closeLabel?: string;
  styleLeftBar?: boolean;
};

const CollapsableLink = ({
  id,
  children,
  label,
  closeLabel,
  styleLeftBar = true
}: CollapsableLinkProps) => {
  // TODO: should this state instead be held in the parent and passed in as prop?
  // Followup: if the state should remain here, how do we test the component when it's open?
  // That is, how do we initialize this component and set isOpen to true?
  const [isOpen, setOpen] = useState(false);
  const arrowClassNames = classnames(
    'fa',
    'easi-collapsable-link__square',
    isOpen ? 'fa-caret-down' : 'fa-caret-right'
  );
  return (
    <div className="easi-collapsable-link">
      <Button
        type="button"
        onClick={() => setOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-controls={id}
        className={classnames({ 'text-bold': isOpen })}
        unstyled
        data-testid="collapsable-link"
      >
        <span className={arrowClassNames} />
        {isOpen ? closeLabel || label : label}
      </Button>
      {isOpen && (
        <div
          id={id}
          className={
            styleLeftBar
              ? 'easi-collapsable-link__content'
              : 'easi-collapsable-link__content-no-bar'
          }
        >
          {children}
        </div>
      )}
    </div>
  );
};

export default CollapsableLink;
