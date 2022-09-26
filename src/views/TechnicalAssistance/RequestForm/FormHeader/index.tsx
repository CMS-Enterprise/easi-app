import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  GridContainer,
  IconArrowBack,
  StepIndicator,
  StepIndicatorStep
} from '@trussworks/react-uswds';
// eslint-disable-next-line import/no-unresolved
import { StepIndicatorStepProps } from '@trussworks/react-uswds/lib/components/stepindicator/StepIndicatorStep/StepIndicatorStep';

import UswdsReactLink from 'components/LinkWrapper';
import PageHeading from 'components/PageHeading';

import Breadcrumbs, { BreadcrumbsProps } from '../../Breadcrumbs';

import './index.scss';

export interface FormHeaderProps {
  step: number;
  breadcrumbItems?: BreadcrumbsProps['items'];
}

type RequestFormText = {
  heading: string;
  description: string[];
  steps: {
    name: string;
    description?: string;
    longName?: string;
  }[];
};

function FormHeader({ step, breadcrumbItems }: FormHeaderProps) {
  const { t } = useTranslation('technicalAssistance');
  const text = t<RequestFormText>('requestForm', {
    returnObjects: true
  });

  const stepIdx = step - 1;
  const stepDescription = text.steps[stepIdx].description;

  return (
    <div className="trb-form-header">
      <div className="bg-gray-5 padding-bottom-6">
        <GridContainer>
          {breadcrumbItems?.length && <Breadcrumbs items={breadcrumbItems} />}

          <PageHeading className="margin-bottom-0">{text.heading}</PageHeading>
          <div className="font-body-lg line-height-body-5 text-light">
            {text.description[0]}
          </div>
          <div className="margin-top-2 line-height-body-5">
            {text.description[1]}
          </div>

          <div className="margin-top-3">
            <UswdsReactLink to="/trb">
              <IconArrowBack className="margin-right-05 margin-bottom-2px text-tbottom" />
              Save and exit
            </UswdsReactLink>
          </div>
        </GridContainer>
      </div>

      <GridContainer>
        <StepIndicator
          headingLevel="h4"
          className="margin-top-4 margin-bottom-2"
        >
          {text.steps.map((stp, idx) => {
            let status: StepIndicatorStepProps['status'];
            if (stepIdx === idx) status = 'current';
            if (stepIdx > idx) status = 'complete';
            return (
              <StepIndicatorStep
                key={stp.name}
                label={
                  // Display text for (step) name vs long (name) handled in this module's sass
                  ((
                    <span>
                      <span className="name">{stp.name}</span>
                      <span className="long">{stp.longName ?? stp.name}</span>
                    </span>
                  ) as unknown) as string // `label` expects a string but can render jsx
                }
                status={status}
              />
            );
          })}
        </StepIndicator>

        {stepDescription && (
          <div className="line-height-body-5 text-light">{stepDescription}</div>
        )}
      </GridContainer>
    </div>
  );
}

export default FormHeader;
