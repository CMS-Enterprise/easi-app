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

  try {
    extendLifecycleIdSchema.validateSync({
      newExpirationMonth: '-2',
      newExpirationDay: '15',
      newExpirationYear: '2023',
      newScope: 'A new scope',
      newNextSteps: 'Some new next steps'
    });
    throw new Error('Should not validate successfully');
  } catch (err) {
    expect(err).toBeInstanceOf(ValidationError);
    expect((err as ValidationError).path).toBe('validDate');
  }

  try {
    extendLifecycleIdSchema.validateSync({
      newExpirationMonth: '2',
      newExpirationDay: '150',
      newExpirationYear: '2023',
      newScope: 'A new scope',
      newNextSteps: 'Some new next steps'
    });
    throw new Error('Should not validate successfully');
  } catch (err) {
    expect(err).toBeInstanceOf(ValidationError);
    expect((err as ValidationError).path).toBe('validDate');
  }

  try {
    extendLifecycleIdSchema.validateSync({
      newExpirationMonth: '2',
      newExpirationDay: '15',
      newExpirationYear: 'abcd',
      newScope: 'A new scope',
      newNextSteps: 'Some new next steps'
    });
    throw new Error('Should not validate successfully');
  } catch (err) {
    expect(err).toBeInstanceOf(ValidationError);
    expect((err as ValidationError).path).toBe('validDate');
  }

  try {
    extendLifecycleIdSchema.validateSync({
      newExpirationMonth: '2',
      newExpirationDay: '15',
      newExpirationYear: '2023',
      newScope: '',
      newNextSteps: 'Some new next steps'
    });
    throw new Error('Should not validate successfully');
  } catch (err) {
    expect(err).toBeInstanceOf(ValidationError);
    expect((err as ValidationError).path).toBe('newScope');
  }

  try {
    extendLifecycleIdSchema.validateSync({
      newExpirationMonth: '2',
      newExpirationDay: '15',
      newExpirationYear: '2023',
      newScope: 'A new scope',
      newNextSteps: ''
    });
    throw new Error('Should not validate successfully');
  } catch (err) {
    expect(err).toBeInstanceOf(ValidationError);
    expect((err as ValidationError).path).toBe('newNextSteps');
  }
});
