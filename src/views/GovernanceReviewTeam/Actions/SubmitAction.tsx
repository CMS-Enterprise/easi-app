import React from 'react';

type SubmitActionProps = {
  action: string;
  actionName: string;
};

const SubmitAction = ({ action, actionName }: SubmitActionProps) => {
  return (
    <>
      <h1>{actionName}</h1>
      <p>Action: {action}</p>
    </>
  );
};

export default SubmitAction;
