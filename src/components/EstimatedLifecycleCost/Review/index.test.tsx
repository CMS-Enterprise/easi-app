import React from 'react';
import { shallow, mount } from 'enzyme';
import { defaultEstimatedLifecycle } from 'data/businessCase';
import EstimatedLifecycleCostReview from './index';

// Get past TS errors
declare const global: any;

describe('The Estimated Lifecycle Cost review component', () => {
  const initiateSampleData = {
    year1: [
      { phase: 'Initiate', cost: '5000' },
      { phase: 'Initiate', cost: '5000' },
      { phase: 'Initiate' }
    ],
    year2: [{ phase: 'Initiate', cost: '5000' }],
    year3: [{ phase: 'Initiate', cost: '5000' }],
    year4: [{ phase: 'Initiate', cost: '5000' }],
    year5: [{ phase: 'Initiate', cost: '5000' }]
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

    it('adds up initiate total correctly', () => {
      const component = mount(
        <EstimatedLifecycleCostReview data={initiateSampleData} />
      );

      expect(
        component.find("[data-testid='total-initiate-costs']").text()
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

    it('renders mobile view with initiate data', () => {
      mount(<EstimatedLifecycleCostReview data={initiateSampleData} />);
    });

    it('renders mobile view with O&M data', () => {
      mount(<EstimatedLifecycleCostReview data={omSampleData} />);
    });
  });
});
