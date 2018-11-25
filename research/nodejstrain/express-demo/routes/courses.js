const express=require("express");
const router=express.Router();
const Joi = require('joi');
const courses = [
    {id:1, name:"course1"},
    {id:2, name:"course2"},
    {id:3, name:"course3"}
];

router.get("/", (req,res)=>{
    res.send(courses);
});

router.post("/", (req,res)=>{
    
    const checkResult=validateCourse(req.body);
    if(checkResult.error != null) return res.status(400).send(checkResult.error.details[0].message);//400 Bad Request
        
/*
    if(!req.body.name || req.body.name.length<3){
        //400 Bad Request
        res.status(400).send("name is required and should be minimum 3 characters");
        return;
    }*/
    const course = {
        id: courses.length+1,
        name:req.body.name
    };
    courses.push(course);
    res.send(course);
});

router.put("/:id", (req,res)=>{
    //Lookup the course
    //If not exist, return 404
    let course=courses.find(c=> c.id === parseInt(req.params.id) );
    if(!course) return res.status(404).send("The course with the given id not found");

    //Validate 
    
    //const checkResult=validateCourse(req.body);
    const {error}=validateCourse(req.body);//Object destructuring
    //if invalidate, return 400 - Bad Request
    if(error!= null) return res.status(400).send(error.details[0].message); //400 Bad Request

    //Update course
    course.name=req.body.name;

    res.send(course); 
});

router.delete("/:id",(req,res)=>{
    //Lookup the course
    //If not exist, return 404
    let course=courses.find(c=> c.id === parseInt(req.params.id) );
    if(!course) return res.status(404).send("The course with the given id not found");

    //delete
    const index = courses.indexOf(course);
    courses.splice(index,1);
    
    res.send(course);

});
function validateCourse(course){
    const schema={
        name:Joi.string().min(3).required()
    };
    return Joi.validate(course,schema);

}

// //1
router.get("/:id",(req,res)=>{
    //"let" allows u to re-assign var once more time
    let course=courses.find(c=> c.id === parseInt(req.params.id) );
    if(!course) return res.status(404).send("The course with the given id not found");
    res.send(course);
}
);

module.exports=router;