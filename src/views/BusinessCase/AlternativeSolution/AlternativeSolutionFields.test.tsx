import React from 'react';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Form, Formik, FormikProps } from 'formik';

import { defaultProposedSolution } from 'data/businessCase';

import AlternativeSolutionFields from './AlternativeSolutionFields';

describe('Alternative Solution Fields', () => {
  const renderFields = () =>
    render(
      <Formik
        initialValues={{ alternativeA: defaultProposedSolution }}
        onSubmit={() => {}}
        innerRef={jest.fn()}
      >
        {(formikProps: FormikProps<any>) => (
          <Form>
            <AlternativeSolutionFields
              altLetter="A"
              businessCaseCreatedAt={new Date().toISOString()}
              formikProps={formikProps}
            />
          </Form>
        )}
      </Formik>
    );

  it('renders without errors', () => {
    renderFields();

    expect(
      screen.getByTestId('alternative-solution-fields')
    ).toBeInTheDocument();
  });

  it('fill deepest question branch', async () => {
    renderFields();

    const titleField = screen.getByRole('textbox', {
      name: /title/i
    });
    userEvent.type(titleField, 'Alternative A solution title');
    expect(titleField).toHaveValue('Alternative A solution title');

    const summaryField = screen.getByRole('textbox', {
      name: /summary/i
    });
    userEvent.type(summaryField, 'Alternative A solution summary');
    expect(summaryField).toHaveValue('Alternative A solution summary');

    const acquisitionApproachField = screen.getByRole('textbox', {
      name: /acquisition approach/i
    });
    userEvent.type(
      acquisitionApproachField,
      'Alternative A solution acquisition approach'
    );
    expect(acquisitionApproachField).toHaveValue(
      'Alternative A solution acquisition approach'
    );

    const securityFieldGroup = screen.getByTestId('security-approval');
    const securityNoRadio = within(securityFieldGroup).getByRole('radio', {
      name: /no/i
    });
    securityNoRadio.click();
    expect(securityNoRadio).toBeChecked();

    const securityApprovalProgressGroup = screen.getByTestId(
      'security-approval-in-progress'
    );
    const securityApprovalProgressYesRadio = within(
      securityApprovalProgressGroup
    ).getByRole('radio', {
      name: /yes/i
    });
    securityApprovalProgressYesRadio.click();
    expect(securityApprovalProgressYesRadio).toBeChecked();

    const cloudHostingRadio = screen.getByRole('radio', { name: /cloud/i });
    cloudHostingRadio.click();
    expect(cloudHostingRadio).toBeChecked();

    const hostingLocationField = screen.getByRole('textbox', {
      name: /where are you planning to host/i
    });
    userEvent.type(
      hostingLocationField,
      'Alternative A solution hosting location'
    );
    expect(hostingLocationField).toHaveValue(
      'Alternative A solution hosting location'
    );

    const cloudServiceTypeField = screen.getByRole('textbox', {
      name: /cloud service/i
    });
    userEvent.type(
      cloudServiceTypeField,
      'Alternative A solution hosting cloud service'
    );
    expect(cloudServiceTypeField).toHaveValue(
      'Alternative A solution hosting cloud service'
    );

    const userInterfaceGroup = screen.getByTestId('user-interface-group');
    const userInterfaceYesRadio = within(userInterfaceGroup).getByRole(
      'radio',
      {
        name: /yes/i
      }
    );
    userInterfaceYesRadio.click();
    expect(userInterfaceYesRadio).toBeChecked();

    const prosField = screen.getByRole('textbox', {
      name: /pros/i
    });
    userEvent.type(prosField, 'Alternative A solution pros');
    expect(prosField).toHaveValue('Alternative A solution pros');

    const consField = screen.getByRole('textbox', {
      name: /cons/i
    });
    userEvent.type(consField, 'Alternative A solution cons');
    expect(consField).toHaveValue('Alternative A solution cons');

    const costSavingsField = screen.getByRole('textbox', {
      name: /cost savings/i
    });
    userEvent.type(costSavingsField, 'Alternative A solution cost savings');
    expect(costSavingsField).toHaveValue('Alternative A solution cost savings');
  });

  it('is approved by cms security', () => {
    renderFields();

    const securityApprovalGroup = screen.getByTestId('security-approval');
    const approvedRadio = within(securityApprovalGroup).getByRole('radio', {
      name: /yes/i
    });
    approvedRadio.click();
    expect(approvedRadio).toBeChecked();
    expect(
      screen.queryByTestId('security-approval-in-progress')
    ).not.toBeInTheDocument();
  });

  it('fills out data center branch', () => {
    renderFields();

    const dataCenterHostingRadio = screen.getByRole('radio', {
      name: /data center/i
    });
    dataCenterHostingRadio.click();
    expect(dataCenterHostingRadio).toBeChecked();

    const dataCenterLocationField = screen.getByRole('textbox', {
      name: /which data center/i
    });
    userEvent.type(
      dataCenterLocationField,
      'Alternative A solution data center location'
    );
    expect(dataCenterLocationField).toHaveValue(
      'Alternative A solution data center location'
    );
  });

  it('fills out no hosting branch', () => {
    renderFields();

    const dataCenterHostingRadio = screen.getByRole('radio', {
      name: /hosting is not needed/i
    });
    dataCenterHostingRadio.click();
    expect(dataCenterHostingRadio).toBeChecked();
  });
});
