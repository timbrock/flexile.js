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
Creating a configuration object is as simple as calling `flexile.config` in your own script that follows the flexile.js script on the page:

``` JavaScript
<script>
  let config = flexile.config();
</script>
```
Hidden in the returned object are some default settings: the "light" theme, the "wide" (16:9) aspect ratio and the "vanish" transition mode. You can replace the default themes, aspects and transitions using the methods of the config object that begin with set (eg `setThemes`) or add to them using the add methods (eg `addThemes`). You can also create your own key bindings (by default there are none). Here's one example:

``` JavaScript
<script>
  let config = flexile.config();
  config.addThemes("dark");
  config.setTransitions(["slide-right", "slide-left", "fade"]); //pass an array to set or add more than one thing at a time
  config.addAspects(["monitor", "traditional"]);
  config.setKeys([{code: 37, value: "previous"}, {code: 39, value: "next"}]);
</script>
```
By default, however, all these functions return the config object itself. So the above code can be rewritten:

``` JavaScript
<script>
  let config = flexile.config()
    .addThemes("dark")
    .setTransitions(["slide-right", "slide-left", "fade"])
    .addAspects(["monitor", "traditional"])
    .setKeys([{code: 37, value: "previous"}, {code: 39, value: "next"}]);
</script>
```

If you prefer to receive information about how many items were added or removed on each call, you can instead pass `false` in to the first call and use the first form:

``` JavaScript
<script>
  let config = flexile.config(false);
  let a = config.addThemes("dark");
  let b = config.setTransitions(["slide-right", "slide-left", "fade"]);
  let c = config.addAspects(["monitor", "traditional"]);
  let d = config.setKeys([{code: 37, value: "previous"}, {code: 39, value: "next"}]);
  //Run some checks
</script>
```

If an inappropriate value is passed in to one of these functions, then changes will not be made. So what is or isn't appropriate? For themes, transitions and aspects you just need to pass in a suitable string: some combination of letters, numbers, dashes and underscores. (As in the HTML section above, that is one that matches the JavaScript regular expression /^[A-Za-z\d_-]+$/.) An array of such strings can be used to set or add one or more items. For key bindings you must pass in objects (or arrays thereof). Each object must include a `code` property with a numeric value that represent the [keycode](http://keycode.info/) of the key you want to use and a `value` property whose own value is either a string or a number. If it's a string it will be accepted if it matches the regular expression above, but it will only do something useful if it matches one of the following: "first", "last", "previous", "next", "theme", "aspect", "transition" or "fullscreen" (see the section `flexile.create`). In the examples above, the call to `setKeys` associates the string "previous" with the left-arrow key and the string "next" with the right arrow key. If the value of the value property is a number, *n*, then the key with the associated code will be used to move the *n*th slide to the top of the stack (the first slide is 0, not 1).

To make things a little more confusing, you can also set/add themes, aspects and transitions using objects with appropriate "name properties" and include additional properties in objects passed:

``` JavaScript
<script>
  let config = flexile.config()
    .addThemes({name: "dark"})
    .setTransitions([{name: "slide-right", type: "slide"}, {name: "slide-left", type: "slide"}, {name: "fade"}])
    .addAspects([{name: "monitor"}, {name: "traditional"}])
    .setKeys([{code: 37, value: "previous", type: "arrow"}, {code: 39, value: "next", type: "arrow"}]);
</script>
```

This additional complication can be thought of as a way of adding your own metadata to a configuration object. It can also come in handy should you want to remove information that is stored.

To remove an item, use the appropriate `remove` function: `removeThemes`, `removeAspects`, `removeTransitions` or `removeKeys`.

``` JavaScript
<script>
  let config = flexile.config()
    .addThemes({name: "dark"})
    .setTransitions([{name: "slide-right", type: "slide"}, {name: "slide-left", type: "slide"}, {name: "fade"}])
    .addAspects([{name: "monitor"}, {name: "traditional"}])
    .setKeys([{code: 37, value: "previous", type: "arrow"}, {code: 39, value: "next", type: "arrow"}]);

  config.removeThemes("light") //remove default theme
    .removeAspects(["wide", "traditional"]);
</script>
```

For themes, transitions and aspects it should be self-explanatory what is being removed. For keys the default is to look at the code property, not the value property. You can change this by passing the property name as a second argument:

``` JavaScript
<script>
  let config = flexile.config()
    .addThemes({name: "dark"})
    .setTransitions([{name: "slide-right", type: "slide"}, {name: "slide-left", type: "slide"}, {name: "fade"}])
    .addAspects([{name: "monitor"}, {name: "traditional"}])
    .setKeys([{code: 37, value: "previous", type: "arrow"}, {code: 39, value: "next", type: "arrow"}]);

    config.removeKeys(37) //remove key(s) with code of 37
      .removeKeys("next", "value"); //remove key(s) with value of "next"
</script>
```

But you can also use this method and metadata you provided to remove multiple themes, transitions, aspects or keys in one go. For example:

``` JavaScript
<script>
  let config = flexile.config()
    .addThemes({name: "dark"})
    .setTransitions([{name: "slide-right", type: "slide"}, {name: "slide-left", type: "slide"}, {name: "fade"}])
    .addAspects([{name: "monitor"}, {name: "traditional"}])
    .setKeys([{code: 37, value: "previous", type: "arrow"}, {code: 39, value: "next", type: "arrow"}]);

    config.removeTransitions("slide", "type") //remove slide-right and slide-left in one call
</script>
```

Because this can get confusing, the config object has a `getClone` method that will return a shallow copy of the hidden configuration object so you can check things are as you expected them to be.

To be useful, the data stored in the config object must match a few conditions. There must be at least one theme, one aspect and one transition defined while a key's code cannot be duplicated. The `errors` method of the config object will return an array listing the violations of these conditions or `false` if there are none.

## CSS
Coming soon.
