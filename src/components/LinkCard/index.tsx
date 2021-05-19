import React from 'react';

type LinkCardProps = {
  children: React.ReactNode;
  className?: string;
  link: string;
  heading: React.ReactNode | string;
};

const LinkCard = ({ children, className, link, heading }: LinkCardProps) => {
  return (
    <div className={className}>
      <h2>{heading}</h2>
      {children}
    </div>
  );
};

export default LinkCard;
