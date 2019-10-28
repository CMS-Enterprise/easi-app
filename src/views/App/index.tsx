import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateDemoName } from 'actions/templateActions';

const Main: React.FC = () => {
  const demoName = useSelector((state: any) => state.demoName);
  const dispatch = useDispatch();
  const updateName = (event: React.ChangeEvent<HTMLInputElement>): void => {
    dispatch(updateDemoName(event.target.value));
  };

  return (
    <div>
      <h1>Hello World</h1>
      <label htmlFor="demoName">Demo Name Field</label>
      <input
        type="text"
        name="demoName"
        value={demoName.name}
        onChange={updateName}
      />

      <p>{`My Name is ${demoName.name}`}</p>
    </div>
  );
};

export default Main;
