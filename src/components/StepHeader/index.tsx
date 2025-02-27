import React from 'react';
import {
  Grid,
  GridContainer,
  StepIndicator,
  StepIndicatorStep
} from '@trussworks/react-uswds';
// eslint-disable-next-line import/no-unresolved
import { StepIndicatorStepProps } from '@trussworks/react-uswds/lib/components/stepindicator/StepIndicatorStep/StepIndicatorStep';
import classNames from 'classnames';

import PageHeading from 'components/PageHeading';

import './index.scss';

export type StepHeaderStepProps = {
  key: string;
  label: React.ReactNode;
  description?: string;
  completed?: boolean;
  disabled?: boolean;
  onClick?: React.MouseEventHandler<HTMLLIElement>;
};

export interface StepHeaderProps {
  step: number;
  steps: StepHeaderStepProps[];
  hideSteps?: boolean;
  breadcrumbBar?: React.ReactNode;
  heading: string;
  text?: string;
  subText?: string;
  children?: React.ReactNode;
  warning?: React.ReactNode;
  errorAlert?: React.ReactNode;
}

/**
 * A header component coupled with `StepIndicator` with some mods.
 * There is also room for a `BreadcrumbBar` component at the top.
 * Steps can have `onClick` callbacks assigned.
 *
 * `FormStepIndicatorProps.label` can be assigned jsx in case there are display conditions.
 * See `FormStepHeader/index.scss` for style details.
 * ```
 * <>
 *   <span className="name">{stp.name}</span>
 *   <span className="long">{stp.longName ?? stp.name}</span>
 * </>
 * ```
 */
function StepHeader({
  step,
  steps,
  hideSteps,
  breadcrumbBar,
  heading,
  text,
  subText,
  children,
  warning,
  errorAlert
}: StepHeaderProps) {
  const stepIdx = step - 1;
  const stepDescription = steps[stepIdx].description;

  return (
    <div className="trb-form-header">
      <div className="bg-gray-5 padding-bottom-6">
        <GridContainer>
          <Grid row>
            <Grid col>
              {breadcrumbBar}

              <PageHeading className="margin-bottom-0">{heading}</PageHeading>
              {text && (
                <div className="font-body-lg line-height-body-5 text-light">
                  {text}
                </div>
              )}
              {subText && (
                <div className="margin-top-2 line-height-body-5">{subText}</div>
              )}

              {children && <div className="margin-top-3">{children}</div>}
            </Grid>
          </Grid>
        </GridContainer>
      </div>

      {warning}

      {errorAlert && <GridContainer>{errorAlert}</GridContainer>}

      {!hideSteps && (
        <GridContainer>
          <StepIndicator
            headingLevel="h4"
            className="margin-top-4 margin-bottom-2"
          >
            {steps.map((stp, idx) => {
              let status: StepIndicatorStepProps['status'];
              if (stepIdx === idx) status = 'current';
              else if (stp.completed) status = 'complete';
              return (
                <StepIndicatorStep
                  key={stp.key}
                  status={status}
                  onClick={
                    stp.onClick && !stp.disabled ? stp.onClick : undefined
                  }
                  className={classNames('maxw-none', {
                    'usa-step-indicator__segment--clickable':
                      !!stp.onClick && !stp.disabled,
                    'usa-step-indicator__segment--disabled': stp.disabled
                  })}
                  // `label` expects a string but can render jsx
                  label={stp.label as unknown as string}
                />
              );
            })}
          </StepIndicator>

          {stepDescription && (
            <div className="line-height-body-5 text-light">
              {stepDescription}
            </div>
          )}
        </GridContainer>
      )}
    </div>
  );
}

export default StepHeader;
