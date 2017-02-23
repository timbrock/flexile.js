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
The `flexile` object created in the flexile.js script exposes two functions. The first, `config`, produces an object that can be used to modify settings such as the list of different aspect ratios you wish to use. The second takes a CSS selection string, that uniquely identifies an element on the page, and a config object and turns the selected element into a presentation.

### flexile.config
Creating a config object is as simple as calling `flexile.config` in your own script that follows the flexile.js script on the page:

``` HTML
<script>
<<<<<<< HEAD
  let config = flexile.config();
=======
(function(){
  "use strict";
  let config = flexile.config();
})();
>>>>>>> master
</script>
```
Hidden in the returned object are some default settings: the "light" theme, the "wide" (16:9) aspect ratio and the "vanish" transition mode. You can replace the default themes, aspects and transitions using the methods of the config object that begin with set (eg `setThemes`) or add to them using the add methods (eg `addThemes`). You can also create your own key bindings (by default there are none). Here's one example:

``` JavaScript
let config = flexile.config();
config.addThemes("dark");
config.setTransitions(["slide-right", "slide-left", "fade"]); //pass an array to set or add more than one thing at a time
config.addAspects(["monitor", "traditional"]);
config.setKeys([{code: 37, value: "previous"}, {code: 39, value: "next"}]);
```
By default, however, all these functions return the config object itself. So the above code can be rewritten:

``` JavaScript
let config = flexile.config()
    .addThemes("dark")
    .setTransitions(["slide-right", "slide-left", "fade"])
    .addAspects(["monitor", "traditional"])
    .setKeys([{code: 37, value: "previous"}, {code: 39, value: "next"}]);
```

If you prefer to receive information about how many items were added or removed on each call, you can instead pass `false` in to the first call and use the long form:

``` JavaScript
let config = flexile.config(false);
let a = config.addThemes("dark");
let b = config.setTransitions(["slide-right", "slide-left", "fade"]);
let c = config.addAspects(["monitor", "traditional"]);
let d = config.setKeys([{code: 37, value: "previous"}, {code: 39, value: "next"}]);
//Run some checks
```

If an inappropriate value is passed in to one of these functions, then changes will not be made. So what is or isn't appropriate? For themes, transitions and aspects you just need to pass in a suitable string: some combination of letters, numbers, dashes and underscores. (As in the HTML section above, that is one that matches the JavaScript regular expression /^[A-Za-z\d_-]+$/.) An array of such strings can be used to set or add one or more items. For key bindings you must pass in objects (or arrays thereof). Each object must include a `code` property with a numeric value that represent the [keycode](http://keycode.info/) of the key you want to use and a `value` property whose own value is either a string or a number. If it's a string it will be accepted if it matches the regular expression above, but it will only do something useful if it matches one of the following: "first", "last", "previous", "next", "theme", "aspect", "transition" or "fullscreen" (see the section `flexile.create`). In the examples above, the call to `setKeys` associates the string "previous" with the left-arrow key and the string "next" with the right arrow key. If the value of the value property is a number, *n*, then the key with the associated code will be used to move the *n*th slide to the top of the stack (the first slide is 0, not 1).

To make things a little more confusing, you can also set/add themes, aspects and transitions using objects with appropriate "name" properties and include additional properties in objects passed:

``` JavaScript
let config = flexile.config()
    .addThemes({name: "dark"})
    .setTransitions([{name: "slide-right", type: "slide"}, {name: "slide-left", type: "slide"}, {name: "fade"}])
    .addAspects([{name: "monitor"}, {name: "traditional"}])
    .setKeys([{code: 37, value: "previous", type: "arrow"}, {code: 39, value: "next", type: "arrow"}]);
```

This additional complication can be thought of as a way of adding your own metadata to a configuration object. It can also come in handy should you want to remove information that is stored.

To remove an item, use the appropriate `remove` function: `removeThemes`, `removeAspects`, `removeTransitions` or `removeKeys`.

``` JavaScript
let config = flexile.config()
    .addThemes({name: "dark"})
    .setTransitions([{name: "slide-right", type: "slide"}, {name: "slide-left", type: "slide"}, {name: "fade"}])
    .addAspects([{name: "monitor"}, {name: "traditional"}])
    .setKeys([{code: 37, value: "previous", type: "arrow"}, {code: 39, value: "next", type: "arrow"}]);

config.removeThemes("light") //remove default theme
    .removeAspects(["wide", "traditional"]);
```

For themes, transitions and aspects it should be self-explanatory what is being removed. For keys the default is to look at the code property, not the value property. You can change this by passing the property name as a second argument:

