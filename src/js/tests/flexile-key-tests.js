(function(){

  "use strict";
  
  describe("Keys functions", function(){
    
    describe("setKeys function", function(){
      
      let func, obj, defName, defLen;
      
      beforeEach(function(){
        obj = flexile.config(false);
        func = obj.setKeys;
      });
      
      it("should return 0 and clear array if no argument", function(){  
        expect(func()).toBe(0);
        expect(obj.getClone().keys.length).toBe(0);
      });

      it("should return 0 and clear array if empty array passed", function(){  
        expect(func([])).toBe(0);
        expect(obj.getClone().keys.length).toBe(0);
      });
      
      it("should return false if argument that is not appropriate is passed", function(){  
        expect(func(1)).toBe(false);
        expect(func({})).toBe(false);
        expect(func(/Regular expression/)).toBe(false);
        expect(func("very-wide")).toBe(false);
      });
      
      it("should return false if only code or value is passed as object property", function(){  
        expect(func({code: 24})).toBe(false);
        expect(func({value: "next"})).toBe(false);
      });
      
      it("should return false if code is not an integer", function(){  
        expect(func({code: 24.6, value: "next"})).toBe(false);
        expect(func({code: "next", value: 24})).toBe(false);
      });
      
      it("should return false if value is not an integer or no-space true string", function(){  
        expect(func({code: 24, value: ""})).toBe(false);
        expect(func({code: 24, value: {}})).toBe(false);
        expect(func({code: 24, value: "two words"})).toBe(false);
        expect(func({code: 24, value: 24.6})).toBe(false);
        expect(func([{code: 25, value: 24}, {code: 24, value: 24.6}])).toBe(false);
      });
      
      it("should return length of array input if suitable objects are passed, changing keys to input", function(){  
        let input = {code: 25, value: 24};
        expect(func(input)).toBe(1);
        let keys = obj.getClone().keys;
        expect(keys.length === 1 && keys[0].name === input.name).toBe(true);
        input = {code: 25, value: "appropriate"};
        expect(func(input)).toBe(1);
        keys = obj.getClone().keys;
        expect(keys.length === 1 && keys[0].name === input.name).toBe(true);
        input = [{code: 25, value: 24}];
        expect(func(input)).toBe(input.length);
        keys = obj.getClone().keys;
        expect(keys.length === input.length && keys[0].name === input[0].name).toBe(true);
        input = [{code: 25, value: 24}, {code: 26, value: "something"}];
        expect(func(input)).toBe(input.length);
        keys = obj.getClone().keys;
        expect(keys.length === input.length && keys[1].name === input[1].name).toBe(true);
      });
          
    });

  });
  
})();