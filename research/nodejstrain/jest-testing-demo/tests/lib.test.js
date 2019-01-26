const lib  = require("../lib");



test("absolute - should return a +ve number if input is +ve",()=>{
    const result = lib.absolute(1);
    expect(result).toBe(1);
    expect (result).toBeCloseTo(1);
});

describe ("absolute", ()=>{
    it(" should return a +ve number if input is +ve",()=>{
        const result = lib.absolute(1);
        expect(result).toBe(1);
        expect (result).toBeCloseTo(1);
    });
    
    it(" should return a -ve number if input is +ve",()=>{
        const result = lib.absolute(-1);
        expect(result).toBe(1);
        expect (result).toBeCloseTo(1);
    });
    
    it(" should return a zero number if input is zero",()=>{
        const result = lib.absolute(0);
        expect(result).toBe(0);
    });
})

describe("greet",()=>{
    it("should return greet msg",()=>{
        const result = lib.greet("pig");
        //expect(result).toBe('Welcome pig' );
        expect (result).toMatch(/(Welcome) pig/);
    });
});

describe ("get currencies",()=>{
    it("should return supported currency",()=>{
        const result = lib.getCurrencies();
        //too general
        expect(result).toBeDefined();
        expect(result).not.toBeNull();

        //Proper way
        expect(result).toContain("USD");

        //Ideal way
        expect(result).toEqual(expect.arrayContaining(["EUR","USD","AUD"]));
    });
});

describe("getProduct",()=>{
    const result=lib.getProduct(1);
    expect(result).toEqual({id:1, price:10});
    expect(result).toMatchObject({price:10});
    expect (result).toHaveProperty("id");
});

//Testing exception
describe("register user", ()=>{
    it("should throw if username is falsy",()=>{
        const args = [null, undefined,NaN,false];
        args.forEach( 
            a=>{
                expect(()=>{
                    lib.registerUser(a);
                }).toThrow();
            }
        );
    });
    if("should return a user object if username is valid",()=>{
        const result=lib.registerUser("pig");
        expect(result).toMatchObject({username:"pig"});
        expect (result.id).toBeGreaterThan(0);
    });
})


//testing Mock function
const db = require("../db");
describe("applyDicount",()=>{
    it("should apply 10% discount if customer point>10",()=>{
        //Mock function to override the real query from db module
        db.getCustomerSync=(customerId)=>{
            console.log("fake mock query to replace real db query");
            return {id:customerId,points:20};
        };
        const order = {customerId:1,totalPrice:10};
        lib.applyDiscount(order);
        expect(order.totalPrice).toBeCloseTo(9);

    })
})

const mail = require("../mail");
describe("notifyCustomer",()=>{
    it("should send an email to the customer",()=>{
        db.getCustomerSync = jest.fn().mockReturnValue(
            {id:123,points:20, email:"a@abcd.com"}
        );

        mail.send = jest.fn();
        /*
        //Interaction testing
        let mailSent=false;
        mail.send=(to, subject) =>{
            console.log('Sending an email in mock function...');
            mailSent=true;
        }*/

        lib.notifyCustomer({customerId:1});
        //expect(mailSent).toBe(true);
        expect (mail.send).toHaveBeenCalled();
        expect (mail.send.mock.calls[0][0]).toBe("a@abcd.com");
        expect (mail.send.mock.calls[0][1]).toMatch(/order/);
    });
});