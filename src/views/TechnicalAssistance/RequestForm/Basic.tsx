import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

import Pager from './Pager';
import { FormStepComponentProps } from '.';

function Basic({ request, stepUrl }: FormStepComponentProps) {
  const [done, setDone] = useState<boolean>(false);
  const history = useHistory();

  return (
    <form
      onSubmit={() => {
        history.push(stepUrl.next);
      }}
    >
      {/* <label>Request name</label> */}
      <input
        type="text"
        value={request.name}
        onChange={e => {
          setDone(true);
        }}
      />

      <Pager
        next={{
          type: 'submit',
          disabled: !done
        }}
      />
    </form>
  );
}

export default Basic;
