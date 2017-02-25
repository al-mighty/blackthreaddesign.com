---
layout: single
title:  "Article Test"
date:   2017-02-22 13:00:35 +0700
categories: articles
excerpt: "testing..."
teaser: "assets/images/teaser-800x450.jpg"
image:
  path: &image /assets/images/test1.png
  feature: *image
#  teaser: /assets/images/madewithpaper-guide-teaser.jpg
#  thumb: /assets/images/madewithpaper-guide-thumb.jpg
tags: [test, draft]
header:
  image: "assets/images/apo2-1920x1080.jpg"
---

Navigation can be included like this
{% include nav_list nav="tutorials" %}

# Header 1

## Header 2

### Header 3

* This is the first test article. It will soon be moved into `_drafts`, and will serve to demonstrate things.

This is a reference[^reference].

To add new posts, simply add a file in the `_posts` directory that follows the convention `YYYY-MM-DD-name-of-post.ext`

[External Link](http://www.fiftythree.com/paper/)

[Repeated link][repeated-link]

Code Snippets:

{% highlight js %}
var x = "x";
console.log(x);
//comment
{% endhighlight %}

<figure>
	<img src="{{ site.url }}/blog/assets/images/test2.png" alt="Test Image" />
    <figcaption>This is a figure.</figcaption>
</figure>

<figure class="large">
  <iframe width="560" height="315" src="//www.youtube.com/embed/videoseries?list=PLaLqP2ipMLc6UugVLyTwWTiFtmmZzj7ao" frameborder="0"> </iframe>
  <figcaption>This is a figure with class `large` containing a video iframe.</figcaption>
</figure>

<div class="notice--warning" markdown="1">
#### Header 4 with `notice--warning` class
</div>

<div class="notice--info" markdown="1">
#### Header 4 with `notice--info` class
</div>

Images can be included like this: <img src="{{ site.url }}/blog/assets/images/test1.png" alt="Test Image" />

Images with lightbox can be included like this: <img src="{{ site.url }}/blog/assets/images/test2.png" alt="Test Image 2" class="image-popup"/>




[This is an internal link]({{ site.url }}/tutorials/)

[This is an internal link to a post]({{ site.url }}{% post_url /articles/2017-02-22-article-test %}) NOTE: Currently not working because  `/blog` is missing

[repeated-link]: http://jekyllrb.com/docs/home

[^reference]: Test reference
