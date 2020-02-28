import React, { ReactNode, ReactNodeArray } from 'react';

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
  term: string;
};

export const DescriptionTerm = ({ term }: DescriptionTermProps) => (
  <dt className="text-bold margin-bottom-05">{term}</dt>
);

type DescriptionDefinitionProps = {
  definition: string;
};

export const DescriptionDefinition = ({
  definition
}: DescriptionDefinitionProps) => (
  <dd className="margin-0 font-ui-md">{definition}</dd>
);
