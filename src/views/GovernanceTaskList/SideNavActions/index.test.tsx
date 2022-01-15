import React from 'react';
import { Button } from '@trussworks/react-uswds';
import { shallow } from 'enzyme';

import Modal from 'components/Modal';
import { initialSystemIntakeForm } from 'data/systemIntake';

import SideNavActions from './index';

const renderComponent = () => {
  return shallow(
    <SideNavActions intake={initialSystemIntakeForm} archiveIntake={() => {}} />
  );
};

describe('The TaskListSideNavActions', () => {
  it('renders without crashing', () => {
    expect(renderComponent).not.toThrow();
  });

  describe('save and exit', () => {
    it('displays text', () => {
      const component = renderComponent();
      expect(
        component.find('UswdsReactLink').at(0).dive().prop('children')
      ).toEqual('Save & Exit');
    });

    it('goes to home', () => {
      const component = renderComponent();
      expect(component.find('UswdsReactLink').at(0).prop('to')).toEqual('/');
    });
  });

  describe('remove your request to add a new system', () => {
    it('displays text', () => {
      const component = renderComponent();
      expect(component.find('.test-withdraw-request').dive().text()).toEqual(
        'Remove your request to add a new system'
      );
    });
    it('has a closed modal by default', () => {
      const component = renderComponent();
      expect(component.find(Modal).prop('isOpen')).toEqual(false);
    });
    it('opens a modal', () => {
      const component = renderComponent();
      component.find('.test-withdraw-request').simulate('click');
      expect(component.find(Modal).prop('isOpen')).toEqual(true);
    });
    it('has 2 buttons in the modal', () => {
      const component = renderComponent();
      component.find('.test-withdraw-request').simulate('click');
      expect(component.find(Modal).find(Button).length).toEqual(2);
    });
  });

  describe('Related Content', () => {
    it('displays h4', () => {
      const component = renderComponent();
      expect(component.find('h4').text()).toEqual('Related Content');
    });

    describe('overview for adding a system', () => {
      it('displays text', () => {
        const component = renderComponent();
        expect(
          component.find('UswdsReactLink').at(1).dive().props().children
        ).toContain('Overview for adding a system');
      });

      it('goes to governence overview', () => {
        const component = renderComponent();
        expect(component.find('UswdsReactLink').at(1).prop('to')).toEqual(
          '/governance-overview'
        );
      });

      it('opens in a new tab', () => {
        const component = renderComponent();
        expect(component.find('UswdsReactLink').at(1).prop('target')).toEqual(
          '_blank'
        );
      });
    });
  });
});