``` JavaScript
let config = flexile.config()
    .addThemes({name: "dark"})
    .setTransitions([{name: "slide-right", type: "slide"}, {name: "slide-left", type: "slide"}, {name: "fade"}])
    .addAspects([{name: "monitor"}, {name: "traditional"}])
    .setKeys([{code: 37, value: "previous", type: "arrow"}, {code: 39, value: "next", type: "arrow"}]);

config.removeKeys(37) //remove key(s) with code of 37
    .removeKeys("next", "value"); //remove key(s) with value of "next"
```

But you can also use this method and metadata you provided to remove multiple themes, transitions, aspects or keys in one go. For example:

``` JavaScript
let config = flexile.config()
    .addThemes({name: "dark"})
    .setTransitions([{name: "slide-right", type: "slide"}, {name: "slide-left", type: "slide"}, {name: "fade"}])
    .addAspects([{name: "monitor"}, {name: "traditional"}])
    .setKeys([{code: 37, value: "previous", type: "arrow"}, {code: 39, value: "next", type: "arrow"}]);

config.removeTransitions("slide", "type") //remove slide-right and slide-left in one call
```

Because this can get confusing, the config object has a `getClone` method that will return a shallow copy of the hidden configuration object so you can check things are as you expected them to be.

To be useful, the data stored in the config object must match a few conditions. There must be at least one theme, one aspect and one transition defined while a key's code cannot be duplicated. The `errors` method of the config object will return an array listing the violations of these conditions or `false` if there are none.

### flexile.create
The `flexile.create` function takes a CSS selector (that should match exactly one element that contains all the section slides) and a config object (see previous subsection) and creates a ***flexile.js*** presentation. If the second argument is missing, a default configuration object will be created and used but the first argument is mandatory.

``` JavaScript
let config = flexile.config()
    .addThemes({name: "dark"})
    .setTransitions([{name: "slide-right", type: "slide"}, {name: "slide-left", type: "slide"}, {name: "fade"}])
    .addAspects([{name: "monitor"}, {name: "traditional"}])
    .setKeys([{code: 37, value: "previous", type: "arrow"}, {code: 39, value: "next", type: "arrow"}]);

let presentation = flexile.create("#presentation", config);
```

Under the hood, `flexile.create` does quite a bit of work. It wraps the child sections in a couple of divs (see the CSS section for more details), it adds z-index values to each of the sections and adds several classes to these, it resizes text where necessary, it copies over information about themes, aspects and transitions and creates bindings for keys. Finally, it returns a presentation object with functions that can be called to enable switching between slides, between predefined themes/aspect/transitions, and between "normal" and fullscreen mode.

If you are just designing a presentation for a talk and don't care about touch screens, you might not need to use the object returned. By setting appropriate code and value properties with `flexile.config().setKeys`, you can just call `flexile.create` and have everything ready. For instance, you can set the left (code 37) and right (code 39) arrow keys to "previous" and "next" and the presentation you then create can be moved through using those two keys. You can also set the "t" key (code 84) to change your themes (using the value "theme"), the "a" key (code 65) to move through your aspect ratios (with value "aspect"), and the r key (82) to change the default transition mode (using the value "transition"). You can also set a key, such as "f" (code 70) to toggle "fullscreen" mode on and off (where supported). Let's be explicit:   

``` JavaScript
let config = flexile.config()
    .addThemes("dark")
    .setTransitions(["slide-right", "slide-left", "fade"])
    .addAspects(["monitor", "traditional"])
    .setKeys([{code: 37, value: "previous"}, {code: 39, value: "next"}])
    .addKeys([{code: 84, value: "theme"}, {code: 65, value: "aspect"}])
    .addKeys([{code: 82, value: "transition"}, {code: 70, value: "fullscreen"}]);

flexile.create("#presentation", config); //that's it
```
If you're so inclined, you can also set keys to transport you to specific slides (see previous subsection) or the first and last slides using `value: "first"` and `value: "last"`.

You can now move on to the CSS section.

If you "do" want to provide support for devices without keyboards or want to add some other features, the presentation object can help you. This object provides the functions `firstSlide`, `lastSlide`, `previousSlide`, `nextSlide` and `nthSlide` which can be used inside callback functions to event handlers. As you might expect, they change the slide deck so that the first, last, previous next or *n*th (you provide *n*, indexed from 0) slide is showing. With these you can design your own navigational controls or gestures.

Similarly, with `changeTheme`, `changeAspect` and `changeTransition` you can set up buttons for changing between themes, aspects or transitions if you set more than one with the config object. If you don't supply an argument, then the next one in the list will be used. If you do and the argument is in the relevant list, then flexile will switch to using that theme/aspect/transition.

The `turnOnFullscreen`, `turnOffFullscreen` and `toggleFullscreen` member functions of the presentation object should be self-explanatory.

