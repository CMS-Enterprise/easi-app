import React from 'react';
import { mount, shallow } from 'enzyme';

import ActionBanner from './index';

describe('The Action Banner component', () => {
  it('renders without crashing', () => {
    shallow(
      <ActionBanner
        title="TEST"
        helpfulText="Testing this form helps you receive a CMS IT LifeCycle ID so that you can start a new system or project."
        label="Finish CMS TEST"
        onClick={() => {}}
      />
    );
  });

  it('renders a button', () => {
    const component = mount(
      <ActionBanner
        title="TEST"
        helpfulText="Testing this form helps you receive a CMS IT LifeCycle ID so that you can start a new system or project."
        label="Finish CMS TEST"
        onClick={() => {}}
      />
    );
    expect(component.find('button').length).toEqual(1);
    expect(component.find('button').text()).toEqual('Finish CMS TEST');
    expect(component.find('.action-banner__action-label').length).toEqual(0);
  });

  it('renders action text instead of a button if there is no action', () => {
    const component = mount(
      <ActionBanner
        title="TEST"
        helpfulText="Testing this form helps you receive a CMS IT LifeCycle ID so that you can start a new system or project."
        label="Finish CMS TEST"
      />
    );
    expect(component.find('button').length).toEqual(0);
    expect(component.find('.action-banner__action-label').text()).toEqual(
      'Finish CMS TEST'
    );
  });
});
