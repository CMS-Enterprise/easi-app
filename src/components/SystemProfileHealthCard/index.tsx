import React from 'react';
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Grid,
  GridContainer
} from '@trussworks/react-uswds';
import classnames from 'classnames';

import './index.scss';

type SystemProfileHealthCardProps = {
  heading: string;
  body: React.ReactNode | string;
  footer: React.ReactNode | string;
  status: 'success' | 'warning' | 'fail';
  statusText: string;
};

export const SystemProfileHealthCard = (
  props: SystemProfileHealthCardProps
) => {
  const { heading, body, footer, status, statusText } = props;

  let iconColor = '';
  let iconClassname = '';
  switch (status) {
    case 'success':
      iconColor = 'green';
      iconClassname = 'fa-check-circle';
      break;
    case 'warning':
      iconColor = '#ff9321';
      iconClassname = 'fa-exclamation-circle';
      break;
    case 'fail':
      iconColor = 'red';
      iconClassname = 'fa-times-circle';
      break;
    default:
      iconColor = '#000000';
      break;
  }

  return (
    <div>
      <Card>
        <CardHeader>
          <h2 className="usa-card__heading">{heading}</h2>
        </CardHeader>
        <CardBody>
          <GridContainer className="resetGridPadding">
            <Grid row>
              <Grid desktop={{ col: 9 }}>{body}</Grid>
              <Grid desktop={{ col: 3 }} style={{ textAlign: 'center' }}>
                <i
                  style={{ color: iconColor }}
                  className={classnames('fa', 'fa-5x', iconClassname)}
                />
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
