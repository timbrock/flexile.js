(function(){

  "use strict";
  
  describe("errors functions", function(){
    
    describe("errors function", function(){
      
      let func, obj;
      
      beforeEach(function(){
        obj = flexile.config(false);
        func = obj.errors;
      });
      
      it("should return false if no errors", function(){
        expect(func()).toBe(false);
        obj.addThemes("dark");
        obj.addTransitions("right");
        obj.addAspects({name: "cinema", aspect: 2.39});
        obj.addKeys({code: 22, value: 22});
        expect(func()).toBe(false);
      });
      
      it("should return array of errors if there is one or more errors", function(){
        obj.setThemes();
        expect(func().length).toBe(1);
        obj.setTransitions();
        expect(func().length).toBe(2);
        obj.setAspects();
        expect(func().length).toBe(3);
        obj.addKeys([{code: 22, value: 22}, {code: 22, value: "next"}]);
        expect(func().length).toBe(4);
      });
    
    });

  });
  
})();