import React from 'react';
import classnames from 'classnames';

type ActionLinkProps = {
  label: string;
  href: string;
  target?: string;
};

const ActionLink = ({
  label,
  href,
  target,
  className
}: ActionLinkProps & React.HTMLAttributes<HTMLDivElement>) => {
  const classes = classnames('action-link', className);
  if (target) {
    return (
      <div className={classes}>
        {target && (
          <a href={href} target={target}>
            {label}
          </a>
        )}
      </div>
    );
  }

  return (
    <div className={classes}>
      <a href={href}>{label}</a>
    </div>
  );
};

export default ActionLink;
