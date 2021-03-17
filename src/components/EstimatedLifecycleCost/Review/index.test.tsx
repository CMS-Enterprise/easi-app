import React from 'react';
import { mount, shallow } from 'enzyme';

import { defaultEstimatedLifecycle } from 'data/businessCase';

import EstimatedLifecycleCostReview from './index';

// Get past TS errors
declare const global: any;

describe('The Estimated Lifecycle Cost review component', () => {
  const sampleData = {
    year1: {
      development: {
        isPresent: true,
        cost: '5000'
      },
      operationsMaintenance: {
        isPresent: true,
        cost: '5000'
      },
      other: {
        isPresent: true,
        cost: '5000'
      }
    },
    year2: {
      development: {
        isPresent: true,
        cost: '5000'
      },
      operationsMaintenance: {
        isPresent: true,
        cost: '5000'
      },
      other: {
        isPresent: true,
        cost: '5000'
      }
    },
    year3: {
      development: {
        isPresent: true,
        cost: '5000'
      },
      operationsMaintenance: {
        isPresent: true,
        cost: '5000'
      },
      other: {
        isPresent: true,
        cost: '5000'
      }
    },
    year4: {
      development: {
        isPresent: true,
        cost: '5000'
      },
      operationsMaintenance: {
        isPresent: true,
        cost: '5000'
      },
      other: {
        isPresent: true,
        cost: '5000'
      }
    },
    year5: {
      development: {
        isPresent: true,
        cost: '5000'
      },
      operationsMaintenance: {
        isPresent: true,
        cost: '5000'
      },
      other: {
        isPresent: true,
        cost: '5000'
      }
    }
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
        <EstimatedLifecycleCostReview data={sampleData} />
      );

      expect(
        component.find("[data-testid='total-development-costs']").text()
      ).toEqual('$25,000');
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
      mount(<EstimatedLifecycleCostReview data={sampleData} />);
    });

    it('renders mobile view with O&M data', () => {
      mount(<EstimatedLifecycleCostReview data={sampleData} />);
    });

    it('renders mobile view with Other data', () => {
      mount(<EstimatedLifecycleCostReview data={sampleData} />);
    });
  });
});
