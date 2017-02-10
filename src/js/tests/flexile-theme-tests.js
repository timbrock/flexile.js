(function(){

  "use strict";
  
  describe("Themes functions", function(){
    
    describe("setThemes function", function(){
      
      let func, obj, defName, defLen;
      
      beforeEach(function(){
        obj = flexile.config(false);
        func = obj.setThemes;
        defName = obj.getClone().themes[0].name;
        defLen = obj.getClone().themes.length;
      });
      
      it("should return 0 and clear array if no argument", function(){  
        expect(func()).toBe(0);
        expect(obj.getClone().themes.length).toBe(0);
      });

      it("should return 0 and clear array if empty array passed", function(){  
        expect(func([])).toBe(0);
        expect(obj.getClone().themes.length).toBe(0);
      });
      
      it("should return false if inappropriate argument is passed", function(){  
        expect(func(1)).toBe(false);
        let themes = obj.getClone().themes;
        expect(themes.length === defLen && themes[0].name === defName).toBe(true);
        expect(func({})).toBe(false);
        themes = obj.getClone().themes;
        expect(themes.length === defLen && themes[0].name === defName).toBe(true);
        expect(func(/Regular expression/)).toBe(false);
        themes = obj.getClone().themes;
        expect(themes.length === defLen && themes[0].name === defName).toBe(true);
      });
      
      it("should return false if string that isn't class suffix is passed", function(){  
        expect(func(" ")).toBe(false);
        let themes = obj.getClone().themes;
        expect(themes.length === defLen && themes[0].name === defName).toBe(true);
        expect(func("$")).toBe(false);
        themes = obj.getClone().themes;
        expect(themes.length === defLen && themes[0].name === defName).toBe(true);
        expect(func("@@")).toBe(false);
        themes = obj.getClone().themes;
        expect(themes.length === defLen && themes[0].name === defName).toBe(true);
        expect(func("light dark")).toBe(false);
        themes = obj.getClone().themes;
        expect(themes.length === defLen && themes[0].name === defName).toBe(true);
      });
      
      it("should return 1 if string that is class suffix is passed, themes should now reflect new name", function(){  
        let input = "light";
        expect(func(input)).toBe(1);
        let themes = obj.getClone().themes;
        expect(themes.length === 1 && themes[0].name === input).toBe(true);
        input = "very-light";
        expect(func(input)).toBe(1);
        themes = obj.getClone().themes;
        expect(themes.length === 1 && themes[0].name === input).toBe(true);
        input = "quite_dark";
        expect(func(input)).toBe(1);
        themes = obj.getClone().themes;
        expect(themes.length === 1 && themes[0].name === input).toBe(true);
      });
      
      it("should return 1 if suitable string is passed as name in obj, themes should now reflect new name", function(){  
        let input = {name: "light"};
        expect(func(input)).toBe(1);
        let themes = obj.getClone().themes;
        expect(themes.length === 1 && themes[0].name === input.name).toBe(true);
        input = {name: "light", size: "big"};
        expect(func(input)).toBe(1);
        themes = obj.getClone().themes;
        expect(themes.length === 1 && themes[0].name === input.name).toBe(true);
      });
      
      it("should return false if unsuitable string is passed as name in obj", function(){  
        let input = {name: "very light"};
        expect(func(input)).toBe(false);
        let themes = obj.getClone().themes;
        expect(themes.length === defLen && themes[0].name === defName).toBe(true);
      });
      
      it("should return false if array with inappropriate values is passed", function(){  
        expect(func([" "])).toBe(false);
        let themes = obj.getClone().themes;
        expect(themes.length === defLen && themes[0].name === defName).toBe(true);
        expect(func(["hi", {x: 7}])).toBe(false);
        themes = obj.getClone().themes;
        expect(themes.length === defLen && themes[0].name === defName).toBe(true);
      });
      
      it("should return length of array input if suitable strings are passed, changing themes to input", function(){  
        let input = ["light"];
        expect(func(input)).toBe(input.length);
        let themes = obj.getClone().themes;
        expect(themes.length === input.length && themes[0].name === input[0]).toBe(true);
        input = ["light", "very-light"];
        expect(func(input)).toBe(input.length);
        themes = obj.getClone().themes;
        expect(themes.length === input.length && themes[1].name === input[1]).toBe(true);
        input = ["light", "very-light", "quite_dark"];
        expect(func(input)).toBe(input.length);
        themes = obj.getClone().themes;
        expect(themes.length === input.length && themes[2].name === input[2]).toBe(true);
      });
      
      it("should return length of array input if suitable objects are passed, changing themes to input", function(){  
        let input = [{name: "light"}];
        expect(func(input)).toBe(input.length);
        let themes = obj.getClone().themes;
        expect(themes.length === input.length && themes[0].name === input[0].name).toBe(true);
        input = [{name: "light"}, {name: "very-light", height: 1.6}];
        expect(func(input)).toBe(input.length);
        themes = obj.getClone().themes;
        expect(themes.length === input.length && themes[1].name === input[1].name).toBe(true);
        input = [{name: "light"}, {name: "very-light", width: "wide"}, {name: "quite_dark"}];
        expect(func(input)).toBe(input.length);
        themes = obj.getClone().themes;
        expect(themes.length === input.length && themes[2].name === input[2].name).toBe(true);
      });
      
      it("should return array length and update themes if suitable string/object combo passed", function(){
        let input = ["light", {name: "very-light", height: 1.6}];
        expect(func(input)).toBe(input.length);
        let themes = obj.getClone().themes;
        expect(themes.length === input.length && themes[1].name === input[1].name).toBe(true);
        input = [{name: "light"}, {name: "very-light", width: "wide"}, {name: "quite_dark"}];
        expect(func(input)).toBe(input.length);
        themes = obj.getClone().themes;
        expect(themes.length === input.length && themes[2].name === input[2].name).toBe(true);
      });
      
    });
    
    
    describe("addThemes function", function(){
      
      let func, obj, defName, defLen;
      
      beforeEach(function(){
        obj = flexile.config(false);
        func = obj.addThemes;
        defName = obj.getClone().themes[0].name;
        defLen = obj.getClone().themes.length;
      });
      
      it("should return 0 and leave array unchanged if no argument", function(){  
        expect(func()).toBe(0);
        expect(obj.getClone().themes.length).toBe(defLen);
      });

      it("should return 0 and leave array unchanged if empty array passed", function(){  
        expect(func([])).toBe(0);
        expect(obj.getClone().themes.length).toBe(defLen);
      });
      
      it("should return false if inappropriate argument is passed", function(){  
        expect(func(1)).toBe(false);
        let themes = obj.getClone().themes;
        expect(themes.length === defLen && themes[0].name === defName).toBe(true);
        expect(func({})).toBe(false);
        themes = obj.getClone().themes;
        expect(themes.length === defLen && themes[0].name === defName).toBe(true);
        expect(func(/Regular expression/)).toBe(false);
        themes = obj.getClone().themes;
        expect(themes.length === defLen && themes[0].name === defName).toBe(true);
      });
      
      it("should return false if string that isn't class suffix is passed", function(){  
        expect(func(" ")).toBe(false);
        let themes = obj.getClone().themes;
        expect(themes.length === defLen && themes[0].name === defName).toBe(true);
        expect(func("$")).toBe(false);
        themes = obj.getClone().themes;
        expect(themes.length === defLen && themes[0].name === defName).toBe(true);
        expect(func("@@")).toBe(false);
        themes = obj.getClone().themes;
        expect(themes.length === defLen && themes[0].name === defName).toBe(true);
        expect(func("light dark")).toBe(false);
        themes = obj.getClone().themes;
        expect(themes.length === defLen && themes[0].name === defName).toBe(true);
      });
      
      it("should return 1 if string that is class suffix is passed, themes should now reflect new name", function(){  
        let input = "light";
        expect(func(input)).toBe(1);
        let themes = obj.getClone().themes;
        expect(themes.length === defLen + 1 && themes[themes.length-1].name === input).toBe(true);
        input = "very-light";
        expect(func(input)).toBe(1);
        themes = obj.getClone().themes;
        expect(themes.length === defLen + 2 && themes[themes.length-1].name === input).toBe(true);
        input = "quite_dark";
        expect(func(input)).toBe(1);
        themes = obj.getClone().themes;
        expect(themes.length === defLen + 3 && themes[themes.length-1].name === input).toBe(true);
      });
      
      it("should return 1 if suitable string is passed as name in obj, themes should now reflect new name", function(){  
        let input = {name: "light"};
        expect(func(input)).toBe(1);
        let themes = obj.getClone().themes;
        expect(themes.length === defLen + 1 && themes[themes.length-1].name === input.name).toBe(true);
        input = {name: "light", size: "big"};
        expect(func(input)).toBe(1);
        themes = obj.getClone().themes;
        expect(themes.length === defLen + 2 && themes[themes.length-1].name === input.name).toBe(true);
      });
      
      it("should return false if unsuitable string is passed as name in obj", function(){  
        let input = {name: "very light"};
        expect(func(input)).toBe(false);
        let themes = obj.getClone().themes;
        expect(themes.length === defLen && themes[0].name === defName).toBe(true);
      });
      
      it("should return false if array with inappropriate values is passed", function(){  
        expect(func([" "])).toBe(false);
        let themes = obj.getClone().themes;
        expect(themes.length === defLen && themes[0].name === defName).toBe(true);
        expect(func(["hi", {x: 7}])).toBe(false);
        themes = obj.getClone().themes;
        expect(themes.length === defLen && themes[0].name === defName).toBe(true);
      });
      
      it("should return length of array input if suitable strings are passed, adding themes", function(){  
        let input = ["light"];
        expect(func(input)).toBe(input.length);
        let themes = obj.getClone().themes;
        expect(themes.length === defLen + input.length && themes[themes.length-1].name === input[input.length-1]).toBe(true);
        input = ["light", "very-light"];
        expect(func(input)).toBe(input.length);
        themes = obj.getClone().themes;
        expect(themes.length >= defLen + input.length && themes[themes.length-1].name === input[input.length-1]).toBe(true);
        input = ["light", "very-light", "quite_dark"];
        expect(func(input)).toBe(input.length);
        themes = obj.getClone().themes;
        expect(themes.length >= defLen + input.length && themes[themes.length-1].name === input[input.length-1]).toBe(true);
      });
      
      it("should return length of array input if suitable objects are passed, changing themes to input", function(){  
        let input = [{name: "light"}];
        expect(func(input)).toBe(input.length);
        let themes = obj.getClone().themes;
        expect(themes.length === defLen + input.length && themes[themes.length-1].name === input[input.length-1].name).toBe(true);
        input = [{name: "light"}, {name: "very-light", height: 1.6}];
        expect(func(input)).toBe(input.length);
        themes = obj.getClone().themes;
        expect(themes.length >= defLen + input.length && themes[themes.length-1].name === input[input.length-1].name).toBe(true);
        input = [{name: "light"}, {name: "very-light", width: "wide"}, {name: "quite_dark"}];
        expect(func(input)).toBe(input.length);
        themes = obj.getClone().themes;
        expect(themes.length >= defLen + input.length && themes[themes.length-1].name === input[input.length-1].name).toBe(true);
      });
      
      it("should return array length and update themes if suitable string/object combo passed", function(){
        let input = ["light", {name: "very-light", height: 1.6}];
        expect(func(input)).toBe(input.length);
        let themes = obj.getClone().themes;
        expect(themes.length === defLen + input.length && themes[themes.length-1].name === input[input.length-1].name).toBe(true);
        input = [{name: "light"}, {name: "very-light", width: "wide"}, {name: "quite_dark"}];
        expect(func(input)).toBe(input.length);
        themes = obj.getClone().themes;
        expect(themes.length >= defLen + input.length && themes[themes.length-1].name === input[input.length-1].name).toBe(true);
      });
      
    });
    
    
    describe("removeThemes function", function(){
      
      let func, obj, defName, defLen;
      
      beforeEach(function(){
        obj = flexile.config(false);
        obj.addThemes(["very-light", {name: "dark", type: "dark"}, {name: "very-dark", type: "dark"}, {name: "white", type: "light"}, {name:"red", type: "colourful"}]);
        func = obj.removeThemes;
        defLen = obj.getClone().themes.length;
      });
      
      it("should return 0 and leave array unchanged if no argument", function(){  
        expect(func()).toBe(0);
        expect(obj.getClone().themes.length).toBe(defLen);
      });

      it("should return 0 and leave array unchanged if empty array passed", function(){  
        expect(func([])).toBe(0);
        expect(obj.getClone().themes.length).toBe(defLen);
      });
      
      it("should return 0 and leave array unchanged if no strings passed match default property values", function(){  
        expect(func("pink")).toBe(0);
        expect(obj.getClone().themes.length).toBe(defLen);
        expect(func(["pink", "blue"])).toBe(0);
        expect(obj.getClone().themes.length).toBe(defLen);
      });
      
      it("should return 0 and leave array unchanged if no strings passed match passed property values", function(){  
        expect(func("pink", "boris")).toBe(0);
        expect(obj.getClone().themes.length).toBe(defLen);
        expect(func(["pink", "blue"], "boris")).toBe(0);
        expect(obj.getClone().themes.length).toBe(defLen);
      });
      
      it("should return number of matched properties if strings passed match default property values, themes should be updated", function(){  
        expect(func("white")).toBe(1);
        expect(obj.getClone().themes.length).toBe(defLen - 1);
        expect(func(["dark", "very-dark"])).toBe(2);
        expect(obj.getClone().themes.length).toBe(defLen - 3);
      });
      
      it("should return number of matched properties if strings passed match passed property values, themes should be updated", function(){  
        expect(func("dark", "type")).toBe(2);
        expect(obj.getClone().themes.length).toBe(defLen - 2);
        expect(func(["light", "colourful"], "type")).toBe(2);
        expect(obj.getClone().themes.length).toBe(defLen - 4);
      });
      
    });
    
  });
  
})();