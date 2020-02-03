import React, { useState } from 'react';

import Header from 'components/Header';
import TextField from 'components/shared/TextField';
import TextareaField from 'components/shared/TextareaField';
import CheckboxField from 'components/shared/CheckboxField';
import RadioField from 'components/shared/RadioField';
import { DropdownField, DropdownItem } from 'components/shared/DropdownField';

// This view can be deleted whenever we're ready
// This is just a sandbox page for us to test things out
const Home = () => {
  const [demoInput, setDemoInput] = useState('');
  const [textarea, setTextarea] = useState('');

  return (
    <div>
      <Header />
      <div className="grid-container">
        <h1>Sandbox</h1>
        <TextField
          id="DemoField"
          name="Demo Input"
          label="Demo Input"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setDemoInput(e.target.value);
          }}
          onBlur={() => {
            console.log('Blurred');
          }}
          value={demoInput}
        />
        <TextareaField
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
          <DropdownItem value="1">Apple</DropdownItem>
          <DropdownItem value="1">Orange</DropdownItem>
          <DropdownItem value="1">Pear</DropdownItem>
          <DropdownItem value="1">Mango</DropdownItem>
        </DropdownField>
      </div>
    </div>
  );
};

export default Home;