The `turnOnKeys`, `turnOffKeys` and `toggleKeys` settings can be used to enable and disable use of the keyboard to control the presentation. This can be helpful if you want to use the same keys across multiple presentations on the same page.

## CSS
As noted earlier, ***flexile.js*** works primarily by using JavaScript to add, remove and swap classes.

### Added classes
Consider the following page:

``` HTML
<!doctype html>
<html>
<head>
<title>Demo for readme page</title>
<link rel="stylesheet" type="text/css" href="path/to/flexile.css">
</head>

<body>
<div id="presentation">
  <section class="flexile-static-layer"><img src="path/to/image" class="logo" /></section>
  <section><h2>Title slide</h2></section>
  <section class="flexile-transition-fade"><p>First content slide</p></section>
  <section><p>Second content slide</p></section>
  <section><p>Third content slide</p></section>
  <section><p>Final slide</p></section>
</div>

<script src="path/to/flexile.js"></script>
<script>
<<<<<<< HEAD
=======
(function(){
  "use strict";
>>>>>>> master
  let config = flexile.config()
      .addThemes("dark")
      .setTransitions(["slide-right", "slide-left", "fade"])
      .addAspects(["monitor", "traditional"])
      .setKeys([{code: 37, value: "previous"}, {code: 39, value: "next"}])
      .addKeys([{code: 84, value: "theme"}, {code: 65, value: "aspect"}])
      .addKeys([{code: 82, value: "transition"}, {code: 70, value: "fullscreen"}]);

  let presentation = flexile.create("#presentation", config);
<<<<<<< HEAD
=======
})();
>>>>>>> master
</script>
</body>
</html>
```

After the final line of the script has executed, the live version of the div with an id of "presentation" will look like this:

``` HTML
<div id="presentation" class="flexile-slideshow flexile-theme-light flexile-aspect-wide">
  <div class="flexile-screen" style="font-size: 36.75px;">
    <div class="flexile-box flexile-first-slide">
      <section class="flexile-static-layer" style="z-index: 6;"><img src="path/to/image" class="logo"></section>
      <section class="flexile-slide flexile-transition-slide-right flexile-slide-stack flexile-slide-top" style="z-index: 5;"><h2>Title slide</h2></section>
      <section class="flexile-transition-fade flexile-slide flexile-slide-stack" style="z-index: 4;"><p>First content slide</p></section>
      <section class="flexile-slide flexile-transition-slide-right flexile-slide-stack" style="z-index: 3;"><p>Second content slide</p></section>
      <section class="flexile-slide flexile-transition-slide-right flexile-slide-stack" style="z-index: 2;"><p>Third content slide</p></section>
      <section class="flexile-slide flexile-transition-slide-right flexile-slide-stack" style="z-index: 1;"><p>Final slide</p></section>
    </div>
  </div>
</div>
```

All these extra classes require some explanation.

#### flexile-slideshow
The root element of every slideshow created using `flexile.create` is given the class "flexile-slideshow". Every CSS rule in the flexile.css file starts with flexile-slideshow. On the one hand this can make writing your own rules that are more specific than those in flexile.css somewhat longwinded, but it also ensures that ***flexile.js*** rules don't accidentally overwrite those on the rest of a page (unless you go around adding the class to your own elements).

#### flexile-theme-, flexile-aspect- and flexile-transition-
***flexile.js*** applies a theme by adding a class to the root element that begins flexile-theme- and ends with whatever string was first in the theme list passed in by the config object. In this case that's the default "light" theme. Since we defined the "t" key to change which theme was used, we could press that key and ***flexile.js*** would change flexile-theme-light to flexile-theme-dark. Things work much the same with the aspect ratios except the prefix is "flexile-aspect-". The "flexile-transition-" class is applied to individual slides rather than the root element. In one case, the "First content slide", a  "flexile-transition-" class was included in the markup so ***flexile.js*** will not apply a class of its own, even if you change the transition using the assigned "r" key.

#### flexile-screen, flexile-box and  flexile-fullscreen
***flexile.js*** wraps the sections in two div tags, the outer one having a class of "flexile-screen" and the inner one "flexile-box". These are primarily used to ensure the presentation behaves sensibly when put in to fullscreen mode and the designated aspect ratio does not match that of the screen itself. In fullscreen mode, the "flexile-screen" div is given the additional class "flexile-fullscreen". This can be used to set a background colour when in fullscreen mode (see the CSS/SASS source code for usage).

#### flexile-first-slide and flexile-last-slide
The "flexile-box" div can also be seen to have the "flexile-first-slide" class. If we'd moved on to the last slide we'd see "flexile-last-slide" instead. These are added purely as helpers for custom navigation. For example, if you create a button for moving to the previous slide on a static layer then you can hide (or fade) the button and/or remove pointer events when the class "flexile-first-slide" is present on the parent div.

