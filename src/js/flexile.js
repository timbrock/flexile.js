let flexile = (function(){
  
  "use strict";
  
  //Array includes (ES2016) polyfill
  if(!Array.prototype.includes){
    Object.defineProperty(Array.prototype, 'includes', {
      value: function(searchElement, fromIndex) {
        if(this === null || this === undefined){throw new TypeError('"this" is null or not defined');}
        var o = Object(this);
        var len = o.length >>> 0;
        if(len === 0){return false;}
        var n = fromIndex | 0;
        var k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);
        while(k < len){
          if (o[k] === searchElement){return true;}
          k++;
        }
        return false;
      }
    });
  }
  
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
    let classReg = /^[A-Za-z\d_-]+$/;
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
      return node ? !!node.nodeName : false;
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
      vanish: {name: "vanish"},
      fade: {name: "fade"},
      right: {name: "right"}
    };
    
    let aspects = {
      wide: {name: "wide", aspect: 16/9},
      monitor: {name: "monitor", aspect: 16/10},
      traditional: {name: "traditional", aspect: 4/3},
      tall: {name: "tall", aspect: 9/16},
      square: {name: "square", aspect: 1},
      cinema: {name: "cinema", aspect: 2.39},
      a4p: {name: "a4-portrait", aspect: 210/297},
      a4l: {name: "a4-landscape", aspect: 297/210}
    };
    
    let keys = {
      lrpn: [
        {code: 37, value: "previous", type: "arrow"},
        {code: 39, value: "next", type: "arrow"},
      ],
      lrnp: [
        {code: 37, value: "next", type: "arrow"},
        {code: 39, value: "previous", type: "arrow"},
      ],
      udpn: [
        {code: 38, value: "previous", type: "arrow"},
        {code: 40, value: "next", type: "arrow"},
      ],
      udnp: [
        {code: 38, value: "next", type: "arrow"},
        {code: 40, value: "previous", type: "arrow"},
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

  //Create a configuration object that holds information on themes, aspects, transitions and keys
  const config = function(chain = true){
    
    const isClassSuffixObject = function(obj){
      return hasProperties(obj, "name") && isSimpleString(obj.name);
    };
    
    const isAspectObject = function(obj){
      let valid = false;
      if(hasProperties(obj, "name")){
        if(isSimpleString(obj.name)){
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
      
    const cloneObj = function(obj){
      let out = {};
      if(!isObject(obj)){return undefined;}
      Object.keys(obj).forEach(function(key){
        out[key] = obj[key];
      });
      return out;
    };
    
    const cloneObjArray = function(arr){
      let out = [];
      if(!isArray(arr)){return undefined;}
      for(let obj of arr){
        if(!isObject(obj)){return undefined;}
        out.push(cloneObj(obj));
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
              arr.push(cloneObj(item));
            });
          } else{
            arr.length = items.length;
            items.forEach(function(item, index){
              arr[index] = cloneObj(item);
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
        
          if(!isArray(items)){
            items = [items];
          }
                      
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

        return removed;
      };
    };
    
    
    const themesObj = (function(){
      const themes = [helpers.themes.light];
      return{
        set: changeItems(themes, isClassSuffixObject, "name"),
        add: changeItems(themes, isClassSuffixObject, "name", true),
        remove: removeItems(themes, "name"),
        getClone: function(){return cloneObjArray(themes);}
      };
    })();
    
    const transitionsObj = (function(){
      const transitions = [helpers.transitions.vanish];
      return{
        set: changeItems(transitions, isClassSuffixObject, "name"),
        add: changeItems(transitions, isClassSuffixObject, "name", true),
        remove: removeItems(transitions, "name"),
        getClone: function(){return cloneObjArray(transitions);}
      };
    })();
    
    const aspectsObj = (function(){
      const aspects = [helpers.aspects.wide];
      return{
        set: changeItems(aspects, isAspectObject, "name"),
        add: changeItems(aspects, isAspectObject, "name", true),
        remove: removeItems(aspects, "name"),
        getClone: function(){return cloneObjArray(aspects);}
      };
    })();
    
    const keysObj = (function(){
      const keys = [];
      return{
        set: changeItems(keys, isKeyObject),
        add: changeItems(keys, isKeyObject, "", true),
        remove: removeItems(keys, "code"),
        getClone: function(){return cloneObjArray(keys);}
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
  
  
  //Create slideshow given a CSS query (must select exactly one element) and a configuration object
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
    let $screen = $slideshow.wrapChildren("div", "flexile-screen");
    let $box = $screen.wrapChildren("div", "flexile-box");
    let $window = $el(window);
    let $document = $el(document);
     
    
    let $slides = (function(){
      let $layers = $box.children("section");
      let nLayers = $layers.length; 
      let out = $el();
      $layers.forEach(function(layer, index){
        let $layer = $el(layer);
        $layer.css("z-index", nLayers - index);
        if(!$layer.hasClass("flexile-static-layer")){
          $layer.addClass("flexile-slide");
          out.push(layer);
        }
      });
      return out;
    })();
                    
    let nSlides = $slides.length;
    
    
    const isFullscreen = function(){
      return document.fullScreen || document.mozFullScreen || document.webkitIsFullScreen;
    };
    
    const update = (function(){
      
      const updateFullscreenClass = function(){
        let fsClass = "flexile-fullscreen"; 
        if(isFullscreen()){
          $screen.addClass(fsClass);
        } else{
          $screen.removeClass(fsClass);
        }
      };
      
      const updateFontSize = function(){
        let baseSize = parseFloat($slideshow.css("font-size"));
        let newSize = ($box.width()/1000)*baseSize + "px";
        $screen.css("font-size", newSize);
      };
      
      return function(){
        updateFullscreenClass();        
        updateFontSize();
      };
      
    })();
    
    
    const storeCreator = function(arr, changeFunc){
      const store = [];
      
      arr.forEach(function(item){store.push(item.name);});
      
      Object.freeze(store);
      let storeIndex = 0;
      const n = store.length;
      
      const getCurrent = function(){return store[storeIndex];};
      
      changeFunc(getCurrent());
      
      return{
        get: function(){return getCurrent();},
        
        set: function(value){
          let change = false;
          if(n > 1){
            if(value !== undefined){
              let index = store.indexOf(value);
              if(index !== -1){
                storeIndex = index;
                change = getCurrent();
              }
            } else{
                storeIndex = (storeIndex + 1) % n;
                change = getCurrent();
            }
            if(change){
              changeFunc(getCurrent());
              update(); 
            }  
          }
          return change;
        },
        
        get n(){return n;}
      };
       
    };
    
    
   let changeClass = function($elements, midfix){
      let prefix = "flexile-" + midfix + "-";
      let reg = new RegExp("\\b" + prefix + "[A-Za-z\\d_-]+", "g");
      let remove = function($element){
        ($element.attr("class").match(reg) || []).forEach(function(oldClass){
          $element.removeClass(oldClass);
        });
      };
      return function(newClassSuffix){
        $elements.forEach(function(element){
          remove($el(element));    
        });
        $elements.addClass(prefix + newClassSuffix);
      };
    };
    
    const themes = storeCreator(setup.themes, changeClass($slideshow, "theme"), "name");
    const aspects = storeCreator(setup.aspects, changeClass($slideshow, "aspect"), "name");
    
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
    
    
    //Checks if number corresponds to a real slide before moving slides that require moving on to or off stack
    const topSlide = (function(){
      
      let topIndex;
      const getCurrent = function(){return $slides.eq(topIndex);};
      let topClass = "flexile-slide-top";
      let startClass = "flexile-first-slide";
      let endClass = "flexile-last-slide";
      let stackClass = "flexile-slide-stack"; //class for slide that is not yet discarded
      let discardClass = "flexile-slide-discard";
      
      const moveSlide = (function(){  
        $slides.addClass(stackClass);
        //return object with functions to change classes that should push slides on or off screen.
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
      
      const getTopSlide = function(){return topIndex;};
      
      const setTopSlide = function(num){
        let oldNum = topIndex;
        if((num < 0) || (num >= nSlides) || (num === oldNum)){return false;}
        
        if(oldNum !== undefined){
          getCurrent().removeClass(topClass);
        }
        
        if(oldNum === 0){
          $box.removeClass(startClass);  
        }
        if(oldNum === nSlides - 1){
          $box.removeClass(endClass);
        }
        if(num === 0){
          $box.addClass(startClass); 
        }
        if(num === nSlides - 1){
          $box.addClass(endClass);
        }

        if(num > oldNum){
          let first = oldNum;
          let last = num; 
          for(let i = first; i < last; i++){
            moveSlide.discard($slides.eq(i));
          }
        } else{
          let first = num;
          let last = oldNum;
          for(let i = first; i < last; i++){
            moveSlide.replace($slides.eq(i));
          }
        }

        topIndex = num;
        getCurrent().addClass(topClass);

        return true;
      };
      
      return{
        get: getTopSlide,
        set: setTopSlide
      };
      
    })();
    
    topSlide.set(0);
    
    //Function that actually implements transition to fullscreen mode (if available)
    const fullscreen = (function(){
      let screen = $screen[0];
      
      const onFunc = function(){
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
      
      const offFunc = function(){
        if (document.exitFullscreen){
            document.exitFullscreen();
        } else if(document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if(document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if(document.msExitFullscreen) {
            document.msExitFullscreen();
        }
      };
        
      return{
        on: function(){if(!isFullscreen()){onFunc();}},
        off: function(){if(isFullscreen()){offFunc();}},
        toggle: function(){if(isFullscreen()){offFunc();}else{onFunc();}}
      };
      
    })();
        
    
    const turnKeys = (function(){
      
      const keyFunc = function(event){
        if(keyMap.size){

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
            fullscreen.toggle();
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
                newSlide = topSlide.get() - 1;
                break;
              case "next":
                newSlide = topSlide.get() + 1;
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
            topSlide.set(newSlide);
            return;
          }
          
        }
      };

      let keysOn;
      
      let out = {
        on: function(){if(!keysOn){$document.on("keydown", keyFunc); keysOn = true;}},
        off: function(){if(keysOn){$document.off("keydown", keyFunc); keysOn = false;}},
        toggle: function(){
          if(keysOn){$document.off("keydown", keyFunc);}
          else{$document.on("keydown", keyFunc);}
          keysOn = !keysOn;
        }
      };
      
      out.on();
      
      return out;
      
    })();
    
    $window.on("resize", update);
    update();
    
    
    return{
      firstSlide: function(){topSlide.set(0); return this;},
      lastSlide: function(){topSlide.set(nSlides-1); return this;},
      previousSlide: function(){topSlide.set(topSlide.get() - 1); return this;},
      nextSlide: function(){topSlide.set(topSlide.get() + 1); return this;},
      nthSlide: function(num){if(isFiniteNumber(num)){topSlide.set(num);} return this;},
      changeTheme: function(name){themes.set(name); return this;},
      changeTransition: function(name){
        $slides.addClass("flexile-animation-off");
        transitions.set(name);
        $slides.removeClass("flexile-animation-off");
        return this;
      },
      changeAspect: function(name){aspects.set(name); return this;},
      turnOnFullscreen: function(name){fullscreen.on(); return this;},
      turnOffFullscreen: function(name){fullscreen.off(); return this;},
      toggleFullscreen: function(name){fullscreen.toggle(); return this;},
      turnOnKeys: function(name){turnKeys.on(); return this;},
      turnOffKeys: function(name){turnKeys.off(); return this;},
      toggleKeys: function(name){turnKeys.toggle(); return this;},
      update
    };
    
    
  };
  
  
  return {
    helpers,
    config,
    create
  };
  
  
})();