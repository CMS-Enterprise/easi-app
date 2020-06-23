import React from 'react';
import { mount } from 'enzyme';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import SideNavActions from './index';

const renderComponent = () => {
  const mockStore = configureMockStore();
  const store = mockStore({});
  return mount(
    <MemoryRouter initialEntries={['/']} initialIndex={0}>
      <Provider store={store}>
        <SideNavActions />
      </Provider>
    </MemoryRouter>
  );
};

describe('The TaskListSideNavActions', () => {
  it('renders without crashing', () => {
    const component = renderComponent();
    expect(component.find(SideNavActions).exists()).toBe(true);
  });

  it('displays 3 actions', () => {
    const component = renderComponent();
    expect(component.find('Button.sidenav-actions__action').length).toBe(3);
  });

  it('displays related content', () => {
    const component = renderComponent();
    expect(
      component.find('.sidenav-actions__related-content').text()
    ).toContain('Related Content');
  });
});
