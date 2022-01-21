import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { configure } from 'enzyme';

import 'regenerator-runtime/runtime';
import '@testing-library/jest-dom';
import 'jest-canvas-mock';
import './i18n';

configure({ adapter: new Adapter() });
