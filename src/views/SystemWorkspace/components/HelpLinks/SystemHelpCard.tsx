import React from 'react';
import {
  Card,
  CardBody,
  CardHeader,
  Icon,
  Link
} from '@trussworks/react-uswds';
import classNames from 'classnames';

import UswdsReactLink from 'components/LinkWrapper';
import ExternalLink from 'components/shared/ExternalLink';
import ExternalLinkAndModal from 'components/shared/ExternalLinkAndModal';

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
          <ExternalLinkAndModal href={link}>{linkText}</ExternalLinkAndModal>
        ) : (
          <UswdsReactLink
            className="display-flex flex-align-center"
            to={link}
            aria-label={header}
          >
            {linkText}
            <Icon.ArrowForward className="margin-left-1" />
          </UswdsReactLink>
        )}
      </CardBody>
    </Card>
  );
};

export default SystemHelpCard;
