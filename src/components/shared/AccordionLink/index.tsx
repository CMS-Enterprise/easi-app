import React, { useState } from 'react';
import classnames from 'classnames';
import './index.scss';

type AccordionLinkProps = {
  children: React.ReactNode | React.ReactNodeArray;
  label: string;
};

// TODO: rename this class
const AccordionLink = ({ children, label }: AccordionLinkProps) => {
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
      {isOpen && (
        <div className="easi-accordion-link__content">
          <div className="easi-accordion-link__bar" />
          {children}
        </div>
      )}
    </div>
  );
};

export default AccordionLink;
