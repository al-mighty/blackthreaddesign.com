import 'babel-polyfill';

import initFooter from 'utilities/init/initFooter.js';

import 'pages/hidden/robot/robotSetup.js';
import Simulation from 'pages/hidden/robot/Simulation.js';

initFooter();

const simulation = new Simulation();
