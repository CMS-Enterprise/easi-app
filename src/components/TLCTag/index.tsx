import React from 'react';
import classNames from 'classnames';

import Tag from 'components/shared/Tag';

type TLCPhase = string | null | undefined;

export const tlcPhaseClassName = (phase: TLCPhase) => {
  switch (phase) {
    case 'Operate':
      return 'bg-success-dark text-white';
    case 'Initiate':
      return 'bg-base-lighter';
    case 'Develop':
      return 'bg-warning';
    case 'Retire':
      return 'bg-warning';
    default:
      return 'bg-secondary-dark text-white';
  }
};

type TLCTagTagProps = {
  tlcPhase: TLCPhase;
};

const TLCTag = ({ tlcPhase }: TLCTagTagProps) => {
  return (
    <div className="display-flex flex-align-center flex-justify">
      <Tag
        className={classNames(`padding-1, ${tlcPhaseClassName(tlcPhase)}`)}
        data-testid="tlc-status-tag"
      >
        {tlcPhase}
      </Tag>
    </div>
  );
};

export default TLCTag;
