import React from 'react';

import Alert from 'components/shared/Alert';

import './index.scss';

const MandatoryFieldsAlert = () => (
  <Alert type="info" slim>
    <span className="mandatory-fields-alert__text">
      All fields are mandatory
    </span>
  </Alert>
);

export default MandatoryFieldsAlert;
