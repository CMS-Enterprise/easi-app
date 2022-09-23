import React, { useState } from 'react';

import Pager from './Pager';
import { FormStepComponentProps } from '.';

function Basic({ request, step }: FormStepComponentProps) {
  const [done, setDone] = useState<boolean>(false);
  console.log(done);
  return (
    <>
      {/* <label>Request name</label> */}
      <input
        type="text"
        value={request.name}
        onChange={e => {
          setDone(true);
          console.log(e.target.value);
        }}
      />

      <Pager
        next={{
          url: `/trb/requests/${request.id}/${step + 1}`
        }}
        nextDisabled={!done}
      />
    </>
  );
}

export default Basic;
