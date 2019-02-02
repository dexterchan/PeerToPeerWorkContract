const request=require("supertest");
const {Genre}=require("../../models/genre");
const {User}=require("../../models/user");
let server;
var createNum=0;

describe("/api/genres",()=>{
    //called before each of test case running
    beforeEach(()=>{
        server =require('../../index');
        createNum=createNum+1;
        //console.log("creation server",createNum);

    });
    afterEach( async()=>{
        await Genre.remove({});
        server.close();
        //console.log("close server");
    });

    describe("GET/",()=>{
        it("should return all genres",async()=>{
            await Genre.collection.insertMany([
                {name:"genre1"},
                {name:"genre2"}
            ]);
            
            const res=await request(server).get("/api/genres");
            expect(res.status).toBe(200);
            expect(res.body.length).toBe(2);
            expect(res.body.some(g=>g.name==="genre1")).toBeTruthy();
            expect(res.body.some(g=>g.name==="genre2")).toBeTruthy();
        });
        it("do nothing",()=>{});
    });

    describe("GET /:id",()=>{
        it("should return a genre if valid id is passed",async ()=>{
            const genre = new Genre({name:"genre1"});
            await genre.save();
            const res=await request(server).get("/api/genres/"+genre._id);
            expect(res.status).toBe(200);
            expect(res.body).toMatchObject({name:"genre1"});
            expect ((res.body)).toHaveProperty("name",genre.name);
        });
    });
    describe("GET /:id",()=>{
        it("should return a 404 if invalid id is passed",async ()=>{
            
            const res=await request(server).get("/api/genres/1");
            expect(res.status).toBe(404);
            
        });
    });
    describe("POST /",()=>{
        //Define the happy path, and then in each test, we change 
        //one parameter that clearly aligns with the name of the tests.
        let token;
        let name;
        const exec=async ()=>{
            
            return await request(server).post("/api/genres")
                .set("x-auth-token",token)
                .send({name:name})
                ;
            
        }
        beforeEach(()=>{
            const user = new User({name:"abcd",email:"abcd@abc.com"});
            token = user.generateAuthToken();
            name="genre1";
        });

        it("should return 401 if client is not logged in",async()=>{
            token="";
            const res = await exec();
            expect(res.status).toBe(401);
        });

        it("should return 400 if input is invalid",async()=>{
            name = new Array(52).join();
            const res = await exec();
            expect(res.status).toBe(400);
        });

        it("should save the genre if input is valid",async()=>{
            
            
            //TODO

            /*
            const name = new Array(40).join();
            var res=await request(server).post("/api/genres")
                .set("x-auth-token",token)
                .send({name:name})
                ;*/
            var res = await exec();
            expect(res.status).toBe(200);

            const newgenre = res.body;
            //console.log(newgenre);
            //query the new record
            res = await request(server).get(`/api/genres/${newgenre._id}`)
            .send();
            /*
            console.log(res.body._id);
            console.log(newgenre._id);*/
            expect(res.body._id==newgenre._id).toBeTruthy();
            expect(res.body).toHaveProperty("name");
        });
    });
});