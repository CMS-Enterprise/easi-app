import React, { useState } from 'react';

import Header from 'components/Header';
import TextField from 'components/shared/TextField';
import TextAreaField from 'components/shared/TextAreaField';
import CheckboxField from 'components/shared/CheckboxField';
import RadioField from 'components/shared/RadioField';
import { DropdownField, DropdownItem } from 'components/shared/DropdownField';

// This view can be deleted whenever we're ready
// This is just a sandbox page for us to test things out

const Sandbox = () => {
  const [demoInput, setDemoInput] = useState('');
  const [textarea, setTextarea] = useState('');

  return (
    <div>
      <Header />
      <div className="grid-container">
        <h1>Sandbox</h1>
        <TextField
          id="IntakeForm-ProjectName"
          name="Project Name"
          label="Project Name"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setDemoInput(e.target.value);
          }}
          onBlur={() => {
            console.log('Blurred');
          }}
          value={demoInput}
        />
        <TextField
          id="IntakeForm-ProjectAcronym"
          name="Project Acronym"
          label="Project Acronym"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setDemoInput(e.target.value);
          }}
          onBlur={() => {
            console.log('Blurred');
          }}
          value={demoInput}
        />
        <TextAreaField
          id="DemoTextarea"
          name="Demo Textarea"
          label="Demo Textarea"
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
            setTextarea(e.target.value);
          }}
          onBlur={() => {
            console.log('Blurred');
          }}
          value={textarea}
        />
        <div
          style={{
            marginTop: '1.5rem'
          }}
        >
          <CheckboxField
            id="SystemFruit-Apple"
            label="Apple"
            name="SystemFruit"
            onBlur={() => {}}
            onChange={() => {}}
            value="Apple"
          />
          <CheckboxField
            id="SystemFruit-Banana"
            label="Banana"
            name="SystemFruit"
            onBlur={() => {}}
            onChange={() => {}}
            value="Banana"
          />
          <CheckboxField
            id="SystemFruit-Pear"
            label="Pear"
            name="SystemFruit"
            onBlur={() => {}}
            onChange={() => {}}
            value="Pear"
          />
        </div>

        <div
          style={{
            marginTop: '1.5rem'
          }}
        >
          <RadioField
            id="Radio-A"
            label="A"
            name="RadioTest"
            onBlur={() => {}}
            onChange={() => {}}
            value="A"
          />
          <RadioField
            id="Radio-B"
            label="B"
            name="RadioTest"
            onBlur={() => {}}
            onChange={() => {}}
            value="B"
          />
          <RadioField
            id="Radio-C"
            label="C"
            name="RadioTest"
            onBlur={() => {}}
            onChange={() => {}}
            value="C"
          />
          <RadioField
            id="Radio-D"
            label="D"
            name="RadioTest"
            onBlur={() => {}}
            onChange={() => {}}
            value="D"
          />
        </div>
        <DropdownField id="TestDropdown" label="Favorite Fruit">
          <DropdownItem name="Apple" value="1" />
          <DropdownItem name="Orange" value="2" />
          <DropdownItem name="Pear" value="3" />
          <DropdownItem name="Mango" value="4" />
        </DropdownField>
      </div>
    </div>
  );
};

export default Sandbox;
