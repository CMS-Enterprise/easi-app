import React from 'react';
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Grid
} from '@trussworks/react-uswds';
import classNames from 'classnames';

import Divider from 'components/shared/Divider';

import './index.scss';

type SystemHelpCardProps = {
  className?: string;
  header: string;
  description: string;
  body?: React.ReactNode;
  footer: React.ReactNode;
};

const SpacesCard = ({
  className,
  header,
  description,
  body,
  footer
}: SystemHelpCardProps) => {
  return (
    <Grid
      tablet={{ col: 12 }}
      desktop={{ col: 6 }}
      className="display-flex flex-align-stretch"
    >
      <Card
        className={classNames(
          className,
          'radius-sm width-full workspaces__card'
        )}
      >
        <CardHeader className="text-bold padding-0 line-height-serif-2 margin-bottom-1 text-body-lg">
          {header}
        </CardHeader>

        <CardBody className="padding-0 flex-1 workspaces__fill-card-space">
          <p className="text-base margin-o">{description}</p>
          {body}
        </CardBody>

        <Divider className="margin-y-2" />

        <CardFooter className="padding-0 margin-bottom-05">{footer}</CardFooter>
      </Card>
    </Grid>
  );
};

export default SpacesCard;
