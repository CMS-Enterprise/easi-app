import React from 'react';
import { Link } from 'react-router-dom';
import {
  Breadcrumb,
  BreadcrumbBar,
  BreadcrumbLink
} from '@trussworks/react-uswds';

export interface BreadcrumbsProps {
  items: { text: string; url?: string }[];
}

/**
 * Generate a `BreadcrumbBar` from links.
 */
function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <BreadcrumbBar
      navProps={{ style: { backgroundColor: 'transparent' } }}
      className="padding-bottom-0"
    >
      {items.map((link, idx) => {
        if (idx === items.length - 1) {
          return (
            // eslint-disable-next-line react/no-array-index-key
            <Breadcrumb key={idx} current>
              <span>{link.text}</span>
            </Breadcrumb>
          );
        }
        return (
          // eslint-disable-next-line react/no-array-index-key
          <Breadcrumb key={idx}>
            <BreadcrumbLink asCustom={Link} to={link.url!}>
              <span>{link.text}</span>
            </BreadcrumbLink>
          </Breadcrumb>
        );
      })}
    </BreadcrumbBar>
  );
}

export default Breadcrumbs;
