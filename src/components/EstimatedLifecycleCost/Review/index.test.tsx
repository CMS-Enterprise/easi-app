import React from 'react';
import { mount, shallow } from 'enzyme';

import { defaultEstimatedLifecycle } from 'data/businessCase';

import EstimatedLifecycleCostReview from './index';

// Get past TS errors
declare const global: any;

describe('The Estimated Lifecycle Cost review component', () => {
  const developmentSampleData = {
    year1: [
      { phase: 'Development', cost: '5000' },
      { phase: 'Development', cost: '5000' },
      { phase: 'Development' }
    ],
    year2: [{ phase: 'Development', cost: '5000' }],
    year3: [{ phase: 'Development', cost: '5000' }],
    year4: [{ phase: 'Development', cost: '5000' }],
    year5: [{ phase: 'Development', cost: '5000' }]
  };

  const omSampleData = {
    year1: [
      { phase: 'Operations and Maintenance', cost: '5000' },
      { phase: 'Operations and Maintenance', cost: '5000' },
      { phase: 'Operations and Maintenance' }
    ],
    year2: [{ phase: 'Operations and Maintenance', cost: '5000' }],
    year3: [{ phase: 'Operations and Maintenance', cost: '5000' }],
    year4: [{ phase: 'Operations and Maintenance', cost: '5000' }],
    year5: [{ phase: 'Operations and Maintenance', cost: '5000' }]
  };

  const otherPhaseSampleData = {
    year1: [
      { phase: 'Other', cost: '5000' },
      { phase: 'Other', cost: '5000' },
      { phase: 'Other' }
    ],
    year2: [{ phase: 'Other', cost: '5000' }],
    year3: [{ phase: 'Other', cost: '5000' }],
    year4: [{ phase: 'Other', cost: '5000' }],
    year5: [{ phase: 'Other', cost: '5000' }]
  };

  it('renders without crashing', () => {
    shallow(<EstimatedLifecycleCostReview data={defaultEstimatedLifecycle} />);
  });

  describe('Desktop', () => {
    beforeEach(() => {
      global.matchMedia = media => ({
        addListener: () => {},
        removeListener: () => {},
        matches: media === '(min-width: 769px)'
      });
    });

    it('renders the desktop view', () => {
      const component = mount(
        <EstimatedLifecycleCostReview data={defaultEstimatedLifecycle} />
      );

      expect(
        component.find("[data-testid='est-lifecycle--desktop']").exists()
      ).toBe(true);
      expect(
        component.find("[data-testid='est-lifecycle--mobile']").exists()
      ).toBe(false);
    });

    it('adds up development total correctly', () => {
      const component = mount(
        <EstimatedLifecycleCostReview data={developmentSampleData} />
      );

      expect(
        component.find("[data-testid='total-development-costs']").text()
      ).toEqual('$30,000');
    });
  });

  describe('Mobile/Tablet', () => {
    beforeEach(() => {
      global.matchMedia = media => ({
        addListener: () => {},
        removeListener: () => {},
        matches: media === '(max-width: 768px)'
      });
    });

    it('renders the mobile view', () => {
      const component = mount(
        <EstimatedLifecycleCostReview data={defaultEstimatedLifecycle} />
      );
      expect(
        component.find("[data-testid='est-lifecycle--mobile']").exists()
      ).toBe(true);
      expect(
        component.find("[data-testid='est-lifecycle--desktop']").exists()
      ).toBe(false);
    });

    it('renders mobile view with development data', () => {
      mount(<EstimatedLifecycleCostReview data={developmentSampleData} />);
    });

    it('renders mobile view with O&M data', () => {
      mount(<EstimatedLifecycleCostReview data={omSampleData} />);
    });

    it('renders mobile view with Other data', () => {
      mount(<EstimatedLifecycleCostReview data={otherPhaseSampleData} />);
    });
  });
});
