import React, { useState } from 'react';

import HelpText from 'components/shared/HelpText';
import Label from 'components/shared/Label';

import TextField from './index';

export default {
  title: 'Text Field',
  component: TextField
};

export const Default = () => {
  const [value, setValue] = useState('');
  return (
    <TextField
      id="Test1"
      name="Test1"
      onChange={e => setValue(e.target.value)}
      onBlur={() => {}}
      value={value}
    />
  );
};

export const WithLabel = () => {
  const [value, setValue] = useState('');
  return (
    <>
      <Label htmlFor="FirstName">First Name</Label>
      <TextField
        id="FirstName"
        name="firstName"
        onChange={e => setValue(e.target.value)}
        onBlur={() => {}}
        value={value}
      />
    </>
  );
};

export const WithLabelAndHelpText = () => {
  const [value, setValue] = useState('');
  return (
    <>
      <Label htmlFor="FirstName">First Name</Label>
      <HelpText id="FirstNameHelp">
        <span>Please provide only your first name</span>
      </HelpText>
      <TextField
        id="FirstName"
        name="firstName"
        aria-describedby="FirstNameHelp"
        onChange={e => setValue(e.target.value)}
        onBlur={() => {}}
        value={value}
      />
    </>
  );
};
