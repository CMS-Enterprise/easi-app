import React from 'react';
import { Link } from 'react-router-dom';
import {
  Breadcrumb,
  BreadcrumbBar,
  BreadcrumbLink
} from '@trussworks/react-uswds';

import TestingTemplatesBase from 'components/TestingTemplates';
import NeedHelpBox from 'views/Help/InfoBox/NeedHelpBox';

import './index.scss';

const TestingTemplates = () => {
  return (
    <div className="grid-container accessibility-testing-templates">
      <BreadcrumbBar variant="wrap">
        <Breadcrumb>
          <BreadcrumbLink asCustom={Link} to="/">
            <span>Home</span>
          </BreadcrumbLink>
        </Breadcrumb>
        <Breadcrumb current>Templates for 508 testing</Breadcrumb>
      </BreadcrumbBar>

      <TestingTemplatesBase />
      <NeedHelpBox className="desktop:grid-col-6 margin-top-5" />
    </div>
  );
};

export default TestingTemplates;
