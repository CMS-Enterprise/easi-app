import React from 'react';
import { render, screen, within } from '@testing-library/react';

import { defaultEstimatedLifecycle } from 'data/businessCase';
import { LifecycleCosts } from 'types/estimatedLifecycle';

import EstimatedLifecycleCostReview from './index';

// Get past TS errors
declare const global: any;

describe('The Estimated Lifecycle Cost review component', () => {
  beforeEach(() => {
    global.matchMedia = (media: string) => ({
      addListener: () => {},
      removeListener: () => {},
      matches: media === '(min-width: 769px)'
    });
  });

  const sampleData: LifecycleCosts = {
    development: {
      label: 'Development',
      type: 'primary',
      isPresent: true,
      years: {
        year1: '5000',
        year2: '5000',
        year3: '5000',
        year4: '5000',
        year5: '5000'
      }
    },
    operationsMaintenance: {
      label: 'Operations and Maintenance',
      type: 'primary',
      isPresent: true,
      years: {
        year1: '5000',
        year2: '5000',
        year3: '5000',
        year4: '5000',
        year5: '5000'
      }
    },
    helpDesk: {
      label: 'Help desk/call center',
      type: 'related',
      isPresent: false,
      years: {
        year1: '',
        year2: '',
        year3: '',
        year4: '',
        year5: ''
      }
    },
    software: {
      label: 'Software licenses',
      type: 'related',
      isPresent: false,
      years: {
        year1: '',
        year2: '',
        year3: '',
        year4: '',
        year5: ''
      }
    },
    planning: {
      label: 'Planning, support, and professional services',
      type: 'related',
      isPresent: false,
      years: {
        year1: '',
        year2: '',
        year3: '',
        year4: '',
        year5: ''
      }
    },
    infrastructure: {
      label: 'Infrastructure',
      type: 'related',
      isPresent: true,
      years: {
        year1: '5000',
        year2: '5000',
        year3: '5000',
        year4: '5000',
        year5: '5000'
      }
    },
    oit: {
      label: 'OIT services, tools, and pilots',
      type: 'related',
      isPresent: false,
      years: {
        year1: '',
        year2: '',
        year3: '',
        year4: '',
        year5: ''
      }
    },
    other: {
      label: 'Other services, tools, and pilots',
      type: 'related',
      isPresent: false,
      years: {
        year1: '',
        year2: '',
        year3: '',
        year4: '',
        year5: ''
      }
    }
  };

  it('renders without crashing', () => {
    render(
      <EstimatedLifecycleCostReview
        fiscalYear={2021}
        data={defaultEstimatedLifecycle}
      />
    );
  });

  describe('Desktop', () => {
    beforeEach(() => {
      global.matchMedia = (media: string) => ({
        addListener: () => {},
        removeListener: () => {},
        matches: media === '(min-width: 769px)'
      });
    });

    it('renders the desktop view', () => {
      render(
        <EstimatedLifecycleCostReview
          fiscalYear={2021}
          data={defaultEstimatedLifecycle}
        />
      );

      expect(screen.getByTestId('est-lifecycle--desktop'));
      expect(
        screen.queryByTestId('est-lifecycle--mobile')
      ).not.toBeInTheDocument();
    });

    it('adds up development total correctly', () => {
      render(
        <EstimatedLifecycleCostReview fiscalYear={2021} data={sampleData} />
      );
      const cost = screen.getByTestId('total-development-costs');
      within(cost).getByText('$25,000');
    });
  });

  describe('Mobile/Tablet', () => {
    beforeEach(() => {
      global.matchMedia = (media: string) => ({
        addListener: () => {},
        removeListener: () => {},
        matches: media === '(max-width: 768px)'
      });
    });

    it('renders the mobile view', () => {
      render(
        <EstimatedLifecycleCostReview
          fiscalYear={2021}
          data={defaultEstimatedLifecycle}
        />
      );
      expect(screen.getByTestId('est-lifecycle--mobile'));
      expect(
        screen.queryByTestId('est-lifecycle--desktop')
      ).not.toBeInTheDocument();
    });
  });
});
