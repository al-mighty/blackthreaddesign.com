import 'babel-polyfill';

import initFooter from 'utilities/init/initFooter.js';

import 'pages/hidden/nfl/setup.js';
import Simulation from 'pages/hidden/nfl/Simulation.js';

initFooter();

const simulation = new Simulation();
