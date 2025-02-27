import React from 'react';
import { Trans } from 'react-i18next';
import classNames from 'classnames';

import RequiredAsterisk from 'components/shared/RequiredAsterisk';

const RequiredFieldsText = ({ className }: { className?: string }) => {
  return (
    <p className={classNames('text-base', className)}>
      <Trans
        i18nKey="action:fieldsMarkedRequired"
        components={{ asterisk: <RequiredAsterisk /> }}
      />
    </p>
  );
};

export default RequiredFieldsText;
