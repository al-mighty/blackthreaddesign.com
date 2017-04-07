import * as THREE from 'three';

import './utilities/polyfills.js';

// Set up THREE
THREE.Cache.enabled = true;

let uuid = 1;
THREE.Math.generateUUID = function () {
  return uuid++;
};
