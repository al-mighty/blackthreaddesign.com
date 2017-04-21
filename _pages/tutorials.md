---
layout: single
permalink: /tutorials/
title: "Three.js Tutorials"
#excerpt: "A collection of tutorials related to three.js."
#teaser: "assets/images/teaser-800x450.jpg"
header:
  overlay_image: "assets/images/tutorials/tutorial-hero.jpg"
sidebar:
  nav: "tutorials"
---

Welcome to the Black Thread series of tutorials on [three.js](https://threejs.org/). If you look around the internet, you'll find lots of "Introduction to three.js" type tutorials (including in the [official docs](threejs.org/docs/#manual/introduction/Creating-a-scene)), and while we will quickly go over the basics, the intention here is not to create yet another beginner tutorial series. Instead, while attempting to make everything as accessible as possible, we'll  focus on getting to know three.js in depth - all the amazing features that make this beautiful library so great to work with, but also all how to deal with all the quirks and annoyances that you will come across.


## Section 1 (First Steps)
We'll start by going over the basics - the components that make up a basic 3D scene, how to create objects, lights, cameras and how to apply simple materials and textures to our creations. This section will use the most basic programming techniques possible while we get up to speed on the concepts, so we'll stick to old style (plain, or ES5) Javascript that you can just write in a text editor and open in any browser. We'll also include  an equivalent ES6 Codepen live version of each example though, so you can compare the differences. We'll use this section to learn (or revise) all the basics, and make sure we are up to speed with all the terminology we will need to go deeper. 

## Section 2 (Build Tools)
As you may be aware, the Javascript language has recently been updated to version ES6 (or rather, version [it's complicated](https://benmccormick.org/2015/09/14/es5-es6-es2016-es-next-whats-going-on-with-javascript-versioning/)), and we want to start using these modern features. As support for features varies from browsers to browser, in order for our code to work we'll need to compile it down to ES5 compatible code. This requires using some build tools. 
We'll go for the simplest setup possible, using [Node.js](https://nodejs.org/en/) as a task runner and [Babel](https://babeljs.io/) to compile our code. Additionally, as the last thing we want to is to have all our code in one huge file, we'll split it up using ES6 modules - this requires using a bundling tool. As three.js itself is bundled using [rollup.js](https://rollupjs.org/), we'll stick with that. There are many other ways of accomplishing this step, so if you already use a different build setup, skip this section. Oh, except for the last bit - in that we'll go over how to convert existing three.js plugins such as controls to modules. 

## Section 3 (Abstraction)
Next we'll take the setup we've used so far and abstract it into `THREE.App` - so that instead of worrying about things like creating cameras, canvases, resizing function and so on, we can just use `const myApp = new THREE.App()` and have everything handled automatically. We'll also cover how to create a loading overlay and a statistics overlay for our canvases. `THREE.App` is also available as a node module, so you can even skip this section and just use that if you want. 

## Section 4 (Details)
We'll start to go into greater detail here. We'll cover the various options of the [WebGLRenderer](https://threejs.org/docs/#Reference/Renderers/WebGLRenderer), how to work with a [Scene](https://threejs.org/docs/#Reference/Scenes/Scene), the basic functionality that most objects in three.js inherit from [Object3D](https://threejs.org/docs/#Reference/Core/Object3D), how to use [BufferGeometries](https://threejs.org/docs/#Reference/Core/BufferGeometry) and lots of other things. Maybe even a little bit of matrix mathematics. 

You can find any of the codepens used in the tutorials [here]((http://codepen.io/collection/DKNVdO/)), and all the gists [here](https://gist.github.com/looeee/). 

Happy coding! 
