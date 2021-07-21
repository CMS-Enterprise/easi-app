import { DateTime } from 'luxon';

export interface AccessibilityRequestSchema {
  id: string;
  name: string;
  intakeID: string;
  createdAt: DateTime;
  updatedAt: DateTime;
  euaUserID: string;
  deletedAt?: DateTime;
  deletionReason?: string;
}

Cypress.Commands.add(
  'seedAccessibilityRequest',
  (
    options: AccessibilityRequestSchema
  ): Cypress.Chainable<AccessibilityRequestSchema> => {
    return cy
      .exec('scripts/seed_database accessibilityRequest', {
        env: {
          SEED_INPUT: JSON.stringify(options)
        }
      })
      .then(result => {
        Cypress.log({
          name: 'seedAccessibilityRequest',
          displayName: 'result',
          message: [result.stdout]
        });
        return JSON.parse(result.stdout);
      });
  }
);
