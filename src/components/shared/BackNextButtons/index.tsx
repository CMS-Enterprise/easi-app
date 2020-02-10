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
        type="button"
        className="usa-button"
        onClick={() => {
          setPage((page: number) => page - 1);
        }}
      >
        Back
      </button>
    )}

    {pageNum < totalPages && (
      <button
        type="button"
        className="usa-button"
        onClick={() => {
          setPage((page: number) => page + 1);
        }}
      >
        Next
      </button>
    )}

    {pageNum === totalPages && (
      <button
        type="button"
        className="usa-button"
        onClick={() => {
          onSubmit('Hello');
        }}
      >
        Review & Send
      </button>
    )}
  </>
);

export default BackNextButtons;
