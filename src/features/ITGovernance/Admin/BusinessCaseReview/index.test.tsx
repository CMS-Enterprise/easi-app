import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';

import { businessCaseInitialData } from 'data/businessCase';
import { BusinessCaseModel } from 'types/businessCase';

import ITGovAdminContext from '../ITGovAdminContext';

import BusinessCaseReview from './index';

window.matchMedia = (): any => ({
  addListener: () => {},
  removeListener: () => {}
});

describe('The GRT Business Case review', () => {
  const mockBusinessCase: BusinessCaseModel = {
    ...businessCaseInitialData,
    id: '54e829a9-6ce3-4b4b-81b0-7781b1e22821',
    systemIntakeId: 'c9dcaca2-c500-45ae-96ce-a4ae527b4c8a',
    requestName: 'Easy Access to System Information',
    requester: {
      name: 'Jane Doe',
      phoneNumber: '1234567890'
    },
    businessOwner: {
      name: 'Jane Doe'
    },
    businessNeed: 'Mock business need',
    cmsBenefit: 'Mock CMS benefit',
    currentSolutionSummary: 'Mock current solution summary',
    priorityAlignment: 'Mock priority alignment',
    successIndicators: 'Mock success indicators',
    preferredSolution: {
      title: 'Mock Preferred solution',
      summary: 'Mock Preferred solution summary',
      acquisitionApproach: 'Mock acquisition approach',
      pros: 'Mock Preferred solution pros',
      cons: 'Mock Preferred solution cons',
      estimatedLifecycleCost: {
        development: {
          label: 'Development',
          type: 'primary',
          isPresent: true,
          years: {
            year1: '1000',
            year2: '',
            year3: '',
            year4: '',
            year5: ''
          }
        },
        operationsMaintenance: {
          label: 'Operations and Maintenance',
          type: 'primary',
          isPresent: false,
          years: {
            year1: '',
            year2: '',
            year3: '',
            year4: '',
            year5: ''
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
          isPresent: false,
          years: {
            year1: '',
            year2: '',
            year3: '',
            year4: '',
            year5: ''
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
      },
      costSavings: 'Mock cost savings',
      security: {
        isApproved: false,
        isBeingReviewed: 'YES'
      },
      hosting: {
        type: 'Cloud',
        location: 'Mock location',
        cloudServiceType: 'Mock cloud service'
      },
      hasUserInterface: 'YES'
    }
  };

  it('matches the snapshot', () => {
    const { asFragment } = render(
      <MemoryRouter>
        <BusinessCaseReview businessCase={mockBusinessCase} />
      </MemoryRouter>
    );

    expect(asFragment()).toMatchSnapshot();
  });

  it('Renders action button for GRT admins', () => {
    render(
      <MemoryRouter>
        <ITGovAdminContext.Provider value>
          <BusinessCaseReview businessCase={mockBusinessCase} />
        </ITGovAdminContext.Provider>
      </MemoryRouter>
    );

    expect(
      screen.getByRole('link', { name: 'Take an action' })
    ).toBeInTheDocument();
  });
});
