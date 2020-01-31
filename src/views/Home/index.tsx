import React, { useEffect, useState } from 'react';
import { withAuth } from '@okta/okta-react';
import axios from 'axios';

import useAuth from 'hooks/useAuth';
import Header from 'components/Header';
import TextField from 'components/shared/TextField';
import TextareaField from 'components/shared/TextareaField';
import CheckboxField from 'components/shared/CheckboxField';
import RadioField from 'components/shared/RadioField';

type HomeProps = {
  auth: any;
};

const Home = ({ auth }: HomeProps) => {
  const [isAuthenticated] = useAuth(auth);
  const [name, setName] = useState('');
  const [demoInput, setDemoInput] = useState('');
  const [textarea, setTextarea] = useState('');
  const getEmailAddress = async (): Promise<void> => {
    const accessToken = await auth.getAccessToken();
    await axios
      .get('http://localhost:8080', {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })
      .then(res => {
        return res.data;
      })
      .then(data => {
        setName(data.SystemOwners[0]);
      })
      .catch(error => {
        // eslint-disable-next-line no-console
        console.log(error);
      });
  };

  // Notably, we need deps to be nil if we'd like to use this hook to
  // effectively be ComponentDidMount

  useEffect(() => {
    getEmailAddress();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div>
      <Header />
      <div className="grid-container">
        <h1>Home</h1>
        <h3>{`A user is ${isAuthenticated ? '' : 'NOT'} authenticated`}</h3>
        <h3>Here is an email address fetched from the server</h3>
        <h3>{name}</h3>
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
    </div>
  );
};

export default withAuth(Home);
