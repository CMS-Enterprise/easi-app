import React from 'react';
import { act } from 'react-dom/test-utils';
import axios from 'axios';
import { mount } from 'enzyme';

import { FlagProvider, useFlags } from 'contexts/flagContext';

const flagsURL = `${process.env.REACT_APP_API_ADDRESS}/flags`;

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

beforeEach(() => {
  mockedAxios.get.mockClear();
});

const FlagPrinter = () => {
  const flags = useFlags();
  const stringified = JSON.stringify(flags, Object.keys(flags).sort());
  return <p>{stringified}</p>;
};

it('loads flags into the provider', async () => {
  const getMock = mockedAxios.get.mockResolvedValue({
    data: {
      sandbox: true,
      taskListLite: true,
      pdfExport: true
    }
  });

  const wrapper = mount(
    <FlagProvider>
      <FlagPrinter />
    </FlagProvider>
  );
  await act(async () => {
    await getMock;
  });

  wrapper.update();

  const printer = wrapper.find(FlagPrinter);
  expect(printer.text()).toEqual(
    `{"pdfExport":true,"sandbox":true,"taskListLite":true}`
  );
  expect(mockedAxios.get.mock.calls).toEqual([[flagsURL]]);
});

it('uses the defaults when flags fail to load', async () => {
  const getMock = mockedAxios.get.mockRejectedValue(
    new Error('could not load')
  );

  const wrapper = mount(
    <FlagProvider>
      <FlagPrinter />
    </FlagProvider>
  );
  await act(async () => {
    await getMock;
  });

  wrapper.update();

  const printer = wrapper.find(FlagPrinter);
  expect(printer.text()).toEqual(
    `{"pdfExport":false,"sandbox":false,"taskListLite":false}`
  );
  expect(mockedAxios.get.mock.calls).toEqual([[flagsURL]]);
});
