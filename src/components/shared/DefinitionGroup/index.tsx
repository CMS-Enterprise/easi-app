import React, { ReactNode, ReactNodeArray } from 'react';

// type DefinitionGroupProps = {
//   term: string;
//   description: string;
// };

// const DefinitionGroup = ({ term, description }: DefinitionGroupProps) => (
//   <>
//     <dt className="text-bold margin-bottom-05">{term}</dt>
//     <dd className="margin-0 font-ui-md">{description}</dd>
//   </>
// );

type DefinitionListProps = {
  title: string;
  children: ReactNode | ReactNodeArray;
};
export const DefinitionList = ({ title, children }: DefinitionListProps) => (
  <dl title={title}>{children}</dl>
);

type DefinitionTermProps = {
  term: string;
};

export const DefinitionTerm = ({ term }: DefinitionTermProps) => (
  <dt className="text-bold margin-bottom-05">{term}</dt>
);

type DefinitionDescriptionProps = {
  description: string;
};

export const DefinitionDescription = ({
  description
}: DefinitionDescriptionProps) => (
  <dd className="margin-0 font-ui-md">{description}</dd>
);
