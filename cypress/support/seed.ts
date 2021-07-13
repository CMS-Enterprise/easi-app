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
      .exec('go run cmd/seed/main.go accessibilityRequest', {
        env: {
          SEED_INPUT: JSON.stringify(options)
        }
      })
      .then(result => {
        return JSON.parse(result.stdout);
      });
  }
);
