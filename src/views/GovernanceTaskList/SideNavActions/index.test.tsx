import React from 'react';
import { shallow } from 'enzyme';
import { Button, Link } from '@trussworks/react-uswds';
import SideNavActions from './index';

const renderComponent = () => {
  return shallow(<SideNavActions />);
};

describe('The TaskListSideNavActions', () => {
  it('renders without crashing', () => {
    expect(renderComponent).not.toThrow();
  });

  describe('save and exit', () => {
    it('displays text', () => {
      const component = renderComponent();
      expect(component.find('Link').text()).toEqual('Save & Exit');
    });

    it('goes to home', () => {
      const component = renderComponent();
      expect(component.find('Link').prop('to')).toEqual('/');
    });
  });

  describe('remove your request to add a new system', () => {
    it('displays text', () => {
      const component = renderComponent();
      expect(
        component
          .find(Button)
          .dive()
          .text()
      ).toEqual('Remove your request to add a new system');
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
          component
            .find(Link)
            .dive()
            .text()
        ).toEqual('Overview for adding a system\u00a0(opens in a new tab)');
      });

      it('goes to governence overview', () => {
        const component = renderComponent();
        expect(
          component
            .find(Link)
            .dive()
            .prop('href')
        ).toEqual('/governance-overview');
      });

      it('opens in a new tab', () => {
        const component = renderComponent();
        expect(
          component
            .find(Link)
            .dive()
            .prop('target')
        ).toEqual('_blank');
      });
    });
  });
});
