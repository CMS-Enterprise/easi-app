import React from 'react';

import './index.scss';

export enum ProgressStatus {
  Done = 'Done',
  Skipped = 'Skipped',
  Current = 'Current',
  ToDo = 'ToDo'
}

type ProgressStepProps = {
  name: string;
  optionalLabel?: string;
  status: ProgressStatus;
};

function iconForStatus(status: ProgressStatus) {
  switch (status) {
    case ProgressStatus.Done:
      // TODO this should be an outlined check circle
      return (
        <i
          className="easi-progress-indicator__icon fa fa-check-circle margin-x-05"
          aria-hidden
        />
      );
    case ProgressStatus.Current:
      return (
        <i
          className="easi-progress-indicator__icon fa fa-circle margin-x-05"
          aria-hidden
        />
      );
    default:
      return null;
  }
}

export const ProgressIndicator = ({ children }) => {
  return <ol className="easi-progress-indicator">{children}</ol>;
};

export const ProgressStep = ({
  name,
  status,
  optionalLabel
}: ProgressStepProps) => {
  return (
    <li
      className={`easi-progress-indicator__step easi-progress-indicator-step__${status &&
        status.toLowerCase()}`}
    >
      {iconForStatus(status)}

      <span className="easi-progress-indicator-name">{name}</span>
      {optionalLabel && (
        <>
          <br />
          <span className="easi-progress-indicator-label">{optionalLabel}</span>
        </>
      )}
    </li>
  );
};
