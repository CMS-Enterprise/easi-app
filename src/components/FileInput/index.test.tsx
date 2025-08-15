import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import FileInput from '.';

describe('FileInput component', () => {
  it('renders file upload field', () => {
    render(
      <FileInput
        name="fileUpload"
        id="fileUpload"
        onChange={() => {}}
        onPointerOverCapture={() => {}}
        onPointerMoveCapture={() => {}}
      />
    );

    expect(screen.getByTestId('file-input-input')).toBeInTheDocument();
  });

  it('renders field with default filename', () => {
    render(
      <FileInput
        name="fileUpload"
        id="fileUpload"
        defaultFileName="test.pdf"
        onChange={() => {}}
        onPointerOverCapture={() => {}}
        onPointerMoveCapture={() => {}}
      />
    );

    expect(
      screen.getByRole('button', { name: 'Clear file' })
    ).toBeInTheDocument();

    expect(screen.getByText('test.pdf')).toBeInTheDocument();
  });

  it('clears default filename', async () => {
    render(
      <FileInput
        name="fileUpload"
        id="fileUpload"
        defaultFileName="test.pdf"
        onChange={() => {}}
        onPointerOverCapture={() => {}}
        onPointerMoveCapture={() => {}}
      />
    );

    const user = userEvent.setup();

    const clearButton = screen.getByRole('button', { name: 'Clear file' });
    await user.click(clearButton);

    // File upload input should render after clearing default
    expect(await screen.findByTestId('file-input-input')).toBeInTheDocument();
  });
});
