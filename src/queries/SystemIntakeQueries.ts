import { gql } from '@apollo/client';

// eslint-disable-next-line import/prefer-default-export
export const CreateSystemIntake = gql`
  mutation CreateSystemIntake($input: CreateSystemIntakeInput!) {
    createSystemIntake(input: $input) {
      id
      status
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
        fundingSource {
          fundingNumber
          isFunded
          source
        }
        costs {
          expectedIncreaseAmount
          isExpectingIncrease
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
          vehicle
        }
      }
    }
  }
`;
