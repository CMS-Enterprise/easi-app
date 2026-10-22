// load type definitions that come with Cypress module
/// <reference types="cypress" />

declare module 'cypress-otp' {
  const generateOTP: (secret?: string) => string;

  export default generateOTP;
}



declare namespace Cypress {}
