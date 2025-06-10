import React, { useState } from 'react';
import { Button, Icon } from '@trussworks/react-uswds';
import classnames from 'classnames';

import './index.scss';

type CollapsableLinkProps = {
  id: string;
  className?: string;
  children: React.ReactNode | React.ReactNodeArray;
  label: string;
  closeLabel?: string;
  styleLeftBar?: boolean;
  eyeIcon?: boolean;
  startOpen?: boolean;
  labelPosition?: 'top' | 'bottom';
  bold?: boolean;
};

const CollapsableLink = ({
  id,
  className,
  children,
  label,
  closeLabel,
  styleLeftBar = true,
  eyeIcon,
  startOpen = false,
  labelPosition = 'top',
  bold = true
}: CollapsableLinkProps) => {
  // TODO: should this state instead be held in the parent and passed in as prop?
  // Followup: if the state should remain here, how do we test the component when it's open?
  // That is, how do we initialize this component and set isOpen to true?
  const [isOpen, setOpen] = useState(startOpen);

  const renderEyeIcon = () => {
    return isOpen ? (
      <Icon.VisibilityOff
        className="easi-collapsable-link__eye-icon"
        aria-label="visibility-off"
      />
    ) : (
      <Icon.Visibility
        className="easi-collapsable-link__eye-icon"
        aria-label="visibility-on"
      />
    );
  };

  const renderCaret = () => {
    return isOpen ? (
      <Icon.ExpandMore aria-label="expand" className="margin-right-05" />
    ) : (
      <Icon.NavigateNext className="margin-right-05" aria-label="next" />
    );
  };

  const collapseButton: React.ReactNode = (
    <Button
      type="button"
      onClick={() => setOpen(!isOpen)}
      aria-expanded={isOpen}
      aria-controls={id}
      className={classnames(
        'display-flex flex-align-center',
        { 'text-bold': isOpen && bold },
        className
      )}
      unstyled
      data-testid="collapsable-link"
    >
      {eyeIcon ? renderEyeIcon() : renderCaret()}
      {isOpen ? closeLabel || label : label}
    </Button>
  );
  return (
    <div className="easi-collapsable-link">
      {labelPosition === 'top' && collapseButton}
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
      {labelPosition === 'bottom' && collapseButton}
    </div>
  );
};

export default CollapsableLink;
