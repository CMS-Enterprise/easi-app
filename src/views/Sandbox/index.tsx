import React from 'react';

import Header from 'components/Header';
import TextField from 'components/shared/TextField';

const Sandbox = () => {
  return (
    <div>
      <Header />
      <div className="grid-container">
        <h1>Sandbox</h1>
        <div
          style={{
            display: 'flex'
          }}
        >
          <TextField
            name=""
            id=""
            onChange={() => {}}
            onBlur={() => {}}
            value=""
          />
          <span
            style={{
              backgroundColor: 'black',
              width: '2.5rem',
              color: 'white',
              textAlign: 'center',
              lineHeight: '40px'
            }}
          >
            %
          </span>
        </div>
      </div>
    </div>
  );
};

export default Sandbox;
