import React from 'react';
import { shallow, mount } from 'enzyme';
import { Formik, Form } from 'formik';
import Page1 from './index';

describe('System Intake Form Page 1', () => {
  const initialData = {
    name: '',
    acronym: '',
    requestor: '',
    requestorComponent: '',
    businessOwner: '',
    businessOwnerComponent: '',
    productManager: '',
    productManagerComponent: '',
    governanceTeams: [],
    description: '',
    currentStage: '',
    needsEaSupport: null,
    hasContract: ''
  };

  it('renders without crashing', () => {
    const component = mount(
      <Formik initialValues={initialData} onSubmit={jest.fn()}>
        <Form>{formikProps => <Page1 formikProps={formikProps} />}</Form>
      </Formik>
    );
  });

  describe('Requestor and Business/Product Owner are the same person', () => {
    it('changes business owner when requestor changes', () => {
      const component = shallow(
        <Formik initialValues={initialData} onSubmit={jest.fn()}>
          <Form>{formikProps => <Page1 formikProps={formikProps} />}</Form>
        </Formik>
      );
      // console.log(
      //   component.find(Form).renderProp('children')({
      //     formikProps: { values: initialData }
      //   })
      // );
      // console.log(component.debug());
      // component
      //   .find('input[name="requestor"]')
      //   .simulate('change', { target: { value: 'EASiTest' } });
      // component
      //   .find('input[name="isBusinessOwnerSameAsRequestor"]')
      //   .simulate('click');
      // expect(component.find('input[name="businessOwner"').text()).toEqual(
      //   'EASiTest'
      // );
    });

    // it('changes business owner component when requestor component changes');
  });
});
