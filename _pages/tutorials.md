---
layout: standard
permalink: /tutorials/
title: "Three.js Tutorials"
excerpt: "The Black Thread series of tutorials on getting up and running with three.js"
header:
  image: "assets/images/tutorials/tutorial-hero.jpg"
sidebar:
  nav: "tutorials"
css:
  standard
---

Welcome to the Black Thread series of tutorials on [three.js](https://threejs.org/)! Here we'll focus on getting to know three.js in depth - all the amazing features that make this beautiful library so great to work with, but also all how to deal with all the quirks and annoyances that you will undoubtedly come across, so that you can quickly become familiar enough to start building your own projects.

These tutorials are intended to be supplementary to the [official documentation](https://threejs.org/docs/) and you'll be referred there regularly (*author disclaimer:* I wrote quite a bit of that documentation, so if you find a mistake there it is probably my fault. Please let me know here or raise an issue on [github](https://github.com/mrdoob/three.js/issues/) and I'll fix it ASAP!). Also, the best resources for understanding what three.js is capable of, once you are a little familiar with the library, are the [official examples](https://threejs.org/examples/). Go through them and get to know the source code in depth, you won't regret it.

You are expected to have a basic grasp of JavaScript and know how to get your code running in a web browser, although we will be covering everything that you need to know to get going.

If you need some inspiration to get you started, have a look at the [threejs.org](https://threejs.org/) frontpage which features a regularly updated grid of some cutting edge work from around the web.

### Available tutorials
These tutorials are work in progress - see the menu on the left for currently available tutorials. I'll be adding more as soon as possible! And if you want a specific tutorial please [let me know]({{ site.url }}/contact/).

## Section 0 (Introduction)
We'll start with a quick overview of WebGL and what you need to get it running on a computer, tablet or phone. Then we'll take a quick overview of the [three.js repo](https://github.com/mrdoob/three.js) on github, which is where all the magic happens, and we'll finish up the introduction with some tips on getting help and reporting bugs and how to set up a development server.

## Section 1 (First Steps)
We'll get going properly here, making sure we understand the basics - the components that make up every 3D scene, how to create objects, lights, cameras and how to apply simple materials and textures to our creations, as well as how to work with the [Scene](https://threejs.org/docs/#api/scenes/Scene), how to [Group](https://threejs.org/docs/#api/objects/Group) objects and how to set up our canvas to resize automatically if the browser window size changes.

This section will use the most basic programming techniques possible while we get up to speed, so for now we'll stick to old style (plain, or ES5) Javascript that you can just write in a text editor and open in any browser. We'll also include an equivalent ES6 Codepen live version at the bottom of each tutorial, so you can compare the differences. We'll use this section to learn (or revise) all the basics, and make sure we are up to speed with the terminology we'll need to go deeper.

## Section 2 (Build Tools and Debugging)
As you may be aware, the Javascript language has recently been updated to version ES6 (or rather, version [it's complicated](https://benmccormick.org/2015/09/14/es5-es6-es2016-es-next-whats-going-on-with-javascript-versioning/)), and we want to start using these modern features. As support for each feature varies from browsers to browser, in order for our code to work we'll need to compile it down to ES5 compatible code. This requires using some build tools.
We'll go for the simplest setup possible, using [Node.js](https://nodejs.org/en/) as a task runner and [Babel](https://babeljs.io/) to compile our code. Additionally, as the last thing we want to is to have all our code in one huge file, we'll split it up using ES6 modules, which requires using a bundling tool. Three.js itself is bundled using [rollup.js](https://rollupjs.org/) which is currently the easiest to use bundler available so we'll stick with that.

There are many equivalent ways of compiling and bundling ES6 code, so if you already use a different build setup, you should be able to skip this chapter.

We'll finish the section by taking a quick look at simple techniques for debugging your code, mainly just by using `console.log` and similar functions.

## Section 3 (Abstraction and enhancement)
Next we'll take the setup we've used so far and abstract it into `THREE.App`, so that instead of worrying about things like creating cameras, canvases, resizing functions and so on, we can just use `const myApp = new THREE.App()` and have everything handled automatically for most common use cases. We'll also cover how to create a loading overlay and a statistics overlay for our canvases. `THREE.App` will soon be available as a node module, so you can just use that if you want, although it is still advised to follow through this section.

We'll finish off with an example of how to enhance some built in functionality - in this case we'll expand the `THREE.Clock` so that it has similar functionality to Unity's [Time](https://docs.unity3d.com/ScriptReference/Time.html) class.

## Section 4 (Materials)
Three.js ships with lots of different material types. We'll start by looking at the base [Material](https://threejs.org/docs/#api/materials/Material) class, then some of the older materials available - the [MeshBasicMaterial](https://threejs.org/docs/#api/materials/MeshBasicMaterial), [MeshLambertMaterial](https://threejs.org/docs/#api/materials/MeshLambertMaterial) and [MeshPhongMaterial](https://threejs.org/docs/#api/materials/MeshPhongMaterial) (as well as the new [MeshToonMaterial](https://threejs.org/docs/#api/materials/MeshToonMaterial) which is based on the Phong material), before moving onto the newer physically based rendering work flow in the form of the [MeshStandardMaterial](https://threejs.org/docs/#api/materials/MeshStandardMaterial) and [MeshPhysicalMaterial](https://threejs.org/docs/#api/materials/MeshPhysicalMaterial).

We'll also take a quick look at the less commonly used [MeshDepthMaterial](https://threejs.org/docs/#api/materials/MeshDepthMaterial) and the [ShadowMaterial](https://threejs.org/docs/#api/materials/ShadowMaterial) (which is transparent but can receive shadows), before looking at using multiple materials with a single mesh.

Finally we'll see how to create materials for lines and curves in the form of the [LineBasicMaterial](https://threejs.org/docs/#api/materials/LineBasicMaterial) and [LineDashedMaterial](https://threejs.org/docs/#api/materials/LineDashedMaterial).

We won't be covering [ShaderMaterial](https://threejs.org/docs/#api/materials/ShaderMaterial) and [RawShaderMaterial](https://threejs.org/docs/#api/materials/RawShaderMaterial) here - instead we'll take a look at them in Section 14 (Creating custom shaders), and we'll also leave the [SpriteMaterial](https://threejs.org/docs/#api/materials/SpriteMaterial) and [PointMaterial](https://threejs.org/docs/#api/materials/PointsMaterial) for the appropriate sections.

## Section 5 (Textures)
Now we'll take a deeper look at textures, and how to author them for use with three.js. We'll go over the basics of gamma space, linear space and when to use each. Then we'll go over the [Texture](https://threejs.org/docs/#api/textures/Texture) base class (unlike other base classes in three.js this is intended to be used directly) before looking at the various derived texture classes that come with three.js and how to load or use them - [CanvasTexture](https://threejs.org/docs/#api/textures/CanvasTexture) (which uses a 2D Canvas element as a texture), [CompressedTexture](https://threejs.org/docs/#api/textures/CompressedTexture), [CubeTexture](https://threejs.org/docs/#api/textures/CubeTexture) (for use as an environment map), [DataTexture](https://threejs.org/docs/#api/textures/DataTexture), (which creates a texture from raw data), [DepthTexture](https://threejs.org/docs/#api/textures/DepthTexture) (a type of shadow map) and [VideoTexture](https://threejs.org/docs/#api/textures/VideoTexture), which takes a video and updates the texture with each new frame of the video.

We'll wrap up the section by examining the various texture formats that three.js supports, and the various encoding types and what they mean.

## Section 6 (Lights and Shadows)
Working with lights in three.js is fairly straightforward, barring a few quirks (here's looking at you, [DirectionalLight](https://threejs.org/docs/#api/lights/DirectionalLight)!). However, adding shadows is another story and can be very tricky to get right. We'll go over the various light types and corresponding shadows here.

## Section 7 (Helpers)
Three.js ships with 14 (and counting) helper objects. Most are fairly self explanatory, so we'll just take a quick look at each and make sure we are familiar with them.

## Section 8 (The /examples folder)
Here we'll take a whirlwind tour of (some) of the /[examples](https://github.com/mrdoob/three.js/blob/dev/examples/) folder in the three.js github repository. There is a lot to see here - to start with, all the code for the official three.js examples (which you can see live [here](https://threejs.org/examples/)), but also loads of plugins such as [controls](https://github.com/mrdoob/three.js/tree/dev/examples/js/controls), [loaders](https://github.com/mrdoob/three.js/tree/dev/examples/js/loaders) for many different texture and model formats, [postprocessing](https://github.com/mrdoob/three.js/tree/dev/examples/js/postprocessing) (which we'll cover in section 13), additional [renderers](https://github.com/mrdoob/three.js/tree/dev/examples/js/renderers), [cameras](https://github.com/mrdoob/three.js/tree/dev/examples/js/cameras), [modifiers](https://github.com/mrdoob/three.js/tree/dev/examples/js/modifiers) and much more. There are even free to use [3D fonts](https://github.com/mrdoob/three.js/tree/dev/examples/fonts), [models](https://github.com/mrdoob/three.js/tree/dev/examples/models), [sounds](https://github.com/mrdoob/three.js/tree/dev/examples/sounds) and [textures](https://github.com/mrdoob/three.js/tree/dev/examples/textures) you can use for testing, all licensed with the same open (MIT) license as three.js itself.

We won't be covering everything here, but we'll attempt to make sure we are familiar with the most useful bits.

## Section 9 (Working with 3D assets)
Here we'll go over how to work with assets created in other 3D applications. This is, in my opinion, the most poorly understood and problematic area you will come across while working with three.js, albeit with good reason, as aside from quirks such as different applications using different coordinate systems (the most common is that the y and z axes are switched), the main problem is that there are just an overwhelming number of 3D assets formats and applications around and while three.js has plenty of loaders, they are all community created and of varying quality, and may not have been updated as recently as the format they are trying to load. There is no way we can cover everything here, so we are just going to look at a couple of applications and formats.
We'll use [3D Studio Max](https://www.autodesk.com/products/3ds-max/overview) and [Blender](https://www.blender.org/), and export our models in [FBX](https://en.wikipedia.org/wiki/FBX), [GLTF](https://en.wikipedia.org/wiki/GlTF) and [OBJ](https://en.wikipedia.org/wiki/Wavefront_.obj_file) formats and see how to load those.
We'll also cover a secret weapon in the form of [Clara.io](https://clara.io/), a free online 3D editor which uses three.js for rendering and which can import and export a variety of formats, including three.js's native JSON format.

## Section 10 (The WebGLRenderer)
We'll cover the various options of the [WebGLRenderer](https://threejs.org/docs/#api/renderers/WebGLRenderer) in greater detail here, then take a look at the [WebGLRenderTarget](https://threejs.org/docs/#api/renderers/WebGLRenderTarget) and [WebGLRenderTargetCube](https://threejs.org/docs/#api/renderers/WebGLRenderTargetCube), which can be used to render to a texture or cube texture (environment map) respectively which we can then use for various effects.

We'll also take a look at the two WebGLRenderer plugins that ship as part of the three.js core - [Sprites](https://threejs.org/docs/#api/objects/Sprite) and [LensFlare](https://threejs.org/docs/#api/objects/LensFlare).

## Section 11 (Geometries and BufferGeometries)
We'll start by going over the basics of how a [Geometry](https://threejs.org/docs/#api/core/Geometry) works - vertices, faces, uv mapping and so on. Geometries have the advantage of being intuitive to work with, but unfortunately they are also quite slow, as every vertex is a [Vector3](https://threejs.org/docs/#api/math/Vector3) object, and every face is a [Face3](https://threejs.org/docs/#api/core/Face3) object. For simple scenes and powerful hardware this may not be a problem, but if you are trying to display something complex on a slow mobile device you will not have much luck. So we'll move onto [BufferGeometries](https://threejs.org/docs/#api/core/BufferGeometry) which hold all their vertex, uv, face and any other information in [BufferAttributes](https://threejs.org/docs/#api/core/BufferAttribute), which are basically flat [TypeArrays](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Typed_arrays). These are much faster, at the cost of being less intuitive to work with. But, armed with our understanding of how Geometries work, we'll see that they are actually not too complex.

Once we understand how to work with buffer geometries we'll take a look at how they can be used to create instanced geometries, a very powerful technique that will allow us to do things like create a flock of 100,000 birds without slowing our device to a standstill.

## Section 12 Animation
Here we'll take a quick look at various animation techniques (in particular the idea of 'tweening' in frame based animation). We'll take a quick digression and look at how to use the Greensock GSAP animation library with three.js, before looking into three.js's own animation functions. We'll also look at how to use [MorphTargets](https://threejs.org/docs/#api/core/Geometry.morphTargets) and [Bones](https://threejs.org/docs/#api/objects/Bone), [Skeletons](https://threejs.org/docs/#api/objects/Skeleton) and [SkinnedMeshes](https://threejs.org/docs/#api/objects/SkinnedMesh), starting with how to create them programmatically in three.js but moving on to using ones that have been authored in other applications.

## Section 13 Postprocessing, shaders and effects
There are a lot of post processing, effect and shader files available in the /examples folder. Here we'll take a look at setting up our scene for post processing and then take a look at a couple of the more useful effects and shaders

## Section 14 Creating custom materials
We'll take a look at how to create custom materials here. Three.js allows us to write our own shaders and use them ith the [ShaderMaterial](https://threejs.org/docs/#api/materials/ShaderMaterial) and [RawShaderMaterial](https://threejs.org/docs/#api/materials/RawShaderMaterial) by creating an even more basic version of MeshBasicMaterial using each. Finally we'll go over the basics of working with GLSL.

This chapter will serve as a very quick introduction to writing your own shaders, but since that subject deserves at least a book of its own, we'll mainly be looking at how to work with shaders in three.js.

## Section 15 Tips and tricks
Here we'll go over anything that doesn't quite fit in the previous sections. We'll take a look at draw calls (and the importance of reducing them), how to clear objects from a scene and free up memory, as well as some useful code snippets that you can reuse in your work.

## Code examples
You can find any of the codepens used in the tutorials [here](https://codepen.io/collection/DKNVdO/), and all the gists [here](https://gist.github.com/looeee/).


Happy coding!
