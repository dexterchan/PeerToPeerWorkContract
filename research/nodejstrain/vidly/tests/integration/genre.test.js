const request=require("supertest");
const {Genre}=require("../../models/genre");
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
        });
    });

});