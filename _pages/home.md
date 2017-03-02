---
layout: splash
permalink: /
title: 'Black Thread Design'
loadingOverlay: true
header:
  image: "assets/images/splash-hero-1920.jpg"
  alt: 'hero_img'

feature_row_work:
  - image_path: /assets/images/test2.png
    alt: "work_img"
    title: "Work"
    title_link: "/work/"
    excerpt: "Work portfolio of Black Thread Design"
feature_row_tutorials:
  - image_path: /assets/images/test1.png
    alt: "tutorials_img"
    title: "Three.js Tutorials"
    title_link: "/tutorials/"
    excerpt: "A collection of tutorials related to using three.js as part of a modern ES2015+ Javascript setup."
feature_row_blog:
  - image_path: /assets/images/test1.png
    alt: "blog_img"
    title: "Blog"
    title_link: "/blog/"
    excerpt: "Articles related to the goings on at Black Thread Design."
feature_row_experiments:
  - image_path: /assets/images/test3.png
    alt: "experiments_img"
    title: "Experiments"
    title_link: "/experiments/"
    excerpt: "Smaller work pieces and experiments"

---

{% include feature_row id="feature_row_work" type="left" %}

{% include feature_row id="feature_row_experiments" type="left" %}

{% include feature_row id="feature_row_tutorials" type="left" %}

{% include feature_row id="feature_row_blog" type="left" %}
