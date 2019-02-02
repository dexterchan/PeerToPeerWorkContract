const request=require("supertest");
const {User}=require("../../models/user");
let server;
let token;
describe("auth middleware",()=>{
    beforeEach(()=>{
        server =require('../../index');
        const user = new User({name:"abcd",email:"abcd@abc.com"});
            token = user.generateAuthToken();
        
    });
    afterEach( async()=>{
        server.close();
       
    });
    const exec= async()=>{
        return await request(server)
                .post("/api/genres")
                .set("x-auth-token",token)
                .send({name:"genre1"});
    };

    it("should return 401 if no token is provided",async ()=>{
        token="";

        const res=await exec();
        //console.log(res.status);
        expect(res.status).toBe(401);
    });

    it("should return 400 if  token is invalid",async ()=>{
        token="abcd";

        const res=await exec();
        //console.log(res.status);
        expect(res.status).toBe(400);
    });
    it("should return 200 if  token is valid",async ()=>{
        const res=await exec();
        //console.log(res.status);
        expect(res.status).toBe(200);
        
    });
});