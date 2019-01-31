
const {User}=require("../../../models/user");
const jwt=require("jsonwebtoken");
const config=require("config");
const Mongoose=require("mongoose");
describe("generateAuthToken",()=>{
    it("should return a valid JWT",()=>{
        const payload={_id:new Mongoose.Types.ObjectId().toHexString(),isAdmin:true};
        const user=new User(payload);
        const token=user.generateAuthToken();
        const decoded = jwt.verify(token, config.get('jwtPrivateKey'));
        
         expect(decoded).toMatchObject({_id:payload._id,isAdmin:true});
    })
});