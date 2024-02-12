import { gql } from '@apollo/client';

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
  mutation UpdateSystemIntakeContractDetails(
    $input: UpdateSystemIntakeContractDetailsInput!
  ) {
    updateSystemIntakeContractDetails(input: $input) {
      systemIntake {
        id
        currentStage
        fundingSources {
          source
          fundingNumber
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
          number
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

export const SubmitIntake = gql`
  mutation SubmitIntake($input: SubmitIntakeInput!) {
    submitIntake(input: $input) {
      systemIntake {
        id
      }
    }
  }
`;
