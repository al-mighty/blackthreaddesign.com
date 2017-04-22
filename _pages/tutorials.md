---
layout: single
permalink: /tutorials/
title: "Three.js Tutorials"
#excerpt: "A collection of tutorials related to three.js."
header:
  overlay_image: "assets/images/tutorials/tutorial-hero.jpg"
sidebar:
  nav: "tutorials"
---

Welcome to the Black Thread series of tutorials on [three.js](https://threejs.org/). If you look around the internet, you'll find lots of "Introduction to three.js" type tutorials (including in the [official docs](threejs.org/docs/#manual/introduction/Creating-a-scene)), and while we will quickly go over the basics, the intention here is not to create yet another beginner tutorial series. Instead, while attempting to make everything as accessible as possible, we'll  focus on getting to know three.js in depth - all the amazing features that make this beautiful library so great to work with, but also all how to deal with all the quirks and annoyances that you will undoubtedly come across.

These tutorials are intended to be supplementary to the [official documentation](threejs.org/docs/) and you'll be referred there regularly (*author disclaimer:* I wrote quite a bit of the official documentation, so if you find a mistake there it is probably my fault. Please let me know here or raise an issue on [github](https://github.com/mrdoob/three.js/issues/) and I'll fix it ASAP!). 


## Section 1 (First Steps)
We'll start by going over the basics - the components that make up a basic 3D scene, how to create objects, lights, cameras and how to apply simple materials and textures to our creations. This section will use the most basic programming techniques possible while we get up to speed on the concepts, so for now we'll stick to old style (plain, or ES5) Javascript that you can just write in a text editor and open in any browser. We'll also include an equivalent ES6 Codepen live version of each example though, so you can compare the differences. We'll use this section to learn (or revise) all the basics, and make sure we are up to speed with all the terminology we will need to go deeper. 

