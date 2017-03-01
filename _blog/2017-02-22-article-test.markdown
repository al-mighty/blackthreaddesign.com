---
layout: single
title:  "Article Test"
date:   2017-02-22 13:00:35 +0700
categories: blog
comments: true
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
image-gallery:
  - url: /assets/images/test1.png #main image
    image_path: /assets/images/test1.png #small image
    alt: "Test 1"
  - url: /assets/images/test2.png
    image_path: /assets/images/test2.png
    alt: "Test 2"
  - url: /assets/images/test3.png
    image_path: /assets/images/test3.png
    alt: "Test 3"
  - url: /assets/images/test1.png
    image_path: /assets/images/test1.png
    alt: "Test 4"
image-gallery2:
  - url: /assets/images/test1.png #main image
    image_path: /assets/images/test1.png #small image
    alt: "Test 1"
  - url: /assets/images/test2.png
    image_path: /assets/images/test2.png
    alt: "Test 2"
---

* This is the first test article. It will soon be moved into `_drafts`, and will serve to demonstrate things.

* To add new posts, simply add a file in the `_posts` directory that follows the convention `YYYY-MM-DD-name-of-post.ext`

Navigation can be included like this:
{% include nav_list nav="tutorials" %}

TOC can be included like this:
{% include toc icon="gears" title="My Table of Contents" %}

# Header 1

## Header 2

### Header 3

This text is left aligned.
{: .text-left}

This text is center aligned.
{: .text-center}

This text is right aligned.
{: .text-right}

This text is justified.
{: .text-justify}

This text has no wrap applied.
{: .text-nowrap}

<div class="notice--warning" markdown="1">
#### Header 4 with `notice--warning` class
</div>

<div class="notice--info" markdown="1">
#### Header 4 with `notice--info` class
</div>

This paragraph of text has been emphasized with the `{: .notice}` class. Here is a <a href="#">link</a>.
{: .notice}

This paragraph of text has been emphasized with the `{: .notice--primary}` class. Here is a <a href="#">link</a>
{: .notice--primary}

This paragraph of text has been emphasized with the `{: .notice--info}` class. Here is a <a href="#">link</a>
{: .notice--info}

This paragraph of text has been emphasized with the `{: .notice--warning}` class. Here is a <a href="#">link</a>
{: .notice--warning}

This paragraph of text has been emphasized with the `{: .notice--success}` class. Here is a <a href="#">link</a>
{: .notice--success}

This paragraph of text has been emphasized with the `{: .notice--danger}` class. Here is a <a href="#">link</a>
{: .notice--danger}

[External Link](http://www.fiftythree.com/paper/)

[Repeated link][repeated-link]

This is a reference[^reference].

This is an <abbr title="Abreviation">ABR</abbr>.

Code Snippets:

{% highlight js %}
var x = "x";
console.log(x);
//comment
{% endhighlight %}

{% include gallery id="image-gallery" class="gallery_class" caption="This is a gallery with **Markdown support**." %}

To make the gallery fill the container add `class="full"`.

{% include gallery id="image-gallery2" class="gallery_class" caption="This is another gallery" %}

<figure>
	<img src="{{ site.url }}/assets/images/test2.png" alt="Test Image" />
    <figcaption>This is a figure.</figcaption>
</figure>

{% include figure image_path="/assets/images/test3.png" alt="this is a placeholder image" caption="This is another figure." %}

This is a youtube video
{% include video id="XsxDH4HcOWA" provider="youtube" %}

This is a vimeo video
{% include video id="97649261" provider="vimeo" %}

Images can be included like this: <img src="{{ site.url }}/assets/images/test1.png" alt="Test Image" />

Images with lightbox can be included like this:
{% include lightbox-image id="link_id" class="link_class" full="/assets/images/test2.png" thumb="/assets/images/test2.png" alt="lightbox test" %}

{% include lightbox-image id="link_id" class="link_class" full="/assets/images/test1.png" thumb="/assets/images/test1.png" alt="lightbox test 2" %}


![image-center]({{ site.url }}/assets/images/test-200.jpg){: .align-center}
This image is centred.

![image-left]({{ site.url }}/assets/images/test-400.jpg){: .align-left}
The rest of this paragraph is filler for the sake of seeing the text wrap around the image, which is left aligned. There should be plenty of room above, below, and to the right of the image. Just look at him there — Hey guy! Way to rock that left side. I don’t care what the right aligned image says, you look great. Don’t let anyone else tell you differently.

![image-right]({{ site.url }}/assets/images/test-200.jpg){: .align-right}
And now we’re going to shift things to the right align. Again, there should be plenty of room above, below, and to the left of the image. Just look at him there — Hey guy! Way to rock that right side. I don’t care what the left aligned image says, you look great. Don’t let anyone else tell you differently.


[This is an internal link]({{ site.url }}/tutorials/)

[repeated-link]: http://jekyllrb.com/docs/home

[^reference]: Test reference
