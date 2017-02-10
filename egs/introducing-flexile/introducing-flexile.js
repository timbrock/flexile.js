(function(){

  "use strict";
  
  let config = flexile.config()
    .setAspects(["wide", "monitor", "traditional", "cinema"])
    .setThemes(["light", "dark"])
    .setTransitions("slide-right")
    .addKeys(flexile.helpers.keys.lrpn)
    .addKeys(flexile.helpers.keys.numbers1)
    .addKeys([{code: 219, value: "first"}, {code: 221, value: "last"}])
    .addKeys([{code: 65, value: "aspect"}, {code: 70, value: "fullscreen"}])
    .addKeys({code: 84, value: "theme"});

  let presentation = flexile.create("#presentation", config);

  const doClick = function(func){
    return function(event){
      event.preventDefault();
      func();
    };
  };

  document.querySelector("#previous-slide").addEventListener("click", doClick(presentation.previousSlide), false);
  document.querySelector("#next-slide").addEventListener("click", doClick(presentation.nextSlide), false);
  document.querySelector("#change-theme").addEventListener("click", doClick(presentation.changeTheme), false);
  document.querySelector("#change-aspect").addEventListener("click", doClick(presentation.changeAspect), false);
  document.querySelector("#change-fullscreen").addEventListener("click", doClick(presentation.toggleFullscreen), false);

  
})();