import React from 'react';
import { render } from '@testing-library/react';

import TabPanel from './TabPanel';

describe('The TabPanel component', () => {
  it('renders without errors', () => {
    render(
      <TabPanel id="test" tabName="Tab 1">
        Hello
      </TabPanel>
    );
  });
});
