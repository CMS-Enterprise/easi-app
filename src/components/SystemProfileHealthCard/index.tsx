/**
 * TODO: This component is not complete. It was prototyped as part of
 * https://jiraent.cms.gov/browse/EASI-1368, but has not undergone any 508 testing,
 * UX review, etc.
 */

import React from 'react';
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Grid,
  GridContainer
} from '@trussworks/react-uswds';

import SystemHealthIcon from 'components/SystemHealthIcon';
import { IconStatus } from 'types/iconStatus';

import './index.scss';

type SystemProfileHealthCardProps = {
  heading: string;
  body: React.ReactNode | string;
  footer: React.ReactNode | string;
  status: IconStatus;
  statusText: string;
};

export const SystemProfileHealthCard = (
  props: SystemProfileHealthCardProps
) => {
  const { heading, body, footer, status, statusText } = props;

  return (
    <div>
      <Card>
        <CardHeader>
          <h2 className="usa-card__heading">{heading}</h2>
        </CardHeader>
        <CardBody>
          <GridContainer className="grid-no-padding">
            <Grid row>
              <Grid desktop={{ col: 9 }}>{body}</Grid>
              <Grid desktop={{ col: 3 }} className="system-health-center-text">
                <SystemHealthIcon status={status} size="xl" />
                <br />
                {statusText}
              </Grid>
            </Grid>
          </GridContainer>
        </CardBody>
        <CardFooter>{footer}</CardFooter>
      </Card>
    </div>
  );
};

export default SystemProfileHealthCard;
