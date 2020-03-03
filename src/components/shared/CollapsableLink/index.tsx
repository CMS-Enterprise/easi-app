import React, { useState } from 'react';
import classnames from 'classnames';
import './index.scss';

type CollapsableLinkProps = {
  children: React.ReactNode | React.ReactNodeArray;
  label: string;
};

const CollapsableLink = ({ children, label }: CollapsableLinkProps) => {
  // TODO: should this state instead be held in the parent and passed in as prop?
  // Followup: if the state should remain here, how do we test the component when it's open?
  // That is, how do we initialize this component and set isOpen to true?
  const [isOpen, setOpen] = useState(false);
  const arrowClassNames = classnames(
    'fa',
    'easi-accordion-link__square',
    isOpen ? 'fa-caret-down' : 'fa-caret-right'
  );
  return (
    <div>
      <button
        type="button"
        className="easi-accordion-link__button"
        onClick={() => setOpen(!isOpen)}
      >
        <span className={arrowClassNames} />
        {label}
      </button>
      {isOpen && <div className="easi-accordion-link__content">{children}</div>}
    </div>
  );
};

export default CollapsableLink;
