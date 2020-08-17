import React from 'react';
import { shallow } from 'enzyme';

import SecondaryNav from './index';

describe('The Secondary Nav component', () => {
  it('renders without crashing', () => {
    shallow(<SecondaryNav />);
  });

  it('displays secondary navigation links', () => {
    const mockNavLinks: any[] = [
      { id: '1', name: 'System1', slug: 'system1', link: '/system/system1' },
      { id: '2', name: 'System2', slug: 'system2', link: '/system/system2' },
      { id: '3', name: 'System3', slug: 'system3', link: '/system/system3' },
      { id: '4', name: 'System4', slug: 'system4', link: '/system/system4' },
      { id: '5', name: 'System5', slug: 'system5', link: '/system/system5' }
    ];

    const component = shallow(
      <SecondaryNav secondaryNavList={mockNavLinks} activeNavItem="system1" />
    );

    expect(component.find('[data-testid="header-nav-item"]').length).toEqual(
      mockNavLinks.length
    );
  });
});
