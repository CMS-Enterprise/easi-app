import React, { useState } from 'react';

import Pager from './Pager';
import { FormStepComponentProps } from '.';

function Basic({ request, stepUrl }: FormStepComponentProps) {
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
          url: stepUrl.next,
          disabled: !done
        }}
      />
    </>
  );
}

export default Basic;
