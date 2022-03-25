import { extendLifecycleIdSchema } from './actionSchema';

describe('extend lifecycle ID schema', () => {
  const defaultValues = {
    expirationDateMonth: '2',
    expirationDateDay: '15',
    expirationDateYear: '2023',
    newScope: 'A new scope',
    newNextSteps: 'Some new next steps'
  };

  it('validates and accepts entries', async () => {
    const result = await extendLifecycleIdSchema
      .validate(defaultValues)
      .catch((err: any) => {
        return err;
      });
    expect(result.errors).toBeUndefined();
  });

  it('throws error for invalid month', async () => {
    const result = await extendLifecycleIdSchema
      .validate({
        ...defaultValues,
        expirationDateMonth: '123'
      })
      .catch((err: any) => {
        return err;
      });
    expect(result.errors).toEqual(['Please enter valid month']);
  });

  it('throws error for invalid day', async () => {
    const result = await extendLifecycleIdSchema
      .validate({
        ...defaultValues,
        expirationDateDay: '123'
      })
      .catch((err: any) => {
        return err;
      });
    expect(result.errors).toEqual(['Please enter valid day']);
  });

  it('throws error for year in the past', async () => {
    const result = await extendLifecycleIdSchema
      .validate({
        ...defaultValues,
        expirationDateYear: '123'
      })
      .catch((err: any) => {
        return err;
      });
    expect(result.errors).toEqual(['Date cannot be in the past']);
  });

  it('throws error for invalid month', async () => {
    const result = await extendLifecycleIdSchema
      .validate({
        ...defaultValues,
        expirationDateMonth: '-3'
      })
      .catch((err: any) => {
        return err;
      });
    expect(result.errors).toEqual(['Enter a valid expiration date']);
  });

  it('throws error for empty scope', async () => {
    const result = await extendLifecycleIdSchema
      .validate({
        ...defaultValues,
        newScope: ''
      })
      .catch((err: any) => {
        return err;
      });
    expect(result.errors).toEqual(['Please include a scope']);
  });

  it('throws error for empty next steps', async () => {
    const result = await extendLifecycleIdSchema
      .validate({
        ...defaultValues,
        newNextSteps: ''
      })
      .catch((err: any) => {
        return err;
      });
    expect(result.errors).toEqual(['Please fill out next steps']);
  });
});
