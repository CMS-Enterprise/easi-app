import React from 'react';
import classnames from 'classnames';

type BookmarkCardWrapperProps = {
  className?: string;
  children: React.ReactNode;
};
const BookmarkCardWrapper = ({
  className,
  children
}: BookmarkCardWrapperProps) => {
  const classNames = classnames('grid-container margin-top-1', className);
  return (
    <div className={classNames}>
      <div className="grid-row grid-gap-lg">{children}</div>
    </div>
  );
};

export default BookmarkCardWrapper;
