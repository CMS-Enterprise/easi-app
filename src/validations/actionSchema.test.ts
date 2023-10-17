import { sharedLifecycleIdSchema } from './actionSchema';

describe('extend Life Cycle ID schema', () => {
  const defaultValues = {
    expirationDateDay: '15',
    expirationDateMonth: '2',
    expirationDateYear: '3023',
    nextSteps: 'Some new next steps',
    scope: 'A new scope'
  };

  it('validates and accepts entries', async () => {
    const result = await sharedLifecycleIdSchema
      .validate(defaultValues)
      .catch((err: any) => {
        return err;
      });
    expect(result.errors).toBeUndefined();
  });

  it('throws error for invalid month', async () => {
    const result = await sharedLifecycleIdSchema
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
    const result = await sharedLifecycleIdSchema
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
    const result = await sharedLifecycleIdSchema
      .validate({
        ...defaultValues,
        expirationDateYear: '123'
      })
      .catch((err: any) => {
        return err;
      });
    expect(result.errors).toEqual(['Date cannot be in the past']);
  });

  it('throws error for a valid date IN THE PAST', async () => {
    const result = await sharedLifecycleIdSchema
      .validate({
        ...defaultValues,
        expirationDateMonth: '2',
        expirationDateDay: '15',
        expirationDateYear: '2022'
      })
      .catch((err: any) => {
        return err;
      });
    expect(result.errors).toEqual(['Date cannot be in the past']);
  });

  it('throws error for a "negative" month', async () => {
    const result = await sharedLifecycleIdSchema
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
    const result = await sharedLifecycleIdSchema
      .validate({
        ...defaultValues,
        scope: ''
      })
      .catch((err: any) => {
        return err;
      });
    expect(result.errors).toEqual(['Please include a scope']);
  });

  it('throws error for empty next steps', async () => {
    const result = await sharedLifecycleIdSchema
      .validate({
        ...defaultValues,
        nextSteps: ''
      })
      .catch((err: any) => {
        return err;
      });
    expect(result.errors).toEqual(['Please fill out next steps']);
  });
});
