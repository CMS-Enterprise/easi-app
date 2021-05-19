import React from 'react';
import { Link } from '@trussworks/react-uswds';

type LinkCardProps = {
  children: React.ReactNode;
  className?: string;
  link: string;
  heading: React.ReactNode | string;
} & JSX.IntrinsicElements['div']; // what does this mean?

const LinkCard = ({ children, className, link, heading }: LinkCardProps) => {
  return (
    <div className={`padding-top-2 padding-left-1 ${className}`}>
      <h2>
        <Link href={link}>{heading}</Link>
      </h2>
      {children}
    </div>
  );
};

export default LinkCard;
