$(document).ready(function(){
	
	"use strict";
  
  const flexile = {};
  
  flexile.create = function(container, opt){
    let $slideshow = $(container).addClass("flexile-slideshow");
    let $slides = $slideshow.children("section").addClass("flexile-slide");
    let $screen = $slides.wrapAll("<div></div>").parent().addClass("flexile-screen");
    let $box = $slides.wrapAll("<div></div>").parent().addClass("flexile-box");
    
    let nSlides = $slides.length;
    
    let moveSlide = (function(){
      let stackClass = "flexile-slide-stack";
      let discardClass = "flexile-slide-discard";
      
      return{
        discard: function($handle){
          $handle.removeClass(stackClass)
            .addClass(discardClass);
        },
        replace: function($handle){
          $handle.removeClass(discardClass)
            .addClass(stackClass);
        },
      };
      
    })();
    
    
    let top = (function(){
      let idx;
      let topClass = "flexile-slide-top";
      const getCurrent = function(){return $($slides[idx]);};
      return {
        index: function(){return idx;},
        handle: getCurrent,
        set: function(index){
          if(idx !== undefined){
            getCurrent().removeClass(topClass);
          }
          idx = index;
          getCurrent().addClass(topClass);
        }
      };
    })();
    
    
    const changeSlide = function(num){
      let current = top.index();
      if((num < 0) || (num >= nSlides) || (num === current)){return;}

      if(num > current){
        let first = current;
        let last = num; 
        for(let i = first; i < last; i++){
          moveSlide.discard($($slides[i]));
        }
      } else{
        let first = num;
        let last = current;
        for(let i = first; i < last; i++){
          moveSlide.replace($($slides[i]));
        }
      }
      
      top.set(num);
    };
    
    const isFullscreen = function(){
      return document.fullScreen || document.mozFullScreen || document.webkitIsFullScreen;
    };
    
    const aspect = (function(){
      let aspects = [
        {name: "wide-aspect", ratio: 16/9},
        {name: "monitor-aspect", ratio: 16/10},
        {name: "classic-aspect", ratio: 4/3},
        {name: "square-aspect", ratio: 1}
      ];
      
      let nAspects = aspects.length;
      let current = 0;
      
      let next = function(change = 0){
        let chosen = aspects[current];
        
        if(change){
          $slideshow.removeClass(chosen.name);
          current = (current + change) % nAspects;
          chosen = aspects[current];
          $slideshow.addClass(chosen.name);
        }
        
        //$screen.css("width", "100%");
          //.css("height", (1/chosen.ratio)*100 + "vw");
        
        if(isFullscreen()){
          $screen.css("height", "100%");
          let ratio = $(window).width()/$(window).height();
          if(ratio > chosen.ratio){
            $box.css("width", chosen.ratio*100 + "vh")
              .css("height", "100%");
          } else{
            $box.css("width", "100%")
              .css("height", (1/chosen.ratio)*100 + "vw");
          }
          
        } else{
          $screen.css("height", (1/chosen.ratio)*100 + "vw");
          $box.css("width", "100%")
              .css("height", "100%");
        }
        
        
        
        return chosen.name;
      };
      
      next(); //initialise
      return next;
    })();
    
    
    const fullscreen = function(){
      let screen = $screen[0];
      if(screen.requestFullscreen){
        screen.requestFullscreen();
      } else if (screen.webkitRequestFullscreen){
        screen.webkitRequestFullscreen();
      } else if (screen.mozRequestFullScreen){
        screen.mozRequestFullScreen();
      } else if (screen.msRequestFullscreen){
        screen.msRequestFullscreen();
      }
    };
    
    $(document).on('webkitfullscreenchange mozfullscreenchange fullscreenchange', function(event){
        let fsClass = "flexile-fullscreen";
        if(isFullscreen()){
          $screen.addClass(fsClass);
        } else{
          $screen.removeClass(fsClass);
        }
        aspect();
    });
    
    
    const keyMap = (function(){
      let out = new Map([
        [65, "aspect"], //a
        [70, "fullscreen"], //f
        [84, "theme"], //t
        [37, "previous"], //left arrow
        [39, "next"], //right arrow
        [219, "first"], //[
        [221, "last"] //]
      ]);
    
      for(let i = 0; i < 10; i++){
        out.set(i + 48, i);
      }
      
      return out;
    })();
    
    
    $slides.each(function(index, slide){
      let $slide = $(slide);
      $slide.css("z-index", nSlides - index);
      moveSlide.replace($slide);
    });
    
    top.set(0);
    
    
    $(document).keydown(function(event){
      
      //Assume they're trying to do something else if modifier key is pressed
      if(event.altKey || event.ctrlKey || event.metaKey || event.shiftKey){return;}
      
      let code = keyMap.get(event.keyCode);
      //debugger;
      //If no mapping defined then just exit
      if(code === undefined){return;}
      
      //If key is mapped then stop event going any further
      event.preventDefault();
      
      if(code === "aspect"){
        aspect(1);
        return;
      }
      
      if(code === "fullscreen"){
        fullscreen();
        return;
      }      
      
      if(code === "theme"){
        //doTheme();
        return;
      }    
      
      
      if(["previous", "next", "first", "last"].indexOf(code) !== -1 || Number.isFinite(code)){
        let newSlide;
        switch(code){
          case "previous":
            newSlide = top.index() - 1;
            break;
          case "next":
            newSlide = top.index() + 1;
            break;
          case "first":
            newSlide = 0;
            break;
          case "last":
            newSlide = nSlides -1;
            break;
          default:
            newSlide = code;
            break;
        }
        changeSlide(newSlide);
        return;
      }
      
      
    });
    
  };
  
  
  flexile.create("#presentation");
});