import React from 'react';
import { shallow } from 'enzyme';

import TabPanel from './TabPanel';

describe('The TabPanel component', () => {
  it('renders without errors', () => {
    shallow(
      <TabPanel id="test" tabName="Tab 1">
        Hello
      </TabPanel>
    );
  });
});
