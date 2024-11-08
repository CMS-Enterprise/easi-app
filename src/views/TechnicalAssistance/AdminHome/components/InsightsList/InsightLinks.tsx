import React from 'react';
import { Link } from '@trussworks/react-uswds';
import classNames from 'classnames';

import formatUrl from 'utils/formatUrl';

type InsightLinksProps = {
  links: string[];
  className?: string;
};

export default function InsightLinks({ links, className }: InsightLinksProps) {
  return (
    <ul className={classNames('usa-list', 'usa-list--unstyled', className)}>
      {links.map((link, index) => {
        const linkString = formatUrl(link);

        const url = new URL(`https://${linkString}`);

        const isExternal: boolean = url.host !== 'easi.cms.gov';

        return (
          <li
            key={`link-${index}`} // eslint-disable-line react/no-array-index-key
          >
            <Link
              aria-label={`Open ${link} in a new tab`}
              target="_blank"
              rel="noopener noreferrer"
              // If EASi url, link to relative path
              href={isExternal ? url.href : url.pathname}
              // Display external link icon if not EASi url
              {...(isExternal && { variant: 'external' })}
            >
              {linkString}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
