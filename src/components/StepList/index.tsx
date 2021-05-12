import React from 'react';
import classnames from 'classnames';

import './index.scss';

type StepListProps = {
  children: React.ReactNode;
  className?: string;
} & JSX.IntrinsicElements['ol'];

export const StepList = ({ children, className, ...props }: StepListProps) => {
  const classes = classnames('easi-step-list', className);

  return (
    <ol className={classes} {...props}>
      {children}
    </ol>
  );
};

type StepHeadingProps = {
  children: React.ReactNode;
  className?: string;
  headingLevel?: 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
} & JSX.IntrinsicElements['h2'];

export const StepHeading = ({
  children,
  className,
  headingLevel,
  ...props
}: StepHeadingProps) => {
  const classes = classnames(
    'text-bold',
    'margin-top-0',
    'margin-bottom-05',
    className
  );
  const Component = headingLevel || 'h3';
  return (
    <Component className={classes} {...props}>
      {children}
    </Component>
  );
};

type StepBodyProps = {
  className?: string;
  children: React.ReactNode;
} & JSX.IntrinsicElements['div'];

export const StepBody = ({ children, className, ...props }: StepBodyProps) => {
  const classes = classnames('line-height-body-4', className);
  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
};

type StepProps = {
  className?: string;
  children: React.ReactNode;
} & JSX.IntrinsicElements['li'];

export const Step = ({ children, className, ...props }: StepProps) => {
  const classes = classnames('easi-step', className);
  return (
    <li className={classes} {...props}>
      <div className="margin-left-1 margin-bottom-3 tablet:margin-bottom-4">
        {children}
      </div>
    </li>
  );
};