## Section 2 (Build Tools)
As you may be aware, the Javascript language has recently been updated to version ES6 (or rather, version [it's complicated](https://benmccormick.org/2015/09/14/es5-es6-es2016-es-next-whats-going-on-with-javascript-versioning/)), and we want to start using these modern features. As support for each feature varies from browsers to browser, in order for our code to work we'll need to compile it down to ES5 compatible code. This requires using some build tools. 
We'll go for the simplest setup possible, using [Node.js](https://nodejs.org/en/) as a task runner and [Babel](https://babeljs.io/) to compile our code. Additionally, as the last thing we want to is to have all our code in one huge file, we'll split it up using ES6 modules, which requires using a bundling tool. As three.js itself is bundled using [rollup.js](https://rollupjs.org/), we'll stick with that. There are many equivalent ways of compiling and bundling ES6 code, so if you already use a different build setup, you should be able to skip this section.

## Section 3 (Abstraction)
Next we'll take the setup we've used so far and abstract it into `THREE.App`, so that instead of worrying about things like creating cameras, canvases, resizing function and so on, we can just use `const myApp = new THREE.App()` and have everything handled automatically for most common use cases. We'll also cover how to create a loading overlay and a statistics overlay for our canvases. `THREE.App` will soon be available as a node module, so you can just use that if you want. Still, it will be a good idea to follow through this section, or at least the part on setting up scene resizing. 

## Section 4 (Materials)
Three.js ships with lots of different material types. We'll start by looking at the base [Material](http://threejs.dev/docs/#api/materials/Material) class, then some of the older materials available - the MeshBasicMaterial, MeshLambertMaterial and MeshPhongMaterials. Next we'll move onto the newer physically based rendering work flow available in the form of the MeshStandardMaterial and MeshPhysicalMaterial. We'll then take a quick look at other material types such as materials for points, sprites and lines, before heading into deeper territory with the ShaderMaterial and RawShaderMaterial. 

## Section 5 (Textures)
Now we'll take a deeper look at textures, and how to author them for use with three.js. We'll go over the basics of gamma space, linear space and when to use each. Then we'll go over the [Texture](https://threejs.org/docs/#api/textures/Texture) base class (unlike other base classes in three.js this is intended to be used directly) before looking at the various derived texture classes that come with three.js and how to load or use them - [CanvasTexture](https://threejs.org/docs/#api/textures/CanvasTexture) which uses a 2D Canvas element as a texture, and can be used to create effects where you can draw on the surface of a 3D object, for example,  [CompressedTexture](https://threejs.org/docs/#api/textures/CompressedTexture), [CubeTexture](https://threejs.org/docs/#api/textures/CubeTexture) (for use as an environment map), [DataTexture](https://threejs.org/docs/#api/textures/DataTexture), which creates a texture from raw data, [DepthTexture](https://threejs.org/docs/#api/textures/DepthTexture) (a type of shadow map) and [VideoTexture](https://threejs.org/docs/#api/textures/VideoTexture), which takes a video and updates the texture with each new frame of the video.

## Section 6 (Lights and Shadows)
Working with lights in three.js is fairly straightforward, barring a few quirks (here's looking at you, DirectionalLight). However, adding shadows is another story and can be very tricky to get right. We'll go over the various light types and corresponding shadows here.

## Section 7 (Helpers)
Three.js ships with 14 (and counting) helper objects. Most are fairly self explanatory, so we'll just take a quick look at each and make sure we are familiar with them. 

## Section 8 (The /examples folder)
Here we'll take a whirlwind tour of (some) of the /[examples](https://github.com/mrdoob/three.js/blob/dev/examples/) folder in the three.js github repository. There are a lot of thing contained in here - to start with, all the code for the official three.js examples (which you can see live [here](https://threejs.org/examples/)), but also loads of plugins such as [controls](https://github.com/mrdoob/three.js/tree/dev/examples/js/controls), [loaders](https://github.com/mrdoob/three.js/tree/dev/examples/js/loaders) for many different texture and model formats, [postprocessing](https://github.com/mrdoob/three.js/tree/dev/examples/js/postprocessing) (which we'll cover in section 13), additional [renderers](https://github.com/mrdoob/three.js/tree/dev/examples/js/renderers), [cameras](https://github.com/mrdoob/three.js/tree/dev/examples/js/cameras), [modifiers](https://github.com/mrdoob/three.js/tree/dev/examples/js/modifiers) and lots more. There are even free to use [3D fonts](https://github.com/mrdoob/three.js/tree/dev/examples/fonts), [models](https://github.com/mrdoob/three.js/tree/dev/examples/models), [sounds](https://github.com/mrdoob/three.js/tree/dev/examples/sounds) and [textures](https://github.com/mrdoob/three.js/tree/dev/examples/textures) you can use for testing, all licensed with open (MIT) license as three.js itself. 

We won't be covering everything here, but we'll attempt to go over the most useful bits. 

## Section 9 (Working with 3D assets)
Here we'll go over how to work with assets created in other 3D applications. This is, in my opinion, the most poorly understood and problematic area you will come across while working with three.js, albeit with good reason, as aside from quirks such as different applications using different coordinate systems (the most common is that the y and z axes are switched), the main problem is that there are just an overwhelming number of 3D assets formats and applications around and while three.js has plenty of loaders, they are all community created and of varying quality, and may not have been updated as recently as the format they are trying to load. There is no way we can cover everything here, so we are just going to look at a couple of applications and formats. 
We'll use 3D Studio Max and blender, and export our models in FBX, GLTF and OBJ and see how to load those. 
We'll also cover a secret weapon in the form of Clara.io, a free online 3D editor which uses three.js for rendering and which can import and export a variety of formats, including three.js's native JSON format.

If you do decide that you need to use some other application / format, be warned that you will likely encounter problems and may have to be prepared to update the loaders / exporters yourself. Actually, it's reasonable likely this will happen even if you use the ones listed above. Oh well, let's dive in anyway and see if we can make some kind of sense out of things! 

## Section 10 (The WebGLRenderer)
We'll cover the various options of the [WebGLRenderer](https://threejs.org/docs/#api/renderers/WebGLRenderer) in greater detail here, then take a look at the [WebGLRenderTarget](https://threejs.org/docs/#api/renderers/WebGLRenderTarget) and [WebGLRenderTargetCube](https://threejs.org/docs/#api/renderers/WebGLRenderTargetCube), which can be used to render to a texture or cube texture (environment map) respectively which we can then use for various effects. 

## Section 11 (Geometries and BufferGeometries)
We'll start by going over the basics of how a [Geometry](https://threejs.org/docs/#api/core/Geometry) works - vertices, faces, uv mapping and so on. Geometries have the advantage of being intuitive to work with, but unfortunately they are also quite slow, as every vertex is a [Vector3](https://threejs.org/docs/#api/math/Vector3) object, and every face is a [Face3](https://threejs.org/docs/#api/core/Face3) object. For simple scenes and powerful hardware this may not be a problem, but if you are trying to display something complex on a slow mobile device you will not have much luck. So we'll move onto [BufferGeometries](https://threejs.org/docs/#api/core/BufferGeometry) which hold all their vertex, uv, face and any other information in [BufferAttributes](https://threejs.org/docs/#api/core/BufferAttribute), which are basically flat [TypeArrays](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Typed_arrays). These are much faster, at the cost of being less intuitive to work with. But, armed with our understanding of how Geometries work, we'll see that they are actually not too complex. 

Armed with our new understanding of buffer geometries we'll take a look at how they can be used to create instanced geometries, a very powerful technique that will allow us to do things like create a flock of 100,000 birds without slowing our device to a standstill. 

## Section 12 Animation
Here we'll take a quick look at various animation techniques (in particular the idea of 'tweening' in frame based animation). We'll take a quick digression and look at how to use the Greensock GSAP animation library with three.js, before looking into three.js's own animation functions. We'll also look at how to use MorphTargets and [Bones](https://threejs.org/docs/#api/objects/Bone), [Skeletons](https://threejs.org/docs/#api/objects/Skeleton) and [SkinnedMeshes](https://threejs.org/docs/#api/objects/SkinnedMesh), starting with how to create them programmatically in three.js but moving on to using ones that have been authored in other applications. 

## Section 13 Postprocessing and effects
There are a lot of post processing, effect and shader files available in the /examples folder. Here we'll take a look at a few of the more useful ones and how to use these in our scenes. 

## Section 14 Tips and tricks
Here we'll go over anything that doesn't quite fit in the previous sections. We'll take a look at draw calls (and the importance of reducing them), how to clear objects from a scene and free up memory, as well as some useful code snippets that you can reuse in your work. 

You can find any of the codepens used in the tutorials [here]((http://codepen.io/collection/DKNVdO/)), and all the gists [here](https://gist.github.com/looeee/). 


Happy coding! 
