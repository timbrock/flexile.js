(function(){

  "use strict";
  
  describe("Aspects functions", function(){
    
    describe("setAspects function", function(){
      
      let func, obj, defName, defLen;
      
      beforeEach(function(){
        obj = flexile.config(false);
        func = obj.setAspects;
        defName = obj.getClone().aspects[0].name;
        defLen = obj.getClone().aspects.length;
      });
      
      it("should return 0 and clear array if no argument", function(){  
        expect(func()).toBe(0);
        expect(obj.getClone().aspects.length).toBe(0);
      });

      it("should return 0 and clear array if empty array passed", function(){  
        expect(func([])).toBe(0);
        expect(obj.getClone().aspects.length).toBe(0);
      });
      
      it("should return false if argument that is not appropriate is passed", function(){  
        expect(func(1)).toBe(false);
        let aspects = obj.getClone().aspects;
        expect(aspects.length === defLen && aspects[0].name === defName).toBe(true);
        expect(func({})).toBe(false);
        aspects = obj.getClone().aspects;
        expect(aspects.length === defLen && aspects[0].name === defName).toBe(true);
        expect(func(/Regular expression/)).toBe(false);
        aspects = obj.getClone().aspects;
        expect(aspects.length === defLen && aspects[0].name === defName).toBe(true);
        expect(func("very-wide")).toBe(false);
        aspects = obj.getClone().aspects;
        expect(aspects.length === defLen && aspects[0].name === defName).toBe(true);
      });
      
      it("should return true if only name is passed as object property", function(){  
        let input = {name: "light"};
        expect(func(input)).toBe(1);
        let aspects = obj.getClone().aspects;
        expect(aspects.length === 1 && aspects[0].name === input.name).toBe(true);
      });
      
      it("should return false if array with inappropriate values is passed", function(){  
        expect(func([" "])).toBe(false);
        let aspects = obj.getClone().aspects;
        expect(aspects.length === defLen && aspects[0].name === defName).toBe(true);
        expect(func(["hi", {name: "wide", aspect:1.2}])).toBe(false);
        aspects = obj.getClone().aspects;
        expect(aspects.length === defLen && aspects[0].name === defName).toBe(true);
      });
      
      it("should return false if unsuitable value passed for name property", function(){  
        expect(func({name: 7, aspect: 1.2})).toBe(false);
        let aspects = obj.getClone().aspects;
        expect(aspects.length === defLen && aspects[0].name === defName).toBe(true);
        expect(func([{name: "wide", aspect: 1.2}, {name: 7}])).toBe(false);
        aspects = obj.getClone().aspects;
        expect(aspects.length === defLen && aspects[0].name === defName).toBe(true);
      });
      
      it("should return length of array input if suitable objects are passed, changing aspects to input", function(){  
        let input = {name: "narrow", aspect: 1.2};
        expect(func(input)).toBe(1);
        let aspects = obj.getClone().aspects;
        expect(aspects.length === 1 && aspects[0].name === input.name).toBe(true);
        input = [{name: "narrow", aspect: 1.2}];
        expect(func(input)).toBe(input.length);
        aspects = obj.getClone().aspects;
        expect(aspects.length === input.length && aspects[0].name === input[0].name).toBe(true);
        input = [{name: "narrow", aspect: 1.2}, {name: "wider", aspect: 2.0}];
        expect(func(input)).toBe(input.length);
        aspects = obj.getClone().aspects;
        expect(aspects.length === input.length && aspects[1].name === input[1].name).toBe(true);
      });
          
    });

  });
  
})();