import React, { useState } from 'react';
import Header from 'components/Header';
import Modal from 'components/Modal';
import Button from 'components/shared/Button';

// This view can be deleted whenever we're ready
// This is just a sandbox page for us to test things out

const Sandbox = () => {
  const [isModalOpen, setModalOpen] = useState(false);

  return (
    <div>
      <Header />
      <div className="grid-container">
        <button type="button" onClick={() => setModalOpen(true)}>
          Open modal
        </button>
        {/* So we can test that it doesn't scroll when modal open */}
        <h1>Sandbox</h1>
        <h1>Sandbox</h1>
        <h1>Sandbox</h1>
        <h1>Sandbox</h1>
        <h1>Sandbox</h1>
        <h1>Sandbox</h1>
        <h1>Sandbox</h1>
        <h1>Sandbox</h1>
        <h1>Sandbox</h1>
        <h1>Sandbox</h1>
        <h1>Sandbox</h1>
        <h1>Sandbox</h1>
        <h1>Sandbox</h1>
        <h1>Sandbox</h1>
        <h1>Sandbox</h1>
        <h1>Sandbox</h1>
        <h1>Sandbox</h1>
        <Modal
          title="EASi"
          isOpen={isModalOpen}
          closeModal={() => setModalOpen(false)}
        >
          <h1 style={{ margin: 0 }}>
            Your access to EASi is about to expire in 5 minutes
          </h1>
          <p>Your data has already been saved.</p>
          <p>
            If you do not do anything on this page you will be signed out in 5
            minutes and will need to sign back in. We do this to keep your
            information secure.
          </p>
          <Button type="button" onClick={() => setModalOpen(false)}>
            Return to EASi
          </Button>
        </Modal>
      </div>
    </div>
  );
};

export default Sandbox;
