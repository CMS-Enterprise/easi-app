import ValidationError from 'yup/lib/ValidationError';

import { extendLifecycleIdSchema } from './actionSchema';

describe('extend lifecycle ID schema', () => {
  it('should correctly validate a schema that is valid', () => {
    expect(() =>
      extendLifecycleIdSchema.validateSync({
        newExpirationMonth: '2',
        newExpirationDay: '15',
        newExpirationYear: '2023',
        newScope: 'A new scope',
        newNextSteps: 'Some new next steps'
      })
    ).not.toThrowError();
  });

  it('should throw a validation error when the month is not between 1 and 12', () => {
    expect(() =>
      extendLifecycleIdSchema.validateSync({
        newExpirationMonth: '-2',
        newExpirationDay: '15',
        newExpirationYear: '2023',
        newScope: 'A new scope',
        newNextSteps: 'Some new next steps'
      })
    ).toThrowError(new ValidationError('Enter a valid expiration date'));
  });

  it('should throw a validation error when the day is not a possible day in a month', () => {
    expect(() =>
      extendLifecycleIdSchema.validateSync({
        newExpirationMonth: '2',
        newExpirationDay: '150',
        newExpirationYear: '2023',
        newScope: 'A new scope',
        newNextSteps: 'Some new next steps'
      })
    ).toThrowError(new ValidationError('Enter a valid expiration date'));
  });

  it('should throw a validation error when an invalid year string is entered for the year', () => {
    expect(() =>
      extendLifecycleIdSchema.validateSync({
        newExpirationMonth: '2',
        newExpirationDay: '15',
        newExpirationYear: 'abcd',
        newScope: 'A new scope',
        newNextSteps: 'Some new next steps'
      })
    ).toThrowError(new ValidationError('Enter a valid expiration date'));
  });

  it('should throw a validation error when a new scope is missing', () => {
    expect(() =>
      extendLifecycleIdSchema.validateSync({
        newExpirationMonth: '2',
        newExpirationDay: '15',
        newExpirationYear: '2023',
        newScope: '',
        newNextSteps: 'Some new next steps'
      })
    ).toThrowError(new ValidationError('Please include a scope'));
  });

  it('should throw a validation error when next steps are not filled out', () => {
    expect(() =>
      extendLifecycleIdSchema.validateSync({
        newExpirationMonth: '2',
        newExpirationDay: '15',
        newExpirationYear: '2023',
        newScope: 'A new scope',
        newNextSteps: ''
      })
    ).toThrowError(new ValidationError('Please fill out next steps'));
  });
});
