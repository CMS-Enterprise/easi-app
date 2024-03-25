import React from 'react';
import {
  Card,
  CardBody,
  CardHeader,
  IconArrowForward,
  Link
} from '@trussworks/react-uswds';
import classNames from 'classnames';

import UswdsReactLink from 'components/LinkWrapper';

import './index.scss';

type SystemHelpCardProps = {
  className?: string;
  header: string;
  linkText: string;
  link: string;
  external?: boolean;
};

const SystemHelpCard = ({
  className,
  header,
  link,
  linkText,
  external
}: SystemHelpCardProps) => {
  return (
    <Card
      className={classNames(
        className,
        'radius-sm width-full system-help-links__link'
      )}
    >
      <CardHeader className="text-bold padding-y-0 flex-2 line-height-serif-2 margin-bottom-2">
        {header}
      </CardHeader>

      <CardBody className="padding-y-0 flex-1 system-help-links__fill-card-space">
        {external ? (
          <Link
            href={link}
            aria-label={header}
            variant="external"
            target="_blank"
            rel="noopener noreferrer"
          >
            {linkText}
          </Link>
        ) : (
          <UswdsReactLink
            className="display-flex flex-align-center"
            to={link}
            aria-label={header}
          >
            {linkText}
            <IconArrowForward className="margin-left-1" />
          </UswdsReactLink>
        )}
      </CardBody>
    </Card>
  );
};

export default SystemHelpCard;