#### flexile-slide
Each section that wasn't designated a static layer is given the class "flexile-slide".

#### flexile-slide-top
The currently visible slide is given the class "flexile-slide-top".

#### flexile-slide-stack and flexile-slide-discard
Every slide is given the class "flexile-slide-stack". As you move through the presentation the top slide gets removed from the stack (in some abstract sense) and placed on the discard pile. Thus "flexile-slide-stack" is replaced with "flexile-slide-discard".

If we were to use the designated keys to change the theme, aspect ratio and transition mode and to navigate to the last slide while in fullscreen mode the live HTML would look somewhat different:

``` HTML
<div id="presentation" class="flexile-slideshow flexile-theme-dark flexile-aspect-monitor">
  <div class="flexile-screen flexile-fullscreen" style="font-size: 48.37px;">
    <div class="flexile-box flexile-last-slide">
      <section class="flexile-static-layer" style="z-index: 6;"><img src="path/to/image" class="logo"></section>
      <section class="flexile-slide flexile-slide-discard flexile-transition-slide-left" style="z-index: 5;"><h2>Title slide</h2></section>
      <section class="flexile-transition-fade flexile-slide flexile-slide-discard" style="z-index: 4;"><p>First content slide</p></section>
      <section class="flexile-slide flexile-slide-discard flexile-transition-slide-left" style="z-index: 3;"><p>Second content slide</p></section>
      <section class="flexile-slide flexile-slide-discard flexile-transition-slide-left" style="z-index: 2;"><p>Third content slide</p></section>
      <section class="flexile-slide flexile-slide-stack flexile-slide-top flexile-transition-slide-left" style="z-index: 1;"><p>Final slide</p></section>
    </div>
  </div>
</div>
```

### Font (re)sizing
One thing that can't just adapt continuously and fluidly with CSS rules is font size (unless you want to add a breakpoint for every pixel width or I am missing a trick). Because of this, ***flexile.js*** takes the font size set on the root element (the one with class "flexile-slideshow") and assumes that to be the desired font size when the slides are 1000 pixels wide. It then scales that font-size in proportion to the actual current slide width and applies the result to the "flexile-screen" element. Percentages or em's can then be used on child elements and they will adjust automatically when the slides are resized.

### Creating your own themes
The flexile.css rules "reset" paddings, margins and etc to remove common inconsistencies between browsers. The themes supplied are more focused on font families and sizing and use of colour. You can, however, include anything you want in a theme it you find it helpful. Selectors should begin with ".flexile-slideshow.flexile-theme-*name*" where *name* is the name of the theme (which you'll use when creating a config object). This is somewhat verbose, so I recommend using a CSS preprocessor if you can. This also makes it easier to include the same rules in multiple themes without repeating yourself. See the partials files beginning "_theme-" in the "sass" directory of the "src" for more ideas.

### Creating your own aspects
The flexile.css folder includes class definitions for 8 aspect ratios: wide (16:9), monitor (16:10), traditional (4:3), cinema (239:100), tall (9:16), a4-portrait (210:297) and a4-landscape (297:210). Adding your own only takes a few lines of CSS and you can search the CSS source code for ".flexile-slideshow.flexile-aspect-wide" (for example) and copy and adapt. But if you use SASS you can just use the `make-aspect` mixin from the "_helpers.scss" partial file. The mixin should be called with a name (eg "very-wide" if you want to make a class "flexile-aspect-very-wide"), a width value and a height value. The width and height values need to be integers, so for a "very-wide" aspect you could use 25 and 10 (or 250 and 100 etc) but not 2.5 and 1.

### Creating your own transitions
***flexile.js*** uses pure CSS transitions based on the classes "flexile-slide", "flexile-slide-stack", "flexile-slide-top" and "flexile-slide-discard". There's already around 40 transitions supplied in the CSS file. If you want to make your own I suggest looking at the CSS file or at the "_transitions.scss" partials file to see how they're done.

### Ad hoc CSS
Alongside themes, aspects and transitions, you'll probably want to add your own ad hoc CSS suitable for individual presentations. This is especially important for the placement of elements. By default, the children of slides and static layers are set to have absolute positioning (with a display type of block) so that text and images can be easily placed anywhere on a slide. If you don't add any CSS for your layer or slide's contents or overwrite the default behaviour in your theme, then most of it is likely to end up in the top left corner of your presentation. You should also size elements like images and video in percentages.

If your presentation uses multiple aspect ratios, use ad hoc CSS rules that include the aspect class as part of the selector to reposition and resize elements where necessary. Look at the "introducing-flexile.css" file in "egs/introducing-flexile" to see some examples.
