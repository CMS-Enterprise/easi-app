import { SystemIntakeContactComponent } from 'gql/generated/graphql';
import i18next from 'i18next';

import {
  ComponentData,
  getComponentByEnum,
  getComponentByName
} from 'constants/cmsComponentsMap';

function isComponentEnum(
  component: string | SystemIntakeContactComponent
): component is SystemIntakeContactComponent {
  return Object.values(SystemIntakeContactComponent).includes(
    component as SystemIntakeContactComponent
  );
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
  if (!name) return '';

  if (!component) return name;

  let componentObject: ComponentData | undefined;

  if (isComponentEnum(component)) {
    componentObject = getComponentByEnum(component);
  } else {
    componentObject = getComponentByName(component);
  }

  const { acronym, labelKey } = componentObject || {};

  const componentString = labelKey ? i18next.t(labelKey) : component;

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
