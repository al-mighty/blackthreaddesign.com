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
gallery_id:
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

This paragraph of text has been emphasized with the `{: .notice}` class.
{: .notice}

This paragraph of text has been emphasized with the `{: .notice--primary}` class.
{: .notice--primary}

This paragraph of text has been emphasized with the `{: .notice--info}` class.
{: .notice--info}

This paragraph of text has been emphasized with the `{: .notice--warning}` class.
{: .notice--warning}

This paragraph of text has been emphasized with the `{: .notice--success}` class.
{: .notice--success}

This paragraph of text has been emphasized with the `{: .notice--danger}` class.
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

{% include gallery id="gallery_id" class="gallery_class full" caption="This is a sample gallery with **Markdown support**." %}

To make the gallery fill the container add `class="full"`.

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

Images with lightbox can be included like this: <a class="image-popup" href="{{ site.url }}/assets/images/test2.png"><img src="{{ site.url }}/assets/images/test2.png" alt="Test Image 2" /></a>

![image-center]({{ site.url }}/assets/images/test-200.jpg){: .align-center}
This image is centred.

![image-left]({{ site.url }}/assets/images/test-400.jpg){: .align-left}
The rest of this paragraph is filler for the sake of seeing the text wrap around the image, which is left aligned. There should be plenty of room above, below, and to the right of the image. Just look at him there — Hey guy! Way to rock that left side. I don’t care what the right aligned image says, you look great. Don’t let anyone else tell you differently.

![image-right]({{ site.url }}/assets/images/test-200.jpg){: .align-right}
And now we’re going to shift things to the right align. Again, there should be plenty of room above, below, and to the left of the image. Just look at him there — Hey guy! Way to rock that right side. I don’t care what the left aligned image says, you look great. Don’t let anyone else tell you differently.


[This is an internal link]({{ site.url }}/tutorials/)

[This is an internal link to a post]({{ site.url }}{% post_url /articles/2017-02-22-article-test %})

[repeated-link]: http://jekyllrb.com/docs/home

[^reference]: Test reference
