import React from 'react';

type BackNextButtonsProps = {
  pageNum: number;
  totalPages: number;
  setPage: (func: any) => void;
  onSubmit: (data: any) => void;
};

const BackNextButtons = ({
  pageNum,
  totalPages,
  setPage,
  onSubmit
}: BackNextButtonsProps) => (
  <>
    {pageNum > 1 && (
      <button
        aria-label="Back"
        className="usa-button usa-button--outline"
        onClick={() => {
          setPage((page: number) => page - 1);
        }}
        type="button"
      >
        Back
      </button>
    )}

    {pageNum < totalPages && (
      <button
        aria-label="Next"
        className="usa-button"
        type="button"
        onClick={() => {
          setPage((page: number) => page + 1);
        }}
      >
        Next
      </button>
    )}

    {pageNum === totalPages && (
      <button
        aria-label="Review and Send"
        className="usa-button"
        onClick={onSubmit}
        type="button"
      >
        Review & Send
      </button>
    )}
  </>
);

export default BackNextButtons;
