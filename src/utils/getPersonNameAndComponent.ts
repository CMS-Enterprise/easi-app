import { getAcronymForComponent } from './systemIntake';

export const getPersonNameAndComponentAcronym = (
  name: string,
  component?: string | null
): string => {
  if (name.length === 0) {
    return '';
  }

  if (!component) return name;

  return `${name}, ${getAcronymForComponent(component)}`;
};

export const getPersonNameAndComponentVal = (
  name: string,
  component?: any
): string => {
  if (name.length === 0) {
    return '';
  }

  return `${name}${typeof component === 'string' ? `, ${component}` : ''}`;
};
