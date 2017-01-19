$(document).ready(function(){
	
	"use strict";
  
  const flexile = {};
  
  flexile.create = function(container, opt){
    let $slideshow = $(container).addClass("flexile-slideshow");
    let $slides = $slideshow.children("section").addClass("flexile-slide");
    let $screen = $slides.wrapAll("<div></div>").parent().addClass("flexile-screen");
    
    {
      let nSlides = $slides.length;
      $slides.each(function(index, slide){
        $(slide).css("z-index", nSlides - index);
      });
    }
    
  };
  
  
  flexile.create("#presentation");
});