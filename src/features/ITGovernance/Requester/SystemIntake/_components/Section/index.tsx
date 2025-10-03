import React from 'react';
import classNames from 'classnames';

type SectionProps = {
  children: React.ReactNode;
  // heading must be a required prop because component returns a `section` element
  heading: string;
  className?: string;
};

/** Form section with heading text and top border - used to group related form fields */
// TODO: This could be merged into the SectionWrapper component.
// Keeping separate for now to avoid refactoring existing SectionWrapper instances.
const Section = ({ heading, children, className }: SectionProps) => {
  return (
    <section
      className={classNames('border-top-1px border-base-light', className)}
    >
      <h4 className="margin-top-1 margin-bottom-3">{heading}</h4>
      {children}
    </section>
  );
};

export default Section;
