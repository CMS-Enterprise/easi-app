import React from 'react';
import { shallow, mount } from 'enzyme';
import ActionBanner from './index';

describe('The Action Banner component', () => {
  it('renders without crashing', () => {
    shallow(
      <ActionBanner
        title="TEST"
        helpfulText="Testing this form helps you receive a CMS IT LifeCycle ID so that you can start a new system or project."
        buttonLabel="Finish CMS TEST"
      />
    );
  });

  it('renders a button', () => {
    const component = mount(
      <ActionBanner
        title="TEST"
        helpfulText="Testing this form helps you receive a CMS IT LifeCycle ID so that you can start a new system or project."
        buttonLabel="Finish CMS TEST"
      />
    );
    expect(component.find('button').length).toEqual(1);
    expect(component.find('button').text()).toEqual('Finish CMS TEST');
  });
});
