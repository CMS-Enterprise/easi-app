import {
  FieldError,
  FieldErrors,
  FieldPath,
  FieldValues
} from 'react-hook-form';

/** Flattened form errors */
type FlatErrors<TFieldValues extends FieldValues = FieldValues> = Partial<
  Record<FieldPath<TFieldValues>, string>
>;

/** Checks if error is single `FieldError` type */
function isFieldError(
  error: FieldError | FieldErrors | Array<FieldErrors>
): error is FieldError {
  return (error as FieldError)?.message !== undefined;
}

/** Flattens nested subfield errors */
const flattenSubfieldErrors = (
  key: string,
  errors: FieldErrors | Array<FieldErrors>,
  flatErrors: FlatErrors = {}
): FlatErrors => {
  if (!errors) return flatErrors;

  // Flatten array field type errors
  if (Array.isArray(errors)) {
    return flattenArrayFieldErrors(key, errors, flatErrors);
  }

  const entries = Object.entries(errors) as [
    string,
    FieldError | FieldErrors
  ][];

  return entries.reduce<FlatErrors>((acc, [errorKey, error]) => {
    if (!error) return flatErrors;

    // Flatten array field type errors
    if (Array.isArray(error)) {
      return flattenArrayFieldErrors(`${key}.${errorKey}`, error, flatErrors);
    }

    /** Flatten any additional subfields */
    if (!isFieldError(error)) {
      return flattenSubfieldErrors(`${key}.${errorKey}`, error, flatErrors);
    }

    return flattenFieldError(`${key}.${errorKey}`, error, acc);
  }, flatErrors);
};

/** Flattens single field errors */
const flattenFieldError = (
  key: string,
  error: FieldError,
  flatErrors: FlatErrors = {}
): FlatErrors => {
  if (!error.message) return flatErrors;

  return {
    ...flatErrors,
    [key]: error.message
  };
};

/** Flattens array type field errors */
const flattenArrayFieldErrors = (
  key: string,
  errors: Array<FieldErrors>,
  flatErrors: FlatErrors = {}
): FlatErrors => {
  return errors.reduce<FlatErrors>((acc, fieldErrors, index) => {
    return flattenSubfieldErrors(`${key}.${index}`, fieldErrors, acc);
  }, flatErrors);
};

/**
 * This function is used to flatten the error object from React Hook Forms
 * to the corresponding field key and its error message.
 *
 * Does not return root errors
 */
const flattenFormErrors = <TFieldValues extends FieldValues = FieldValues>({
  root,
  ...errors
}: FieldErrors): FlatErrors<TFieldValues> => {
  // If no errors, return empty object
  if (!errors) return {};

  const errorEntries = Object.entries(errors) as Array<
    [string, FieldError | FieldErrors]
  >;

  return errorEntries.reduce<FlatErrors<TFieldValues>>(
    (flatErrors, [fieldKey, fieldError]) => {
      // If no subfields, flatten error
      if (isFieldError(fieldError)) {
        return flattenFieldError(fieldKey, fieldError, flatErrors);
      }

      // Flatten subfield errors
      return flattenSubfieldErrors(fieldKey, fieldError, flatErrors);
    },
    {}
  );
};

export default flattenFormErrors;
