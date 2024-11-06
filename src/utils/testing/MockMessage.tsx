import React from 'react';

import useMessage from 'hooks/useMessage';

export default function MockMessage() {
  const { Message } = useMessage();
  return <Message />;
}
