import { gql } from '@apollo/client';

export const CreateSystemIntake = gql(/* GraphQL */ `
  mutation CreateSystemIntake($input: CreateSystemIntakeInput!) {
    createSystemIntake(input: $input) {
      id
      requestType
      requester {
        name
      }
    }
  }
`);

export const UpdateSystemIntakeContractDetails = gql(/* GraphQL */ `
  mutation UpdateSystemIntakeContractDetails(
    $input: UpdateSystemIntakeContractDetailsInput!
  ) {
    updateSystemIntakeContractDetails(input: $input) {
      systemIntake {
        id
        currentStage
        fundingSources {
          ...FundingSourceFragment
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
`);
export const UpdateSystemIntakeRequestDetails = gql(/* GraphQL */ `
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
        usingSoftware
        acquisitionMethods
      }
    }
  }
`);

export const UpdateSystemIntakeContactDetails = gql(/* GraphQL */ `
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
`);

export const UpdateSystemIntakeRequestType = gql(/* GraphQL */ `
  mutation UpdateSystemIntakeRequestType(
    $id: UUID!
    $requestType: SystemIntakeRequestType!
  ) {
    updateSystemIntakeRequestType(id: $id, newType: $requestType) {
      id
    }
  }
`);

export const SubmitIntake = gql(/* GraphQL */ `
  mutation SubmitIntake($input: SubmitIntakeInput!) {
    submitIntake(input: $input) {
      systemIntake {
        id
      }
    }
  }
`);
