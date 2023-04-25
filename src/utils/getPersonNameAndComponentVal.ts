export default function getPersonNameAndComponentVal(
  name: string,
  component?: any
) {
  return `${name}${typeof component === 'string' ? `, ${component}` : ''}`;
}
