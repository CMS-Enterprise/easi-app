import React from 'react';
import classnames from 'classnames';

import Alert from 'components/shared/Alert';

import './index.scss';

const MandatoryFieldsAlert = ({
  textClassName
}: {
  textClassName?: string;
}) => (
  <Alert type="info" slim data-testid="mandatory-fields-alert">
    <span className={classnames('mandatory-fields-alert__text', textClassName)}>
      All fields are mandatory
    </span>
  </Alert>
);

export default MandatoryFieldsAlert;
