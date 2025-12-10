import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import {
  businessOwner,
  getSystemIntakeContactsQuery,
  systemIntake
} from 'tests/mock/systemIntake';

import { businessCaseInitialData } from 'data/businessCase';
import { BusinessCaseModel } from 'types/businessCase';
import VerboseMockedProvider from 'utils/testing/VerboseMockedProvider';

import ITGovAdminContext from '../../../../contexts/ITGovAdminContext/ITGovAdminContext';

import BusinessCaseReview from './index';

window.matchMedia = (): any => ({
  addListener: () => {},
  removeListener: () => {}
});

describe('The GRT Business Case review', () => {
  const mockBusinessCase: BusinessCaseModel = {
    ...businessCaseInitialData,
    id: '54e829a9-6ce3-4b4b-81b0-7781b1e22821',
    systemIntakeId: systemIntake.id,
    requestName: 'Easy Access to System Information',
    requester: {
      name: 'Jane Doe',
      phoneNumber: '1234567890'
    },
    businessOwner: {
      name: businessOwner.userAccount.commonName
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
      targetContractAwardDate: '2025-03-15T19:22:40Z',
      targetCompletionDate: '2025-03-15T19:22:40Z',
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
      zeroTrustAlignment: 'Mock Zero Trust',
      hosting: {
        type: 'Cloud',
        location: 'Mock location',
        cloudStrategy: 'Mock cloud strategy',
        cloudServiceType: 'Mock cloud service'
      },
      hasUserInterface: 'YES',
      workforceTrainingReqs: 'Mock workforce training requirements'
    }
  };

  it('matches the snapshot', async () => {
    const { asFragment } = render(
      <MemoryRouter>
        <VerboseMockedProvider mocks={[getSystemIntakeContactsQuery()]}>
          <BusinessCaseReview businessCase={mockBusinessCase} />
        </VerboseMockedProvider>
      </MemoryRouter>
    );

    expect(
      await screen.findByText(businessOwner.userAccount.commonName)
    ).toBeInTheDocument();

    expect(asFragment()).toMatchSnapshot();
  });

  it('Renders action button for GRT admins', async () => {
    render(
      <MemoryRouter>
        <VerboseMockedProvider mocks={[getSystemIntakeContactsQuery()]}>
          <ITGovAdminContext.Provider value>
            <BusinessCaseReview businessCase={mockBusinessCase} />
          </ITGovAdminContext.Provider>
        </VerboseMockedProvider>
      </MemoryRouter>
    );

    expect(
      await screen.findByText(businessOwner.userAccount.commonName)
    ).toBeInTheDocument();

    expect(
      screen.getByRole('link', { name: 'Take an action' })
    ).toBeInTheDocument();
  });
});
