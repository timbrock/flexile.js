(function(){

  "use strict";
  
  let options = document.querySelectorAll("#transitions option");
  
  let transitionsList = Array.from(options).map(function(elem){
    return elem.getAttribute("value");
  });
  
  let config = flexile.config()
    .setThemes("white")
    .setTransitions(transitionsList)
    .addKeys(flexile.helpers.keys.lrpn)
    .addKeys(flexile.helpers.keys.numbers1)
    .addKeys([{code: 219, value: "first"}, {code: 221, value: "last"}])
    .addKeys({code: 82, value: "transition"});

  let presentation = flexile.create("#presentation", config);

  const doClick = function(func){
    return function(event){
      event.preventDefault();
      func();
    };
  };

  document.querySelector("#previous-slide").addEventListener("click", doClick(presentation.previousSlide), false);
  document.querySelector("#next-slide").addEventListener("click", doClick(presentation.nextSlide), false);

  document.querySelector("#transitions").addEventListener("change", function(event){
    event.preventDefault();
    presentation.changeTransition(this.options[this.selectedIndex].getAttribute("value"));
  }, false);
  
  
})();