import { Flags } from './types/flags';

declare module '@okta/okta-signin-widget';
declare module '@okta/okta-signin-widget/dist/js/okta-sign-in.min';
declare module '*.doc';
declare module '*.docx';
declare module 'launchdarkly-js-sdk-common' {
  export interface LDFlagSet extends Flags {}
}

declare global {
  /*~ Here, declare things that go in the global namespace, or augment
   *~ existing declarations in the global namespace
   */
   type UUID = string;

   type Time = string;

   interface Window {
    Cypress: any;
    store: any;
  }
}
