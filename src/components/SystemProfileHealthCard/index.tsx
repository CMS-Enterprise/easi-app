import React from 'react';
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader
} from '@trussworks/react-uswds';

type SystemProfileHealthCardProps = {
  heading: string;
  body: React.ReactNode | string;
  footer: React.ReactNode | string;
};

export const SystemProfileHealthCard = (
  props: SystemProfileHealthCardProps
) => {
  const { heading, body, footer } = props;

  return (
    <div>
      <Card>
        <CardHeader>
          <h2 className="usa-card__heading">
            {heading || 'System Profile Health'}
          </h2>
        </CardHeader>
        <CardBody>
          {body || (
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam
              consectetur, nisi sed consectetur sagittis, nunc nisl consectetur
              augue, eget tincidunt nisl nisi eu nisl.
            </p>
          )}
        </CardBody>
        <CardFooter>
          {footer || <Button type="button">Test Button</Button>}
        </CardFooter>
      </Card>
    </div>
  );
};

export default SystemProfileHealthCard;
