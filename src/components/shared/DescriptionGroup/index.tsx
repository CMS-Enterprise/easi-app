import React, { ReactNode, ReactNodeArray } from 'react';
import classnames from 'classnames';

import './index.scss';

type DescriptionListProps = {
  className?: string;
  title: string;
  children: ReactNode | ReactNodeArray;
};
export const DescriptionList = ({
  title,
  children,
  className
}: DescriptionListProps) => (
  <dl className={className} title={title}>
    {children}
  </dl>
);

type DescriptionTermProps = {
  className?: string;
  term: string;
};

export const DescriptionTerm = ({ className, term }: DescriptionTermProps) => (
  <dt className={classnames('text-bold', 'margin-bottom-05', className)}>
    {term}
  </dt>
);

type DescriptionDefinitionProps = {
  className?: string;
  definition?: string | null;
};

export const DescriptionDefinition = ({
  className,
  definition
}: DescriptionDefinitionProps) => (
  <dd className={classnames('description-definition', 'margin-0', className)}>
    {definition}
  </dd>
);
