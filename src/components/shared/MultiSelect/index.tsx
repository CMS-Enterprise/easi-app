import React from 'react';
import classNames from 'classnames';

import './index.scss';

type MultiSelectProps = {
  className?: string;
  placeholder?: string;
  options: string[];
  tags?: boolean;
  disabled?: boolean;
};

export default function MultiSelect({
  className,
  placeholder,
  options,
  tags = false,
  disabled = false
}: MultiSelectProps) {
  return (
    <div className={classNames('easi-multiselect', className)}>multiSelect</div>
  );
}
