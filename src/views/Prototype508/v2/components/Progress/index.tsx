import React, { ReactNode } from 'react';

import './index.scss';

export enum ProgressStatus {
  Completed = 'Completed',
  Skipped = 'Skipped',
  Current = 'Current',
  NotCompleted = 'Not completed'
}

type ProgressStepProps = {
  name: string;
  status: ProgressStatus;
  children?: React.ReactNode;
};

function iconForStatus(status: ProgressStatus) {
  switch (status) {
    case ProgressStatus.Completed:
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

export const ProgressIndicator = ({ children }: { children: ReactNode }) => {
  return (
    <ol className="easi-progress-indicator" aria-label="progress">
      {children}
    </ol>
  );
};

export const ProgressStep = ({ name, status, children }: ProgressStepProps) => {
  return (
    <li
      className={`easi-progress-indicator__step easi-progress-indicator-step__${status &&
        status.toLowerCase().replaceAll(' ', '_')}`}
      aria-current={status === ProgressStatus.Current && 'step'}
    >
      {iconForStatus(status)}
      <span className="easi-progress-indicator-name">{name}</span>
      <span className="usa-sr-only">{status}</span>
      {React.Children.count(children) > 0 && (
        <>
          <br />
          <span className="easi-progress-indicator-label">{children}</span>
        </>
      )}
    </li>
  );
};
