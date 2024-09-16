import { gql } from '@apollo/client';

import { FundingSource } from './GetSystemIntakeQuery';

// eslint-disable-next-line import/prefer-default-export
export const CreateSystemIntake = gql`
  mutation CreateSystemIntake($input: CreateSystemIntakeInput!) {
    createSystemIntake(input: $input) {
      id
      requestType
      requester {
        name
      }
    }
  }
`;

export const UpdateSystemIntakeContractDetails = gql`
  ${FundingSource}
  mutation UpdateSystemIntakeContractDetails(
    $input: UpdateSystemIntakeContractDetailsInput!
  ) {
    updateSystemIntakeContractDetails(input: $input) {
      systemIntake {
        id
        currentStage
        fundingSources {
          ...FundingSource
        }
        costs {
          expectedIncreaseAmount
        }
        annualSpending {
          currentAnnualSpending
          currentAnnualSpendingITPortion
          plannedYearOneSpending
          plannedYearOneSpendingITPortion
        }
        contract {
          contractor
          endDate {
            day
            month
            year
          }
          hasContract
          startDate {
            day
            month
            year
          }
        }
        contractNumbers {
          id
          systemIntakeID
          contractNumber
        }
      }
    }
  }
`;
export const UpdateSystemIntakeRequestDetails = gql`
  mutation UpdateSystemIntakeRequestDetails(
    $input: UpdateSystemIntakeRequestDetailsInput!
  ) {
    updateSystemIntakeRequestDetails(input: $input) {
      systemIntake {
        id
        requestName
        businessNeed
        businessSolution
        needsEaSupport
        hasUiChanges
        usesAiTech
        softwareAcquisition {
          usingSoftware
          acquisitionMethods
        }
      }
    }
  }
`;

export const UpdateSystemIntakeContactDetails = gql`
  mutation UpdateSystemIntakeContactDetails(
    $input: UpdateSystemIntakeContactDetailsInput!
  ) {
    updateSystemIntakeContactDetails(input: $input) {
      systemIntake {
        id
        businessOwner {
          component
          name
        }
        governanceTeams {
          isPresent
          teams {
            acronym
            collaborator
            key
            label
            name
          }
        }
        isso {
          isPresent
          name
        }
        productManager {
          component
          name
        }
        requester {
          component
          name
        }
      }
    }
  }
`;

export const UpdateSystemIntakeRequestType = gql`
  mutation UpdateSystemIntakeRequestType(
    $id: UUID!
    $requestType: SystemIntakeRequestType!
  ) {
    updateSystemIntakeRequestType(id: $id, newType: $requestType) {
      id
    }
  }
`;

export const SubmitIntake = gql`
  mutation SubmitIntake($input: SubmitIntakeInput!) {
    submitIntake(input: $input) {
      systemIntake {
        id
      }
    }
  }
`;
