/**
 * This function is used to flatten the error object from Fromik/Yup
 * to the corresponding nested key and its error message.
 */

const flattedErrors = (
  errors: any,
  flattenedErrors: any = {},
  flatKey = ''
): { [key: string]: string } => {
  const errorKeys = Object.keys(errors);
  if (errorKeys.length === 0) {
    return {};
  }
  errorKeys.forEach(key => {
    if (typeof errors[key] === 'string') {
      const newErrorKey = flatKey ? `${flatKey}.${key}` : key;
      // eslint-disable-next-line no-param-reassign
      flattenedErrors[newErrorKey] = errors[key];
    }

    if (errors[key] instanceof Object) {
      const newErrorKey = flatKey ? `${flatKey}.${key}` : key;
      flattedErrors(errors[key], flattenedErrors, newErrorKey);
    }
  });
  return flattenedErrors;
};

export default flattedErrors;
