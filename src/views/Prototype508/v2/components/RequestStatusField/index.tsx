import React from 'react';
import { DateTime } from 'luxon';

import { RequestStep } from '../../types';
import DateField from '../DateField';

const RequestStatusField = ({
  projectStatus,
  projectName,
  setProjectStatus,
  setDate
}: {
  projectStatus: RequestStep;
  projectName: string;
  setProjectStatus: (status: RequestStep) => void;
  setDate: (date: DateTime) => void;
}) => {
  return (
    <fieldset className="usa-fieldset status-modal__body margin-top-2">
      <legend className="text-bold">
        Choose request status for {projectName}
      </legend>
      {Object.values(RequestStep).map(value => {
        const status = value as RequestStep;
        return (
          <>
            <div className="usa-radio">
              <input
                className="usa-radio__input"
                id={`request-status-${status}`}
                type="radio"
                name="request-status"
                value={status}
                checked={projectStatus === status}
                onChange={() => {
                  setProjectStatus(status);
                }}
              />
              <label
                className="usa-radio__label"
                htmlFor={`request-status-${status}`}
              >
                {status}
                {projectStatus === status && ' (current status)'}
              </label>

              {[
                RequestStep.TestScheduled,
                RequestStep.RemediationInProgress,
                RequestStep.ValidationTestingScheduled
              ].includes(status) &&
                projectStatus === status && (
                  <div className="width-card-lg margin-left-4 margin-bottom-1 margin-top-1">
                    <DateField setDate={setDate} />
                  </div>
                )}
            </div>
          </>
        );
      })}
    </fieldset>
  );
};

export default RequestStatusField;
