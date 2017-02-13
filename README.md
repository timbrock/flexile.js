# flexile.js
***flexile.js*** is a JavaScript library (and accompanying CSS stylesheet) for the creation of adaptable slideshows and presentations.

## Motivation
There are loads of HTML5-based presentation libraries out there. The specific goal with ***flexile.js*** is to create a library that provides support for making specific, predetermined, changes to layout and appearance at a moment's notice. Why? Because slides that match the aspect ratio of a display device can look better than those which don't and worrying whether you text would look better on a light or dark background seems like an unnecessary hassle. With ***flexile.js*** you can set up a slideshow with a couple of contrasting themes and a few aspect ratios and with the press of a key or the click of a mouse button switch between them when you're about to start presenting. You can even ask your audience which option looks best at the back of the room.

***flexile.js*** has no external dependencies and you **don't** need to be a JavaScript expert to use it. At the same time, if JavaScript *is* your passion, ***flexile.js*** could provide the backbone for a dynamic, interactive presentation for wowing your audience or clients. (Pitch over.)

## HTML

To use ***flexile.js*** you'll need to include the accompanying stylesheet at the top of the page and the script itself at the bottom.

***flexile.js*** uses `section` tags to mark out different slides. For example, the following snippet could be used as the basis for a 5-slide presentation:

``` HTML
<div id="presentation">
   <section><h2>Title slide</h2></section>
   <section><p>First content slide</p></section>
   <section><p>Second content slide</p></section>
   <section><p>Third content slide</p></section>
   <section><p>Final slide</p></section>
</div>
```

The div with `id` of "presentation" (you can call it whatever you want so long as it's unique) acts as a container for the slides. All its child elements should be sections. Any other tags will likely end up hidden behind section slides. (section tags as descendants of the section tags that mark out slides should probably be avoided, too.) After wrapping all slides in a couple of container divs (see JavaScript section), ***flexile.js*** gives each top-level section a z-index value such that the first will be visible on the top and subsequent slides hidden underneath. (Hence, there is no need to lay out the slides in reverse order.)

For the most part, ***flexile.js*** works by changing classes dynamically using JavaScript. However, there is nothing to stop you adding your own custom classes to sections (and, of course, to descendant elements where it is more or less essential for layout purposes). ***flexile.js*** *does* recognise and make use of the class `flexile-static-layer` on the section tags that mark out the slides. Such a section will *not* be treated as a slide that moves on and off screen. Rather, it will be treated like an invisible overlay on which visible elements can be placed. This can be useful for persistent features such as brand logos and navigational controls. In terms of z-index, flexile-static-layer sections are treated alongside regular slides. Hence, for the elements of a static layer to be visible at the start, it should be the first child of the container:

``` HTML
<div id="presentation">
   <section class="flexile-static-layer"><img src="path/to/image" class="logo" /></section>
   <section><h2>Title slide</h2></section>
   <section><p>First content slide</p></section>
   <section><p>Second content slide</p></section>
   <section><p>Third content slide</p></section>
   <section><p>Final slide</p></section>
</div>
```
***flexile.js*** also recognises class names that start with `flexile-transition-` and end with one or more further letter, number, underscore or dash characters (AKA any string that matches the JavaScript regular expression /^[A-Za-z\d_-]+$/). Such classes are assumed to specify CSS rules to determine how a slide should move on and off screen when required. If there are no (appropriate) rules defined for the given class, the slide will not be able to move off screen!

``` HTML
<div id="presentation">
   <section class="flexile-static-layer"><img src="path/to/image" class="logo" /></section>
   <section><h2>Title slide</h2></section>
   <section class="flexile-transition-fade"><p>First content slide</p></section>
   <section><p>Second content slide</p></section>
   <section><p>Third content slide</p></section>
   <section><p>Final slide</p></section>
</div>
```

## JavaScript
Coming soon.

## CSS
Coming soon.
