---
layout: single
permalink: /tutorials/
title: "Tutorials"
excerpt: "A collection of tutorials related to three.js."
teaser: "assets/images/teaser-800x450.jpg"
sidebar:
  nav: "tutorials"
---

TODO: Tutorials canvas / image

Welcome to the Black Thread series of tutorials on [three.js](https://threejs.org/). In section 1 (First Steps) we'll start by going over the basics - the components that make up a basic 3D scene, how to create objects, lights, cameras and how to apply simple materials and textures to our creations. This section will use the most basic programming techniques possible while we get up to speed on the concepts - as you may be aware, the Javascript language has recently been updated to version ES6 - or rather, version "It's complicated". If you haven't been following, there's a good write up [here](https://benmccormick.org/2015/09/14/es5-es6-es2016-es-next-whats-going-on-with-javascript-versioning/). But in section one we'll stick to old style (plain, or ES5) Javascript - although each example will have an equivalent ES6 Codepen live version at the bottom, so you can compare the differences.

In section two (Build Tools), we'll switch to using ES6+. As support for features varies from browsers to browser, in order for our code to work we'll need to compile it down to ES5 compatible code. This requires using some build tools. We'll go for the simplest setup possible, using [Node.js](https://nodejs.org/en/) as a task runner and [Babel](https://babeljs.io/) to compile our code. Additionally, as the last thing we want to is to have all our code in one huge file, we'll split it up using ES6 modules - this requires using a bundling tool. As three.js itself is bundled using [rollup.js](https://rollupjs.org/), we'll stick with that. There are many other ways of accomplishing this step, so if you already use a different build setup, skip this section. Oh, except for the last bit - in that we'll go over how to convert existing three.js plugins such as controls to modules. 

In Section 3 (Abstraction) we'll take the setup we've used so far and abstract it into `THREE.App` - so that instead of worrying about things like creating cameras, canvases, resizing function and so on, we can just use <br>`const myApp = new THREE.App()`. We'll also cover how to create a loading overlay and a statistics overlay for our canvases. `THREE.App` is also available as a node module, so you can even skip this section and just use that if you want. 

In Section 4 (Details) we'll go over things in more detail. We'll cover the various options of the [WebGLRenderer](https://threejs.org/docs/#Reference/Renderers/WebGLRenderer), how to work with a [Scene](https://threejs.org/docs/#Reference/Scenes/Scene), the basic functionality that most objects in three.js inherit from [Object3D](https://threejs.org/docs/#Reference/Core/Object3D), how to use [BufferGeometries](https://threejs.org/docs/#Reference/Core/BufferGeometry) and lots of other things. Maybe even a little bit of matrix mathematics. 

You can find any of the codepens used in the tutorials [here]((http://codepen.io/collection/DKNVdO/)), and all the gists [here](https://gist.github.com/looeee/). 

Happy coding! 