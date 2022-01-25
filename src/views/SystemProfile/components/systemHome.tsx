import React from 'react';
import { Card, CardGroup } from '@trussworks/react-uswds';
import classnames from 'classnames';

type SystemHomeProps = {
  className?: string;
  children?: React.ReactNode;
};

const SystemHome = ({ className, children }: SystemHomeProps) => {
  return (
    <CardGroup>
      <Card
        data-testid="system-card"
        className={classnames('grid-col-12', className)}
      >
        <div className="grid-col-12">{children}</div>
      </Card>
    </CardGroup>
  );
};

export default SystemHome;
