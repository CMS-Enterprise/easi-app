import { FieldErrors } from 'react-hook-form';

/**
 * This function is used to flatten the error object from React Hook Forms
 * to the corresponding nested key and its error message.
 *
 * Does not return root errors
 */
const flattenFormErrors = (errors: FieldErrors): { [key: string]: string } => {
  // Exclude root errors
  const { root, ...fieldErrors } = errors;

  const entries = Object.entries(fieldErrors);

  // If no errors, return empty object
  if (Object.keys(errors).length === 0) return {};

  return entries.reduce((flatErrors, [fieldKey, fieldError]) => {
    if (!fieldError) return flatErrors;

    // If `fieldError` does not have nested fields, add message to object
    if ('message' in fieldError) {
      return {
        ...flatErrors,
        [fieldKey]: fieldError.message
      };
    }

    // Add nested subfield error messages to `flatErrors` object
    const subfieldErrors = Object.entries(fieldError).reduce(
      (acc, [subfieldKey, error]) => {
        return {
          ...acc,
          [`${fieldKey}.${subfieldKey}`]: error?.message
        };
      },
      flatErrors
    );

    return {
      ...flatErrors,
      ...subfieldErrors
    };
  }, {});
};

export default flattenFormErrors;
