import React from 'react';
import { ComponentMeta } from '@storybook/react';
import { Grid, GridContainer, Link } from '@trussworks/react-uswds';

import Alert from 'components/Alert';
import { TaskStatus } from 'components/TaskStatusTag';

import TaskListItem, { TaskListContainer, TaskListDescription } from '.';

export default {
  title: 'Task List Item',
  component: TaskListItem
} as ComponentMeta<typeof TaskListItem>;

export const Default = () => (
  <GridContainer>
    <Grid row>
      <TaskListContainer>
        <TaskListItem
          heading="Fill out the Intake Request form"
          status={'COMPLETED' as TaskStatus}
        >
          <TaskListDescription>
            <p>
              Tell the governance admin team about your project or idea and
              upload any existing documentation. This step lets CMS build up
              context about your project and start preparing for further
              discussions with your team.
            </p>
            <p>
              This step can take some time due to scheduling and availability.
              You may go through multiple rounds of editing your Business Case
              and receiving feedback.
            </p>
            <Alert type="info">
              <span>
                To help with that review, someone from the IT Governance team
                will schedule a phone call with you and Enterprise Architecture
                (EA).
              </span>
              <br />
              <br />
              <span>
                After that phone call, the governance team will decide if you
                need to go through a full governance process.
              </span>
            </Alert>
          </TaskListDescription>
          <Link href="/">View submitted request form</Link>
        </TaskListItem>
        <TaskListItem
          heading="Feedback from initial review"
          status={'CANNOT_START_YET' as TaskStatus}
        >
          <TaskListDescription>
            <p className="margin-top-0">
              Tell the governance admin team about your project or idea and
              upload any existing documentation. This step lets CMS build up
              context about your project and start preparing for further
              discussions with your team.
            </p>
            <p>
              This step can take some time due to scheduling and availability.
              You may go through multiple rounds of editing your Business Case
              and receiving feedback.
            </p>
          </TaskListDescription>
        </TaskListItem>
      </TaskListContainer>
    </Grid>
  </GridContainer>
);
