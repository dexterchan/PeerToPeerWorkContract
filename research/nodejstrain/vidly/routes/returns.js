const express = require('express');
const router = express.Router();
const {Rental, validate}=require("../models/rental");
const {Movie} = require("../models/movie");
const auth = require('../middleware/auth');
const moment = require("moment");
const Joi = require('joi');

router.post("/",auth,async(req,res)=>{

    //const reqerror=validateReturn(req.body).error;
    //if(reqerror) return res.status(400).send(error.details[0].message);

    const { error } = validate(req.body); 
    if (error) return res.status(400).send(error.details[0].message);
    //res.status(400).send("INcomplete input"); 

    /*
    const rental = await Rental.findOne({
        "customer._id":req.body.customerId,
        "movie._id":req.body.movieId
    });*/
    const rental = await Rental.lookup( req.body.customerId, 
        req.body.movieId);
    if(!rental){
        return res.status(404).send("Not found rental");
    }

    if(rental.dateReturned){
        return res.status(400).send("already processed");
    }

    /*
    rental.dateReturned=new Date();
    rental.rentalFee = moment().diff(rental.dateOut,"days") * rental.movie.dailyRentalRate;
    */
    rental.return();
    /*
    movie=await Movie.findById(rental.movie._id);
    movie.numberInStock++;
    await movie.save();
    */
    await Movie.update({_id:rental.movie._id},{
        $inc:{numberInStock:1}
    });
    await rental.save();
    res.send(rental);
});

function validateReturn(req){
    const schema={
        customerId:Joi.objectId().required(),
        movieId:Joi.objectId().required
    }
    return Joi.validate(req,schema);
}


module.exports=router;