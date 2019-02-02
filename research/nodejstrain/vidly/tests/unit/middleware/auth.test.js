const {User}=require("../../../models/user");
const auth = require("../../../middleware/auth");

let user;
let token;
const mongoose = require("mongoose");
const _ = require("lodash");
describe ("auth middleware",()=>{
    beforeEach(()=>{
        //server =require('../../../index');
        user = new User({_id:mongoose.Types.ObjectId().toHexString(),name:"abcd",email:"abcd@abc.com"});
        token = user.generateAuthToken();
        
    });
    it("should populate req.user with the payload of a valid JWT",()=>{
        
        const req = {
            header:jest.fn().mockReturnValue(token)
        }
        const res = {

        }
        const next=jest.fn();
        auth(req,res,next);
        console.log(user);
        expect (req.user.name).toEqual("abcd");
        expect (req.user).toMatchObject(_.pick(user, ['name']));
        
    });
});