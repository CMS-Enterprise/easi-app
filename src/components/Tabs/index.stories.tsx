import React from 'react';

import { TabPanel, Tabs } from './index';

export default {
  title: 'Tabs',
  component: Tabs
};

export const Default = () => {
  return (
    <Tabs>
      <TabPanel id="Test-Pepperoni" tabName="Pepperoni">
        <h1>Pepperoni</h1>
      </TabPanel>
      <TabPanel id="Test-Sausage" tabName="Sausage">
        <h1>Sausage</h1>
      </TabPanel>
      <TabPanel id="Test-Mushroom" tabName="Mushroom">
        <h1>Mushroom</h1>
      </TabPanel>
      <TabPanel id="Test-Bacon" tabName="Bacon">
        <h1>Bacon</h1>
      </TabPanel>
    </Tabs>
  );
};

export const CustomDefaultTab = () => {
  return (
    <Tabs defaultActiveTab="Tab 3">
      <TabPanel id="Test-Tab-1" tabName="Tab 1">
        <h1>Tab 1</h1>
      </TabPanel>
      <TabPanel id="Test-Tab-2" tabName="Tab 2">
        <h1>Tab 2</h1>
      </TabPanel>
      <TabPanel id="Test-Tab-3" tabName="Tab 3">
        <h1>Tab 3</h1>
      </TabPanel>
    </Tabs>
  );
};
CustomDefaultTab.storyName = 'w/ custom default tab selected';
