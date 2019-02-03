const {Rental}=require("../../models/rental");
const {Movie}=require("../../models/movie");
const {User}=require("../../models/user");
const request = require("supertest");
const Mongooese = require("mongoose");
const moment = require("moment");

require("../../startup/logging")();

describe ("/api/returns",()=>{
    let server;
    let customerId;
    let movieId;
    let rental;
    let token;
    let movie;

    const exec= async()=>{
        return await request(server)
                .post("/api/returns")
                .set("x-auth-token",token)
                .send({customerId:customerId,movieId:movieId});
    };

    //called before each of test case running
    beforeEach(async()=>{
        server =require('../../index');
        customerId= Mongooese.Types.ObjectId();
        movieId = Mongooese.Types.ObjectId();
        
        movie = new Movie({
            _id:movieId,
            title:"abcdefg",
            dailyRentalRate:2,
            genre:{name:"123124"},
            numberInStock:10
        });
        await movie.save();

        rental = new Rental({
            customer:{
                _id:customerId,
                name:"12345",
                phone:"1231233"
            },
            movie:{
                _id:movieId,
                title:"abcde",
                dailyRentalRate:2
            }
        });
        const user = new User({name:"abcd",email:"abcd@abc.com"});
        token = user.generateAuthToken();
        await rental.save();
    });

    afterEach( async()=>{
        await server.close();
        await Rental.remove({});
        await Movie.remove({});
    });
    it("should work!",async ()=>{
        const result=await Rental.findById(rental._id);
        expect (result).not.toBeNull();
    });
    it('should return 401 if client is not logged in',async()=>{
        token="";
        const res=await exec();
        expect (res.status).toBe(401);
    });
    it("should return 400 if customer id is not found", async()=>{
        customerId="abcd";
        const res=await exec();
        expect(res.status).toBe(400);
    });
    it("should return 404 if Rental is not found", async()=>{
        await Rental.remove({});
        const res=await exec();
        expect(res.status).toBe(404);
    });
    it("should return 400 if return is already processed",async()=>{
        rental.dateReturned=new Date();
        await rental.save();

        const res=await exec();
        expect (res.status).toBe(400);
    });
    it("should return 200 if we have valid request",async()=>{
        const res=await exec();
        expect (res.status).toBe(200);
    });
    it("should set return date if we have valid request",async()=>{
        const res=await exec();
        expect (res.status).toBe(200);

        //reload the db record
        const result=await Rental.findById(rental._id);
        expect (result).toHaveProperty("dateReturned");
        const diff = new Date()-result.dateReturned;
        expect (diff).toBeGreaterThan(0);
        expect (result.dateReturned).toBeDefined();
    });

    it("should calculate the rental fee as (number of days*movie.dailyrentalrate",async()=>{
        rental.dateOut= moment().add(-7,"days").toDate();//7 days ago
        await rental.save();
        const res=await exec();
        expect (res.status).toBe(200);

        //reload the db record
        const rentalInDb=await Rental.findById(rental._id);
        
        expect (rentalInDb.rentalFee).toBe(7*rentalInDb.movie.dailyRentalRate);
    });

    it("should update the movie stock after completion",async()=>{
        
        const res=await exec();
        expect (res.status).toBe(200);

        //reload the db record
        
        const movieInDb = await Movie.findById(movieId);
        
        expect (movieInDb.numberInStock).toBe(movie.numberInStock+1);
    });
    it("should update the movie stock after completion",async()=>{
        const res=await exec();

        const rentalInDb=await Rental.findById(rental._id);
        /*
        expect (res.body).toHaveProperty("dateOut");
        expect (res.body).toHaveProperty("dateReturned");
        expect (res.body).toHaveProperty("rentalFee");*/
        expect (Object.keys(res.body)).toEqual(
            expect.arrayContaining(["dateOut","dateReturned","rentalFee",
        "customer","movie"])
        );
    });
});