import React from 'react';
import { render, waitFor } from '@testing-library/react';

import AutoSave from './index';

describe('The Autosave component', () => {
  it('does not fire onSave on initial load', () => {
    const onSave = vi.fn();
    render(<AutoSave values={{}} onSave={onSave} debounceDelay={0} />);
    expect(onSave).not.toHaveBeenCalled();
  });

  it('fires onSave when values changed', async () => {
    const onSave = vi.fn();
    const { rerender } = render(
      <AutoSave
        values={{ name: 'fake name' }}
        onSave={onSave}
        debounceDelay={100}
      />
    );
    rerender(
      <AutoSave
        values={{ name: 'another name' }}
        onSave={onSave}
        debounceDelay={100}
      />
    );
    await waitFor(() => expect(onSave).toHaveBeenCalledTimes(1));
  });
});
