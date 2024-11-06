import React from 'react';
import { Link } from 'react-router-dom';
import {
  Breadcrumb,
  BreadcrumbBar,
  BreadcrumbLink
} from '@trussworks/react-uswds';

export interface BreadcrumbsProps {
  items: {
    text: string;
    url?: string;
    onClick?: () => void;
  }[];
}

/**
 * Generate a `BreadcrumbBar` from links.
 */
function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <BreadcrumbBar
      navProps={{ style: { backgroundColor: 'transparent' } }}
      className="padding-bottom-0"
      variant="wrap"
    >
      {items.map((link, idx) => {
        if (idx === items.length - 1) {
          return (
            <Breadcrumb key={link.text} current>
              <span>{link.text}</span>
            </Breadcrumb>
          );
        }
        return (
          <Breadcrumb key={link.text}>
            <BreadcrumbLink
              asCustom={Link}
              to={link.url!}
              onClick={link.onClick}
              className="text-primary"
            >
              <span>{link.text}</span>
            </BreadcrumbLink>
          </Breadcrumb>
        );
      })}
    </BreadcrumbBar>
  );
}

export default Breadcrumbs;
