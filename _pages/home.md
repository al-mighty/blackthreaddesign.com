---
layout: splash
permalink: /
title: 'The Black Thread Blog'
header:
#  overlay_color: "#000"
#  overlay_filter: "0.5"
  image: "assets/images/apo2-1920x1080.jpg"
  alt: 'Created with www.apophysis.org'
  cta_label: "More Info"
  cta_url: "/"
#  caption: "Created with www.apophysis.org"
intro:
# - excerpt: 'Nullam suscipit et nam, tellus velit pellentesque at malesuada, enim eaque. Centered with `type="center"`'
feature_row_articles:
  - image_path: /assets/images/test1.png
    alt: "articles_img"
    title: "Articles"
    excerpt: "Forthcoming..."
    url: "/articles/"
    btn_label: "Go to articles"
    btn_class: "btn--inverse"
feature_row_tutorials:
  - image_path: /assets/images/test3.png
    alt: "tutorials_img"
    title: "Tutorials"
    excerpt: "Forthcoming..."
    url: "/tutorials/"
    btn_label: "Go to tutorials"
    btn_class: "btn--inverse"
---

{% include feature_row id="intro" type="center" %}

{% include feature_row id="feature_row_articles" type="left" %}

{% include feature_row id="feature_row_tutorials" type="left" %}
