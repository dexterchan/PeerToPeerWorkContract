const lib = require("../exercise1");

describe("fizzBuzz",()=>{
    it("should throw an expcetion if input is not a number",()=>{
        expect(()=>{lib.fizzBuzz("a")}).toThrow();
        expect(()=>{lib.fizzBuzz(null)}).toThrow();
    })

    it("it should be divisible by 3 and 5",()=>{
        expect(lib.fizzBuzz(15)).toEqual("FizzBuzz");
    })
});