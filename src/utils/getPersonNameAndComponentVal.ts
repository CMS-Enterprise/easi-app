export default function getPersonNameAndComponentVal(
  name: string,
  component?: any
) {
  if (name.length === 0) {
    return '';
  }

  return `${name}${typeof component === 'string' ? `, ${component}` : ''}`;
}
