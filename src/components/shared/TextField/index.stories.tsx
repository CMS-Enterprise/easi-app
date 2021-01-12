import React from 'react';

import HelpText from 'components/shared/HelpText';
import Label from 'components/shared/Label';

import TextField from './index';

export default {
  title: 'Text Field',
  component: TextField
};

export const Default = () => (
  <TextField
    id="Test1"
    name="Test1"
    onChange={() => {}}
    onBlur={() => {}}
    value=""
  />
);

export const WithLabel = () => (
  <>
    <Label htmlFor="FirstName">First Name</Label>
    <TextField
      id="FirstName"
      name="firstName"
      onChange={() => {}}
      onBlur={() => {}}
      value=""
    />
  </>
);

export const WithLabelAndHelpText = () => (
  <>
    <Label htmlFor="FirstName">First Name</Label>
    <HelpText id="FirstNameHelp">
      <span>Please provide only your first name</span>
    </HelpText>
    <TextField
      id="FirstName"
      name="firstName"
      aria-describedby="FirstNameHelp"
      onChange={() => {}}
      onBlur={() => {}}
      value=""
    />
  </>
);
