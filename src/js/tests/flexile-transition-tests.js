(function(){

  "use strict";
  
  describe("Transitions functions", function(){
    
    describe("setTransitions function", function(){
      
      let func, obj, defName, defLen;
      
      beforeEach(function(){
        obj = flexile.config(false);
        func = obj.setTransitions;
        defName = obj.getClone().transitions[0].name;
        defLen = obj.getClone().transitions.length;
      });
      
      it("should return 0 and clear array if no argument", function(){  
        expect(func()).toBe(0);
        expect(obj.getClone().transitions.length).toBe(0);
      });

      it("should return 0 and clear array if empty array passed", function(){  
        expect(func([])).toBe(0);
        expect(obj.getClone().transitions.length).toBe(0);
      });
      
      it("should return false if inappropriate argument is passed", function(){  
        expect(func(1)).toBe(false);
        let transitions = obj.getClone().transitions;
        expect(transitions.length === defLen && transitions[0].name === defName).toBe(true);
        expect(func({})).toBe(false);
        transitions = obj.getClone().transitions;
        expect(transitions.length === defLen && transitions[0].name === defName).toBe(true);
        expect(func(/Regular expression/)).toBe(false);
        transitions = obj.getClone().transitions;
        expect(transitions.length === defLen && transitions[0].name === defName).toBe(true);
      });
      
      it("should return false if string that isn't class suffix is passed", function(){  
        expect(func(" ")).toBe(false);
        let transitions = obj.getClone().transitions;
        expect(transitions.length === defLen && transitions[0].name === defName).toBe(true);
        expect(func("$")).toBe(false);
        transitions = obj.getClone().transitions;
        expect(transitions.length === defLen && transitions[0].name === defName).toBe(true);
        expect(func("@@")).toBe(false);
        transitions = obj.getClone().transitions;
        expect(transitions.length === defLen && transitions[0].name === defName).toBe(true);
        expect(func("light dark")).toBe(false);
        transitions = obj.getClone().transitions;
        expect(transitions.length === defLen && transitions[0].name === defName).toBe(true);
      });
      
      it("should return 1 if string that is class suffix is passed, transitions should now reflect new name", function(){  
        let input = "light";
        expect(func(input)).toBe(1);
        let transitions = obj.getClone().transitions;
        expect(transitions.length === 1 && transitions[0].name === input).toBe(true);
        input = "very-light";
        expect(func(input)).toBe(1);
        transitions = obj.getClone().transitions;
        expect(transitions.length === 1 && transitions[0].name === input).toBe(true);
        input = "quite_dark";
        expect(func(input)).toBe(1);
        transitions = obj.getClone().transitions;
        expect(transitions.length === 1 && transitions[0].name === input).toBe(true);
      });
      
      it("should return 1 if suitable string is passed as name in obj, transitions should now reflect new name", function(){  
        let input = {name: "light"};
        expect(func(input)).toBe(1);
        let transitions = obj.getClone().transitions;
        expect(transitions.length === 1 && transitions[0].name === input.name).toBe(true);
        input = {name: "light", size: "big"};
        expect(func(input)).toBe(1);
        transitions = obj.getClone().transitions;
        expect(transitions.length === 1 && transitions[0].name === input.name).toBe(true);
      });
      
      it("should return false if unsuitable string is passed as name in obj", function(){  
        let input = {name: "very light"};
        expect(func(input)).toBe(false);
        let transitions = obj.getClone().transitions;
        expect(transitions.length === defLen && transitions[0].name === defName).toBe(true);
      });
      
      it("should return false if array with inappropriate values is passed", function(){  
        expect(func([" "])).toBe(false);
        let transitions = obj.getClone().transitions;
        expect(transitions.length === defLen && transitions[0].name === defName).toBe(true);
        expect(func(["hi", {x: 7}])).toBe(false);
        transitions = obj.getClone().transitions;
        expect(transitions.length === defLen && transitions[0].name === defName).toBe(true);
      });
      
      it("should return length of array input if suitable strings are passed, changing transitions to input", function(){  
        let input = ["light"];
        expect(func(input)).toBe(input.length);
        let transitions = obj.getClone().transitions;
        expect(transitions.length === input.length && transitions[0].name === input[0]).toBe(true);
        input = ["light", "very-light"];
        expect(func(input)).toBe(input.length);
        transitions = obj.getClone().transitions;
        expect(transitions.length === input.length && transitions[1].name === input[1]).toBe(true);
        input = ["light", "very-light", "quite_dark"];
        expect(func(input)).toBe(input.length);
        transitions = obj.getClone().transitions;
        expect(transitions.length === input.length && transitions[2].name === input[2]).toBe(true);
      });
      
      it("should return length of array input if suitable objects are passed, changing transitions to input", function(){  
        let input = [{name: "light"}];
        expect(func(input)).toBe(input.length);
        let transitions = obj.getClone().transitions;
        expect(transitions.length === input.length && transitions[0].name === input[0].name).toBe(true);
        input = [{name: "light"}, {name: "very-light", height: 1.6}];
        expect(func(input)).toBe(input.length);
        transitions = obj.getClone().transitions;
        expect(transitions.length === input.length && transitions[1].name === input[1].name).toBe(true);
        input = [{name: "light"}, {name: "very-light", width: "wide"}, {name: "quite_dark"}];
        expect(func(input)).toBe(input.length);
        transitions = obj.getClone().transitions;
        expect(transitions.length === input.length && transitions[2].name === input[2].name).toBe(true);
      });
      
      it("should return array length and update transitions if suitable string/object combo passed", function(){
        let input = ["light", {name: "very-light", height: 1.6}];
        expect(func(input)).toBe(input.length);
        let transitions = obj.getClone().transitions;
        expect(transitions.length === input.length && transitions[1].name === input[1].name).toBe(true);
        input = [{name: "light"}, {name: "very-light", width: "wide"}, {name: "quite_dark"}];
        expect(func(input)).toBe(input.length);
        transitions = obj.getClone().transitions;
        expect(transitions.length === input.length && transitions[2].name === input[2].name).toBe(true);
      });
      
    });
    
    
    describe("addTransistions function", function(){
      
      let func, obj, defName, defLen;
      
      beforeEach(function(){
        obj = flexile.config(false);
        func = obj.addTransitions;
        defName = obj.getClone().transitions[0].name;
        defLen = obj.getClone().transitions.length;
      });
      
      it("should return 0 and leave array unchanged if no argument", function(){  
        expect(func()).toBe(0);
        expect(obj.getClone().transitions.length).toBe(defLen);
      });

      it("should return 0 and leave array unchanged if empty array passed", function(){  
        expect(func([])).toBe(0);
        expect(obj.getClone().transitions.length).toBe(defLen);
      });
      
      it("should return false if inappropriate argument is passed", function(){  
        expect(func(1)).toBe(false);
        let transitions = obj.getClone().transitions;
        expect(transitions.length === defLen && transitions[0].name === defName).toBe(true);
        expect(func({})).toBe(false);
        transitions = obj.getClone().transitions;
        expect(transitions.length === defLen && transitions[0].name === defName).toBe(true);
        expect(func(/Regular expression/)).toBe(false);
        transitions = obj.getClone().transitions;
        expect(transitions.length === defLen && transitions[0].name === defName).toBe(true);
      });
      
      it("should return false if string that isn't class suffix is passed", function(){  
        expect(func(" ")).toBe(false);
        let transitions = obj.getClone().transitions;
        expect(transitions.length === defLen && transitions[0].name === defName).toBe(true);
        expect(func("$")).toBe(false);
        transitions = obj.getClone().transitions;
        expect(transitions.length === defLen && transitions[0].name === defName).toBe(true);
        expect(func("@@")).toBe(false);
        transitions = obj.getClone().transitions;
        expect(transitions.length === defLen && transitions[0].name === defName).toBe(true);
        expect(func("light dark")).toBe(false);
        transitions = obj.getClone().transitions;
        expect(transitions.length === defLen && transitions[0].name === defName).toBe(true);
      });
      
      it("should return 1 if string that is class suffix is passed, transitions should now reflect new name", function(){  
        let input = "light";
        expect(func(input)).toBe(1);
        let transitions = obj.getClone().transitions;
        expect(transitions.length === defLen + 1 && transitions[transitions.length-1].name === input).toBe(true);
        input = "very-light";
        expect(func(input)).toBe(1);
        transitions = obj.getClone().transitions;
        expect(transitions.length === defLen + 2 && transitions[transitions.length-1].name === input).toBe(true);
        input = "quite_dark";
        expect(func(input)).toBe(1);
        transitions = obj.getClone().transitions;
        expect(transitions.length === defLen + 3 && transitions[transitions.length-1].name === input).toBe(true);
      });
      
      it("should return 1 if suitable string is passed as name in obj, transitions should now reflect new name", function(){  
        let input = {name: "light"};
        expect(func(input)).toBe(1);
        let transitions = obj.getClone().transitions;
        expect(transitions.length === defLen + 1 && transitions[transitions.length-1].name === input.name).toBe(true);
        input = {name: "light", size: "big"};
        expect(func(input)).toBe(1);
        transitions = obj.getClone().transitions;
        expect(transitions.length === defLen + 2 && transitions[transitions.length-1].name === input.name).toBe(true);
      });
      
      it("should return false if unsuitable string is passed as name in obj", function(){  
        let input = {name: "very light"};
        expect(func(input)).toBe(false);
        let transitions = obj.getClone().transitions;
        expect(transitions.length === defLen && transitions[0].name === defName).toBe(true);
      });
      
      it("should return false if array with inappropriate values is passed", function(){  
        expect(func([" "])).toBe(false);
        let transitions = obj.getClone().transitions;
        expect(transitions.length === defLen && transitions[0].name === defName).toBe(true);
        expect(func(["hi", {x: 7}])).toBe(false);
        transitions = obj.getClone().transitions;
        expect(transitions.length === defLen && transitions[0].name === defName).toBe(true);
      });
      
      it("should return length of array input if suitable strings are passed, adding transitions", function(){  
        let input = ["light"];
        expect(func(input)).toBe(input.length);
        let transitions = obj.getClone().transitions;
        expect(transitions.length === defLen + input.length && transitions[transitions.length-1].name === input[input.length-1]).toBe(true);
        input = ["light", "very-light"];
        expect(func(input)).toBe(input.length);
        transitions = obj.getClone().transitions;
        expect(transitions.length >= defLen + input.length && transitions[transitions.length-1].name === input[input.length-1]).toBe(true);
        input = ["light", "very-light", "quite_dark"];
        expect(func(input)).toBe(input.length);
        transitions = obj.getClone().transitions;
        expect(transitions.length >= defLen + input.length && transitions[transitions.length-1].name === input[input.length-1]).toBe(true);
      });
      
      it("should return length of array input if suitable objects are passed, changing transitions to input", function(){  
        let input = [{name: "light"}];
        expect(func(input)).toBe(input.length);
        let transitions = obj.getClone().transitions;
        expect(transitions.length === defLen + input.length && transitions[transitions.length-1].name === input[input.length-1].name).toBe(true);
        input = [{name: "light"}, {name: "very-light", height: 1.6}];
        expect(func(input)).toBe(input.length);
        transitions = obj.getClone().transitions;
        expect(transitions.length >= defLen + input.length && transitions[transitions.length-1].name === input[input.length-1].name).toBe(true);
        input = [{name: "light"}, {name: "very-light", width: "wide"}, {name: "quite_dark"}];
        expect(func(input)).toBe(input.length);
        transitions = obj.getClone().transitions;
        expect(transitions.length >= defLen + input.length && transitions[transitions.length-1].name === input[input.length-1].name).toBe(true);
      });
      
      it("should return array length and update transitions if suitable string/object combo passed", function(){
        let input = ["light", {name: "very-light", height: 1.6}];
        expect(func(input)).toBe(input.length);
        let transitions = obj.getClone().transitions;
        expect(transitions.length === defLen + input.length && transitions[transitions.length-1].name === input[input.length-1].name).toBe(true);
        input = [{name: "light"}, {name: "very-light", width: "wide"}, {name: "quite_dark"}];
        expect(func(input)).toBe(input.length);
        transitions = obj.getClone().transitions;
        expect(transitions.length >= defLen + input.length && transitions[transitions.length-1].name === input[input.length-1].name).toBe(true);
      });
      
    });
    
    
    describe("removeTransitions function", function(){
      
      let func, obj, defName, defLen;
      
      beforeEach(function(){
        obj = flexile.config(false);
        obj.addTransitions(["shrink", {name: "right", type: "slide"}, {name: "left", type: "slide"}, {name: "spin-360", type: "spin"}, {name:"fade", type: "static"}]);
        func = obj.removeTransitions;
        defLen = obj.getClone().transitions.length;
      });
      
      it("should return 0 and leave array unchanged if no argument", function(){  
        expect(func()).toBe(0);
        expect(obj.getClone().transitions.length).toBe(defLen);
      });

      it("should return 0 and leave array unchanged if empty array passed", function(){  
        expect(func([])).toBe(0);
        expect(obj.getClone().transitions.length).toBe(defLen);
      });
      
      it("should return 0 and leave array unchanged if no strings passed match default property values", function(){  
        expect(func("spin-360a")).toBe(0);
        expect(obj.getClone().transitions.length).toBe(defLen);
        expect(func(["spin-360a", "spin-720"])).toBe(0);
        expect(obj.getClone().transitions.length).toBe(defLen);
      });
      
      it("should return 0 and leave array unchanged if no strings passed match passed property values", function(){  
        expect(func("spin-360a", "boris")).toBe(0);
        expect(obj.getClone().transitions.length).toBe(defLen);
        expect(func(["spin-360a", "spin-720"], "boris")).toBe(0);
        expect(obj.getClone().transitions.length).toBe(defLen);
      });
      
      it("should return number of matched properties if strings passed match default property values, transitions should be updated", function(){  
        expect(func("shrink")).toBe(1);
        expect(obj.getClone().transitions.length).toBe(defLen - 1);
        expect(func(["left", "right"])).toBe(2);
        expect(obj.getClone().transitions.length).toBe(defLen - 3);
      });
      
      it("should return number of matched properties if strings passed match passed property values, transitions should be updated", function(){  
        expect(func("slide", "type")).toBe(2);
        expect(obj.getClone().transitions.length).toBe(defLen - 2);
        expect(func(["spin", "static"], "type")).toBe(2);
        expect(obj.getClone().transitions.length).toBe(defLen - 4);
      });
      
    });
    
  });
  
})();