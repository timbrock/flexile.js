let flexile = (function(){
  
  "use strict";
  
  const stringRep = function(entity){
    return Object.prototype.toString.call(entity);
  };
  
  const isObject = function(obj){return stringRep(obj) === "[object Object]";};
  
  const isArray = function(arr){return Array.isArray(arr);};
  const isFiniteNumber = function(num){return Number.isFinite(num);};
  const isInteger = function(num){return Number.isInteger(num);};
  const isString = function(string){return stringRep(string) === "[object String]";};
  const isFunction = function(func){return stringRep(func) === "[object Function]";};
  
  const hasDuplicates = function(arr){return isArray(arr) && (new Set(arr)).size !== arr.length;};
  
  const isSimpleString = (function(){
    let classReg = /^[A-Za-z\d_-]+$/i;
    return function(string){
      return  isString(string) && classReg.test(string);
    };
  })();

  const hasProperties = function(obj, ...names){
    return names.every(function(name){return obj.hasOwnProperty(name);});
  };
  
  const errors = function(obj){
    let errs = [];
    if(!obj.themes.length){
      errs.push("No themes specified");
    }
    if(!obj.transitions.length){
      errs.push("No transitions specified");
    }
    if(!obj.aspects.length){
      errs.push("No aspects specified");
    }
    let keyCodes = obj.keys.map(function(el){return el.code;});
    if(hasDuplicates(keyCodes)){
      errs.push("Invalid keys");
    }
    return errs.length ? errs : false;
  };
  
  
  
  //jQuery imitation
  let $el = (function(){
  
    let $elout;
    
    const isNode = function(node){
      return !!node.nodeName;
    };
    
    const isNodeList = function(nodes){
      let result = stringRep(nodes);
      return result === "[object HTMLCollection]" || result === "[object NodeList]";
    };

    const removeDuplicates = function(arr, sortFunc){
      let temp = new Set(arr);
      let newArr = Array.from(temp);
      if(sortFunc){
        newArr.sort(sortFunc);
      }
      return newArr;
    };

    const camelify = (function(){
      let reg = /-([a-z])/gi;
      return function(string){
        return string.replace(reg, function(s, group1) {
            return group1.toUpperCase();
        });
      }; 
    })();

    const splitOnWhiteSpace = (function(){
      let reg = /\s/g;
      return function(string){
        return string.split(reg);
      };
    })();

    const hasClass = function(className){
      let value;
      let el = this[0];
      if(el.classList){
        value = el.classList.contains(className);
      } else{
        value = new RegExp('(^| )' + className + '( |$)', 'gi').test(el.className);
      }
      return value;
    };

    const addClass = function(className){
      this.forEach(function(el){
        if(el.classList){
          el.classList.add(className);
        } else{
          el.className += ' ' + className;
        }
      });
      return this;
    };

    const removeClass = function(className){
      this.forEach(function(el){
        if(el.classList){
          el.classList.remove(className);
        }else{
            el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
        }
      });
      return this;
    };

    const attr = function(attribute, value){
      if(value !== undefined){
        this.forEach(function(el){
          el.setAttribute(attribute, value);
        });
        return this;
      }
      return this[0].getAttribute(attribute);
    };

    const removeAttr = function(attribute){
      this.forEach(function(el){
        el.removeAttribute(attribute);
      });
      return this;
    };

    const subselect = function(nodes, cssQuery){
      let $allNodes = $elout(nodes);
      if(!cssQuery){return $allNodes;}
      let $allQueryMatches = $elout(cssQuery);
      let selectedNodes = [];
      $allNodes.forEach(function(el){
        if($allQueryMatches.includes(el)){
          selectedNodes.push(el);
        }
      });
      return $elout(selectedNodes);
    };

    const sortByDom = function(a, b){
      let out = 0;
      if(a !== b){
        if(a.compareDocumentPosition(b) & 2){
          // b comes before a
          out = 1;
        } else{
          out = -1;
        }
      }
      return out;
    };
    
    const parent = function(cssQuery){
      let parentArray = [];
      this.forEach(function(el){
        parentArray.push(el.parentNode);
      });
      return subselect(removeDuplicates(parentArray, sortByDom), cssQuery);
    };

    const children = function(cssQuery){
      let childArray = [];
      this.forEach(function(el){
        Array.from(el.children).forEach(function(child){childArray.push(child);});
      });
      return subselect(childArray, cssQuery);
    };

    const wrapChildren = function(element, className = ""){
      let newNodes = [];
      this.forEach(function(el){
        let newEl = document.createElement(element);
        if(className){
          newEl.setAttribute('class', className);
        }
        let children = Array.from(el.children);
        children.forEach(function(child){
          newEl.appendChild(child);
        });
        el.appendChild(newEl);
        newNodes.push(newEl);
      });
      return $elout(newNodes);
    };

    const eq = function(n){
      return (n < this.length) ? $elout(this[n]) : $elout();
    };

    const css = function(property, value){
      if(value !== undefined){
        this.forEach(function(el){
          el.style[camelify(property)] = value;
        });
        return this;
      }
      return window.getComputedStyle(this[0])[property];
    };

    const width = function(){
      return parseInt(window.getComputedStyle(this[0]).width, 10);
    };

    const height = function(){
      return parseInt(window.getComputedStyle(this[0]).height, 10);
    };
    
    const filter = function(filterFunc){
      let keep = [];
      this.forEach(function(el, index){
        if(filterFunc(el, index)){
          keep.push(el); 
        }
      });
      return $elout(keep);
    };

    const on = function(eventNamesString, eventHandler){
      let eventNames = splitOnWhiteSpace(eventNamesString);
      this.forEach(function(el){
        for(let eventName of eventNames){
          el.addEventListener(eventName, eventHandler, false);        
        }
      });
      return this;
    };

    const off = function(eventNamesString, eventHandler){
      let eventNames = splitOnWhiteSpace(eventNamesString);
      this.forEach(function(el){
        for(let eventName of eventNames){
          el.removeEventListener(eventName, eventHandler, false);        
        }
      });
      return this;
    };


    $elout = function(selector){

      let $election;

       if(selector === window || selector === document){ //window or document
        $election = [selector];
        $election.on = on.bind([selector]);
        $election.off = off.bind([selector]);
        if(selector === window){
          $election.width = function(){return window.innerWidth;};
          $election.height = function(){return window.innerHeight;};
        }
        return $election;
      } else if(isString(selector)){ //css querry
        $election = Array.from(document.querySelectorAll(selector));
      } else if(isNodeList(selector) || (isArray(selector) && selector.every(isNode))){ //list or array of nodes
        $election = Array.from(selector);
      } else if(isNode(selector)){ //single node
        $election = [selector];
      } else{ //anything else
        $election = [];
      }

      $election.hasClass = hasClass.bind($election);
      $election.addClass = addClass.bind($election);
      $election.removeClass = removeClass.bind($election);
      $election.attr = attr.bind($election);
      $election.removeAttr = removeAttr.bind($election);
      $election.parent = parent.bind($election);
      $election.children = children.bind($election);
      $election.wrapChildren = wrapChildren.bind($election);
      $election.eq = eq.bind($election);
      $election.css = css.bind($election);
      $election.width = width.bind($election);
      $election.height = height.bind($election);
      $election.filter = filter.bind($election);
      $election.on = on.bind($election);
      $election.off = off.bind($election);

      return $election;
    };

    return $elout;

  })();

  
  const helpers = (function(){
    
    let themes = {
      light: {name: "light"}, 
      dark: {name: "dark"},
      white: {name: "white"}, 
      black: {name: "black"},
    };
    
    let transitions = {
      default: {name: "default", description: "Disappear instantly."},
      fade: {name: "fade", description: "Fade out to become completely transparent."},
      right: {name: "slide-right", description: "Slide off to the right of the screen."}
    };
    
    let aspects = {
      wide: {name: "wide", aspect: 16/9, description: "Typical widescreen TV aspect"},
      monitor: {name: "monitor", aspect: 16/10, description: "Preferred aspect of some monitors"},
      traditional: {name: "traditional", aspect: 4/3, description: "iPad or CRT monitor"},
      phone: {name: "phone", aspect: 9/16, description: "Typical phone in portrait mode"},
      square: {name: "square", aspect: 1},
      cinema: {name: "cinema", aspect: 2.39},
      a4p: {name: "a4-portrait", aspect: 210/297},
      a4l: {name: "a4-landscape", aspect: 297/210}
    };
    
    let keys = {
      lrpn: [
        {code: 37, value: "previous", type: "arrow", description: "left-arrow key move to previous slide"},
        {code: 39, value: "next", type: "arrow", description: "lright-arrow key move to next slide"},
      ],
      numbers0: [
        {code: 48, value: 0, type: "number", description: "0 goes to slide at beginning"},
        {code: 49, value: 1, type: "number"},
        {code: 50, value: 2, type: "number"},
        {code: 51, value: 3, type: "number"},
        {code: 52, value: 4, type: "number"},
        {code: 53, value: 5, type: "number"},
        {code: 54, value: 6, type: "number"},
        {code: 55, value: 7, type: "number"},
        {code: 56, value: 8, type: "number"},
        {code: 57, value: 9, type: "number"},
      ],
      numbers1: [
        {code: 49, value: 0, type: "number", description: "1 goes to slide at beginning"},
        {code: 50, value: 1, type: "number"},
        {code: 51, value: 2, type: "number"},
        {code: 52, value: 3, type: "number"},
        {code: 53, value: 4, type: "number"},
        {code: 54, value: 5, type: "number"},
        {code: 55, value: 6, type: "number"},
        {code: 56, value: 7, type: "number"},
        {code: 57, value: 8, type: "number"},
        {code: 48, value: 9, type: "number", description: "0 goes to 10th slide"},
      ],
      
    };
    
    return {themes, transitions, aspects, keys};
    
  })();

  
  const config = function(chain = true){
    
    const isClassSuffixObject = function(obj){
      return hasProperties(obj, "name") && isSimpleString(obj.name);
    };
    
    const isAspectObject = function(obj){
      let valid = false;
      if(hasProperties(obj, "name", "aspect")){
        if(isSimpleString(obj.name) && isFiniteNumber(obj.aspect)){
          valid = true;
        }
      }
      return valid;
    };
    
    const isKeyObject = function(obj){
      let valid = false;
      if(hasProperties(obj, "code", "value")){
        if(isInteger(obj.code) && (isSimpleString(obj.value) || isInteger(obj.value))){
          valid = true;
        }
      }
      return valid;
    };
  
    const isValueType = (function(){
      let valueTypes = ["string", "number", "boolean", "undefined", "null"];
      return function(item){
        let type = (item !== null) ? typeof item : "null";
        return valueTypes.includes(type);
      };
    })();
      
    const valueCloneObj = function(obj){
      let out = {};
      if(!isObject(obj)){return undefined;}
      Object.keys(obj).forEach(function(key){
        out[key] = isValueType(obj[key]) ? obj[key] : undefined;
      });
      return out;
    };
    
    const valueCloneObjArray = function(arr){
      let out = [];
      if(!isArray(arr)){return undefined;}
      for(let obj of arr){
        if(!isObject(obj)){return undefined;}
        out.push(valueCloneObj(obj));
      }
      return out;
    };
    
    
    const changeItems = function(arr, checkFunc, defProp = "", add = false){
      
      const wrap = (function(items){
        
        const objectify = (function(){
          let func;
          if(defProp && isString(defProp)){
            func = function(item){return {[defProp]: item};};
          } else{
            func = function(){return false;};
          }
          return func;
        })();
        
        return function(items){
          items = isArray(items) ? items : [items];
          let out = [];
          for(let item of items){
            let current = isObject(item) ? item : objectify(item);
            if(!current){
              return false;
            }
            out.push(current);
          }
          return out;
        };
         
      })();
      
      
      return function(items){
      
        if(items === undefined || (isArray(items) && items.length === 0)){
          if(!add){
            arr.length = 0;
          }
          return 0;
        }
        
        let valid = false;
        
        items = wrap(items);
        if(items){
          let err = false;
          for(let item of items){
            if(!checkFunc(item)){
              err = true;
              break;
            }
          }
          valid = err ? false : items.length;
        }
        
        if(valid !== false){
          if(add){
            items.forEach(function(item){
              arr.push(valueCloneObj(item));
            });
          } else{
            arr.length = items.length;
            items.forEach(function(item, index){
              arr[index] = valueCloneObj(item);
            });
          }
        }
        
        return valid;
      };
    };
    
    
    
    const removeItems = function(arr, def){
       
      return function(items, prop = def){

        let nStart = arr.length;
        let removed = 0;

        if(nStart && items !== undefined){
        
          if(isValueType(items)){
            items = [items];
          }
          
          if(isArray(items)){
            
            let isMatch = function(a, b){
              return b.hasOwnProperty(prop) && a === b[prop];
            };
            
            for(let item of items){
              let index = 0;
              while(index < arr.length){
                if(isMatch(item, arr[index])){
                  arr.splice(index, 1);                 
                  removed++;
                } else{
                  index++;
                }
              }
              if(arr.length === 0){break;}
            }
          }
          
        }

        return removed;
      };
    };
    
    
    const themesObj = (function(){
      const themes = [helpers.themes.light];
      return{
        set: changeItems(themes, isClassSuffixObject, "name"),
        add: changeItems(themes, isClassSuffixObject, "name", true),
        remove: removeItems(themes, "name"),
        errors: function(){return !themes.length;},
        getClone: function(){return valueCloneObjArray(themes);}
      };
    })();
    
    const transitionsObj = (function(){
      const transitions = [helpers.transitions.default];
      return{
        set: changeItems(transitions, isClassSuffixObject, "name"),
        add: changeItems(transitions, isClassSuffixObject, "name", true),
        remove: removeItems(transitions, "name"),
        errors: function(){return !transitions.length;},
        getClone: function(){return valueCloneObjArray(transitions);}
      };
    })();
    
    const aspectsObj = (function(){
      const aspects = [helpers.aspects.wide];
      return{
        set: changeItems(aspects, isAspectObject),
        add: changeItems(aspects, isAspectObject, "", true),
        remove: removeItems(aspects, "name"),
        errors: function(){return !aspects.length;},
        getClone: function(){return valueCloneObjArray(aspects);}
      };
    })();
    
    const keysObj = (function(){
      const keys = [];
      return{
        set: changeItems(keys, isKeyObject),
        add: changeItems(keys, isKeyObject, "", true),
        remove: removeItems(keys, "code"),
        errors: function(){return false;},
        getClone: function(){return valueCloneObjArray(keys);}
      };
    })();
    
    const getClone = function(){
      return{
        themes: themesObj.getClone(),
        transitions: transitionsObj.getClone(),
        aspects: aspectsObj.getClone(),
        keys: keysObj.getClone(),
      };
    };
    
    return{
      setThemes: chain ? function(items){themesObj.set(items); return this;}: themesObj.set,
      addThemes: chain ? function(items){themesObj.add(items); return this;}: themesObj.add,
      removeThemes: chain ? function(items, prop){themesObj.remove(items, prop); return this;}: themesObj.remove,
      setTransitions: chain ? function(items){transitionsObj.set(items); return this;}: transitionsObj.set,
      addTransitions: chain ? function(items){transitionsObj.add(items); return this;}: transitionsObj.add,
      removeTransitions: chain ? function(items, prop){transitionsObj.remove(items, prop); return this;}: transitionsObj.remove,
      setAspects: chain ? function(items){aspectsObj.set(items); return this;}: aspectsObj.set,
      addAspects: chain ? function(items){aspectsObj.add(items); return this;}: aspectsObj.add,
      removeAspects: chain ? function(items, prop){aspectsObj.remove(items, prop); return this;}: aspectsObj.remove,
      setKeys: chain ? function(items){keysObj.set(items); return this;}: keysObj.set,
      addKeys: chain ? function(items){keysObj.add(items); return this;}: keysObj.add,
      removeKeys: chain ? function(items, prop){keysObj.remove(items, prop); return this;}: keysObj.remove,
      errors: function(){return errors(getClone());},
      getClone: getClone
    };
    
  
  };
  
  
  
  const create = function(container, configuration = config()){
  
    const setup = (function(){
      let out = false;
      if(hasProperties(configuration, "getClone") && isFunction(configuration.getClone)){
        out = configuration.getClone();
      }
      return out;
    })();

    if($el(container).length !== 1 || !setup || errors(setup)){
      return false;
    }
    
    
    let $slideshow = $el(container).addClass("flexile-slideshow");
    let $slides = $slideshow.children("section").addClass("flexile-slide");
    let $screen = $slideshow.wrapChildren("div", "flexile-screen");
    let $box = $screen.wrapChildren("div", "flexile-box");
    let $window = $el(window);
    let $document = $el(document);
    let nSlides = $slides.length;
    
    
    $slides.forEach(function(el, index){
      $el(el).css("z-index", nSlides - index)
        .wrapChildren("div", "flexile-slide-content");
    });
    
    
    const update = (function(){
      
      const isFullscreen = function(){
        return document.fullScreen || document.mozFullScreen || document.webkitIsFullScreen;
      };
      
      const updateAspectRatio = function(){
        let aspect = aspects.get().aspect;
        let fsClass = "flexile-fullscreen";
        
        if(isFullscreen()){
          $screen.addClass(fsClass)
            .css("height", "100%");
          let ratio = $window.width()/$window.height();
          if(ratio > aspect){
            $box.css("width", aspect*100 + "vh")
              .css("height", "100%");
          } else{
            $box.css("width", "100%")
              .css("height", (1/aspect)*100 + "vw");
          }
        } else{
          $screen.removeClass(fsClass)
            .css("height", (1/aspect)*100 + "vw");
          $box.css("width", "100%")
              .css("height", "100%");
        }
      };
      
      const updateFontSize = function(){
        let baseSize = parseFloat($slideshow.css("font-size"));
        let newSize = ($box.width()/1000)*baseSize + "px";
        $box.css("font-size", newSize);
      };
      
      return function(){
        updateAspectRatio();        
        updateFontSize();
      };
      
    })();
    
    
    const storeCreator = function(arr, changeFunc, ...properties){
      const store = [];
    
      const putStore = (function(){
        let func;
        if(properties.length === 1){
          func = function(item){store.push(item[properties[0]]);};
        } else{
          func = function(item){
            let obj = {};
            properties.forEach(function(property){
              obj[property] = item[property];
            });
            store.push(obj);
          };
        }
        return func;
      })();
      
      arr.forEach(putStore);
      
      Object.freeze(store);
      let storeIndex = 0;
      const n = store.length;
      
      const currentName = (function(){
        let func;
        if(isString(store[storeIndex])){
          func = function(){return store[storeIndex];};
        } else{
          func = function(){return store[storeIndex].name;};
        }
        return func;
      })();
      
      changeFunc(currentName());
      
      return{
        get: function(){return store[storeIndex];},
        
        set: function(value){
          let change = false;
          if(n > 1){
            if(value !== undefined){
              let index = store.indexOf(value);
              if(index !== -1){
                storeIndex = index;
                change = value;
              }
            } else{
                storeIndex = (storeIndex + 1) % n;
                change = store[storeIndex];
            }
            changeFunc(currentName());
            update();
          }
          return change;
        },
        
        get n(){return n;}
      };
       
    };
    
    
    let changeClass = function($elements, midfix){
      let prefix = "flexile-" + midfix + "-";
      let reg = new RegExp("\\b" + prefix + "[A-Za-z\d_-]+", "g");
      let remove = function($el){
        ($el.attr("class").match(reg) || []).forEach(function(oldClass){
          $el.removeClass(oldClass);
        });
      };
      return function(newClassSuffix){
        $elements.forEach(function(el){
          remove($el(el));    
        });
        $elements.addClass(prefix + newClassSuffix);
      };
    };
    
    const themes = storeCreator(setup.themes, changeClass($slideshow, "theme"), "name");
    const aspects = storeCreator(setup.aspects, changeClass($slideshow, "aspect"), "name", "aspect");
    
    const transitions = (function(){
      let reg = /\bflexile-transition-[A-Za-z\d_-]+/g;
      let $changeTransitionSlides = $slides.filter(function(el){
        return !$el(el).attr("class").match(reg);
      });
      return storeCreator(setup.transitions, changeClass($changeTransitionSlides, "transition"), "name");
    })();
    
    const keyMap = (function(){ 
      const map = new Map();
      for(let pair of setup.keys){
        map.set(pair.code, pair.value);
      } 
      return Object.freeze(map); 
    })();
    
    
    const moveSlide = (function(){
      let stackClass = "flexile-slide-stack"; //class for slide that is not yet discarded
      let discardClass = "flexile-slide-discard";
      let animateClass = "flexile-animate-transition";
      
      $slides.addClass(stackClass);
      $slides.on('transitionend oTransitionEnd transitionend webkitTransitionEnd', function(event){
        $el(this).removeClass(animateClass);
      });
      //return object with functions to change classes that should push slides on or off screen.
      return{
        discard: function($handle){
          $handle.removeClass(stackClass)
            .addClass(animateClass)
            .addClass(discardClass);
        },
        replace: function($handle){
          $handle.removeClass(discardClass)
            .addClass(animateClass)
            .addClass(stackClass);
        },
      };
    })();
    
    //Object for changing and keeping track of which slide is visible on "top" of the screen.
    const top = (function(){
      let idx;
      let topClass = "flexile-slide-top";
      const getCurrent = function(){return $slides.eq(idx);}; //returns wrapper of slide on top of stack
      return {
        get index(){return idx;},
        set index(i){
          if(idx !== undefined){
            getCurrent().removeClass(topClass);
          }
          idx = i;
          getCurrent().addClass(topClass);
        },
        get handle(){return getCurrent();} 
      };
    })();
    
    top.index = 0;
    
    //Checks if number corresponds to a real slide before moving slides that require moving on to or off stack
    const changeSlide = function(num){
      let current = top.index;
      if((num < 0) || (num >= nSlides) || (num === current)){return;}

      if(num > current){
        let first = current;
        let last = num; 
        for(let i = first; i < last; i++){
          moveSlide.discard($slides.eq(i));
        }
      } else{
        let first = num;
        let last = current;
        for(let i = first; i < last; i++){
          moveSlide.replace($slides.eq(i));
        }
      }
      
      top.index = num;
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
    
    
    $window.on("resize", update);
    
    if(keyMap.size){
      $document.on("keydown", function(event){
      
        //Assume they're trying to do something else if modifier key is pressed
        if(event.altKey || event.ctrlKey || event.metaKey || event.shiftKey){return;}

        let value = keyMap.get(event.keyCode);

        //If no mapping defined then just exit
        if(value === undefined){return;}

        //If key is mapped then stop event going any further
        event.preventDefault();

        if(value === "aspect"){
          aspects.set();
          return;
        }

        if(value === "fullscreen"){
          fullscreen();
          return;
        }      

        if(value === "theme"){
          themes.set();
          return;
        }
        
        if(value === "transition"){
          transitions.set();
          return;
        }


        if(["previous", "next", "first", "last"].indexOf(value) !== -1 || Number.isFinite(value)){
          let newSlide;
          switch(value){
            case "previous":
              newSlide = top.index - 1;
              break;
            case "next":
              newSlide = top.index + 1;
              break;
            case "first":
              newSlide = 0;
              break;
            case "last":
              newSlide = nSlides -1;
              break;
            default:
              newSlide = value;
              break;
          }
          changeSlide(newSlide);
          return;
        }

      });
      
    }
    
  
    update();
    
    
  };
  
  
  return {
    helpers,
    config,
    create
  };
  
  
})();