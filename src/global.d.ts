import { Flags } from './types/flags';

declare module '@okta/okta-signin-widget';
declare module '@okta/okta-signin-widget/dist/js/okta-sign-in.min';
declare module '*.doc';
declare module '*.docx';
declare module 'launchdarkly-js-sdk-common' {
  export interface LDFlagSet extends Flags {}
}
interface Window {
  Cypress: any;
  store: any;
}
