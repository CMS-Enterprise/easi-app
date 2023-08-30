import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { configure } from 'enzyme';

// import configureMockStore from 'redux-mock-store';
import 'regenerator-runtime/runtime';
import '@testing-library/jest-dom';
// import 'jest-canvas-mock';
import 'vitest-canvas-mock';
import './i18n';

configure({ adapter: new Adapter() });

window.URL.createObjectURL = vi.fn();

// https://stackoverflow.com/questions/56079277/okta-sign-in-widget-breaks-jest-tests-typeerror-cannot-read-property-backing
window.getComputedStyle = vi.fn(() => {
  return ({
    getPropertyValue: vi.fn()
  } as unknown) as CSSStyleDeclaration;
});

// https://github.com/hustcc/jest-canvas-mock/issues/2
global.HTMLCanvasElement.prototype.getContext = () => null;
global.URL.createObjectURL = () => '';

document.querySelector = vi.fn(() => {
  return {
    offsetWidth: 0,
    scrollIntoView: vi.fn()
  };
});

// vi.stubGlobal('mockStore', configureMockStore());
