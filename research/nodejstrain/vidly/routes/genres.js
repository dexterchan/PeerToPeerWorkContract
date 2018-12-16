const mongoose = require("mongoose");
const express = require('express');
const Joi=require("joi");
const router = express.Router();


const Genre =  mongoose.model("Genre",new mongoose.Schema({
  name:{
    type:String,
    required:true,
    minlength:5,
    maxlength:50
  }
}));



router.get('/', async(req, res) => {
  const genres = await Genre.find().sort({name:1});
  res.send(genres);
});

router.post('/', async (req, res) => {
  const { error } = validateGenre(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

  let genre = new Genre({
      name: req.body.name
  });
  
  genre= await genre.save();
  res.send(genre);
});

router.put('/:id', async(req, res) => {
  const { error } = validateGenre(req.body); 
  if (error) return res.status(400).send(error.details[0].message);
  
  let genre;
  try{
     genre=await Genre.findByIdAndUpdate(req.params.id,{name:req.body.name}, {
      new: true
    });
    if (!genre) return res.status(404).send('The genre with the given ID was not found.');

  }catch(ex){
    return res.status(500).send(`updated failed ${ex.message}`);
  }
  

    res.send(genre);
});

router.delete('/:id', async (req, res) => {
  const genre =await Genre.findByIdAndRemove(req.params.id);
  if (!genre) return res.status(404).send('The genre with the given ID was not found.');
  res.send(genre);
});

router.get('/:id', async (req, res) => {
  //const genre = await Genre.find({_id:req.params.id});
  const genre = await Genre.findById(eq.params.id);
  if (!genre) return res.status(404).send('The genre with the given ID was not found.');
  res.send(genre);
});

function validateGenre(genre) {
  const schema = {
    name: Joi.string().min(3).required()
  };

  return Joi.validate(genre, schema);
}

module.exports = router;