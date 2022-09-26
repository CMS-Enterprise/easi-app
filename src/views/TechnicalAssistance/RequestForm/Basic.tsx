import React, { useState } from 'react';

import Pager from './Pager';
import { FormStepComponentProps } from '.';

function Basic({ request, step }: FormStepComponentProps) {
  const [done, setDone] = useState<boolean>(false);

  return (
    <>
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
          url: `/trb/requests/${request.id}/${step + 1}`,
          disabled: !done
        }}
      />
    </>
  );
}

export default Basic;
