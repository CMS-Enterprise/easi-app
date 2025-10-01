import { SystemIntakeContactComponent } from 'gql/generated/graphql';

import cmsComponentsMap from 'constants/cmsComponentsMap';

function isComponentEnum(
  component: string | SystemIntakeContactComponent
): component is SystemIntakeContactComponent {
  return component in cmsComponentsMap;
}

/**
 * Returns formatted string with name and component acronym
 * (or component name if no acronym exists)
 *
 * @example
 * getPersonNameAndComponentAcronym('John Doe', 'CMS Wide') // 'John Doe, CMS'
 * getPersonNameAndComponentAcronym('John Doe', 'CMS_WIDE') // 'John Doe, CMS'
 * getPersonNameAndComponentAcronym('John Doe', 'Other') // 'John Doe, Other'
 * getPersonNameAndComponentAcronym('John Doe') // 'John Doe'
 */
export const getPersonNameAndComponentAcronym = (
  name: string,
  component?: SystemIntakeContactComponent | string | null
): string => {
  if (name.length === 0) {
    return '';
  }

  if (!component) return name;

  let acronym: string | undefined;
  let componentString: string = component;

  // Get acronym and component name (if prop is an enum) from cmsComponentsMap
  if (isComponentEnum(component)) {
    const componentObject = cmsComponentsMap[component];
    acronym = componentObject.acronym;
    componentString = componentObject.name;
  } else {
    acronym = Object.values(cmsComponentsMap).find(
      val => val.name === component
    )?.acronym;
  }

  return `${name}, ${acronym || componentString}`;
};

/**
 * Returns formatted string with name and component (if provided)
 *
 * @example
 * getPersonNameAndComponentVal('John Doe', 'CCSQ') // 'John Doe, CCSQ'
 * getPersonNameAndComponentVal('John Doe') // 'John Doe'
 */
export const getPersonNameAndComponentVal = (
  name: string,
  component?: string | null
): string => {
  if (name.length === 0) {
    return '';
  }

  if (!component) return name;

  return `${name}, ${component}`;
};
