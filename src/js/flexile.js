$(document).ready(function(){
	
	"use strict";
  
  const flexile = function(){
    
    //Default values		
		let props = {
      
      aspects: [
        {name: "wide", ratio: 16/9},
        {name: "monitor", ratio: 16/10},
        {name: "traditional", ratio: 4/3},
        {name: "square", ratio: 1},
        {name: "cinema", ratio: 2.39},
        {name: "a4-portrait", ratio: 210/297},
        {name: "a4-landscape", ratio: 297/210}
      ],
      
			transitionClass: "default",
      
      themeClasses: ["light", "dark", "white", "black"],
      
      keyMap: (function(){
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
      })()
      
		};
    
    //jQuery selections
    let $slideshow, $slides, $screen, $box;
    let nSlides; //number of slides
    
    //move element from front of array to back, bump everything else up one
    const frontToBack = function(arr){arr.push(arr.shift());};
    
    const moveSlide = (function(){
      let stackClass = "flexile-slide-stack"; //class for slide that is not yet discarded
      let discardClass = "flexile-slide-discard";
      //return object with functions to change classes that should push slides on or off screen.
      return{
        discard: function($handle){
          $handle.removeClass(stackClass)
            .addClass("flexile-animate-transition")
            .addClass(discardClass);
        },
        replace: function($handle){
          $handle.removeClass(discardClass)
            .addClass("flexile-animate-transition")
            .addClass(stackClass);
        },
      };
    })();
    
    //Object for changing and keeping track of which slide is visible on "top" of the screen.
    const top = (function(){
      let idx;
      let topClass = "flexile-slide-top";
      const getCurrent = function(){return $($slides[idx]);}; //returns jQuery wrapper of slide on top of stack
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
    
    //Checks if number corresponds to a real slide before moving slides that require moving on to or off stack
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
    
    //Change theme to whatever is currently first in themeClasses property
    const theme = function(){
      let classes = $slideshow.attr("class");
      let themeReg = /\bflexile-theme-\S+/;
      (classes.match(themeReg) || []).forEach(function(themeClass){
        $slideshow.removeClass(themeClass);
      });
      $slideshow.addClass("flexile-theme-" + props.themeClasses[0]);
      fontSize();
    };
    
    //Helper function to check whether currently in fullscreen mode
    const isFullscreen = function(){
      return document.fullScreen || document.mozFullScreen || document.webkitIsFullScreen;
    };
    
    //Function that actually implements transition to fullscreen mode (if available)
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
    
    //Set fontsize based on current width of box
    const fontSize = function(){
      let baseSize = parseFloat($slideshow.css("font-size"));
      let newSize = ($box.width()/1000)*baseSize;
      console.log(props.aspects[0], $box.width());
      $box.css("font-size", newSize);
    };
    
    $(window).on("resize", function(){fontSize();});
    
    //Principal function for creating the presentation.
    const build = function(container){
      
      $slideshow = $(container).addClass("flexile-slideshow");
      $slides = $slideshow.children("section").addClass("flexile-slide");
      $screen = $slides.wrapAll("<div></div>").parent().addClass("flexile-screen");
      $box = $slides.wrapAll("<div></div>").parent().addClass("flexile-box");
    
      nSlides = $slides.length;
      theme();
      
      {
        let transReg = /\bflexile-transition-\S+/;
      
        $slides.each(function(index, slide){
          let $slide = $(slide);

          $slide.css("z-index", nSlides - index)
            .children().wrapAll("<div></div>").parent().addClass("flexile-slide-content");

          if($slide.attr("class").search(transReg) === -1){
            $slide.addClass("flexile-transition-" + props.transitionClass);
          }

          moveSlide.replace($slide);
        });      
      }
      
      top.set(0);
      
      //$slideshow.addClass(props.transitionClass);
      
      const aspect = (function(){
        
        let aspects = props.aspects;
        let nAspects = aspects.length;
        let current = 0;

        let next = function(change = 0){
          let chosen = aspects[current];

          if(change){
            $slideshow.removeClass("flexile-aspect-" + chosen.name);
            current = (current + change) % nAspects;
            chosen = aspects[current];
            $slideshow.addClass("flexile-aspect-" + chosen.name);
            fontSize();
          }

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
      
      $slides.on('transitionend oTransitionEnd transitionend webkitTransitionEnd', function(event){
        $(this).removeClass("flexile-animate-transition");
      });
      
      $(document).on('webkitfullscreenchange mozfullscreenchange fullscreenchange', function(event){
        let fsClass = "flexile-fullscreen";
        if(isFullscreen()){
          $screen.addClass(fsClass);
        } else{
          $screen.removeClass(fsClass);
        }
        aspect();
      });
      
      
      $(document).keydown(function(event){
      
        //Assume they're trying to do something else if modifier key is pressed
        if(event.altKey || event.ctrlKey || event.metaKey || event.shiftKey){return;}

        let code = props.keyMap.get(event.keyCode);
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
          frontToBack(props.themeClasses);
          theme();
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
    
    build.setTransition = function(name){
      props.transitionClass = name;
      return this;
    };
    
    build.setKey = function(pair){
      props.keyMap.set(pair[0], pair[1]);
      return this;
    };
    
    return build;
    
  };
  
  let thing = flexile()
    /*.setKey([37, "next"])
    .setKey([39, "previous"])*/
    .setTransition("shrink")
    ("#presentation");
  
  
});