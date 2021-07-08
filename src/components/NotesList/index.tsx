import React from 'react';
import classnames from 'classnames';

import './index.scss';

type NoteListItemProps = {
  children: React.ReactNode;
  isLinked?: boolean;
} & JSX.IntrinsicElements['li'];

type NoteContentProps = {
  children: React.ReactNode;
  className?: string;
} & JSX.IntrinsicElements['p'];

type NoteBylineProps = {
  children: React.ReactNode;
  className?: string;
} & JSX.IntrinsicElements['span'];

type NoteListProps = {
  children: React.ReactNode;
  className?: string;
  listType?: 'ul' | 'ol';
} & JSX.IntrinsicElements['ol'];

export const NoteContent = ({
  children,
  className,
  ...props
}: NoteContentProps) => {
  const classes = classnames(
    'margin-top-0',
    'margin-bottom-1',
    'text-pre-wrap',
    className
  );

  return <p className={classes}>{children}</p>;
};

export const NoteByline = ({
  children,
  className,
  ...props
}: NoteBylineProps) => {
  const classes = classnames('text-base-dark', 'font-body-2xs', className);
  return (
    <span className={classes} {...props}>
      {children}
    </span>
  );
};

export const NoteListItem = ({
  children,
  isLinked,
  ...props
}: NoteListItemProps) => {
  const classes = classnames('easi-notes__note-item', {
    'easi-notes__note-item--linked': isLinked
  });

  return (
    <li className={classes} {...props}>
      <div className="easi-notes__note-body">{children}</div>
    </li>
  );
};

export const NotesList = ({
  children,
  className,
  listType,
  ...props
}: NoteListProps) => {
  const classes = classnames('easi-notes__list', className);
  const Component = listType || 'ol';

  return (
    <Component className={classes} {...props}>
      {children}
    </Component>
  );
};
