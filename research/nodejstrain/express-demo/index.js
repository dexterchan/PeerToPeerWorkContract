const express=require("express");
const app=express();
const Joi = require('joi');
const logger = require("./logger");
app.use(express.json());
app.use(express.urlencoded({extended:true}));//key1=value1&key2=value2
app.use(express.static("public")); //static page
//custom middleware
app.use( logger);

const courses = [
    {id:1, name:"course1"},
    {id:2, name:"course2"},
    {id:3, name:"course3"}
];

app.get("/",(req,res)=>{
    res.send("Hello World!!!")
});

app.get("/api/courses", (req,res)=>{
    res.send(courses);
});

app.post("/api/courses", (req,res)=>{
    
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

app.put("/api/courses/:id", (req,res)=>{
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

app.delete("/api/courses/:id",(req,res)=>{
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

// /api/courses/1
app.get("/api/courses/:id",(req,res)=>{
    //"let" allows u to re-assign var once more time
    let course=courses.find(c=> c.id === parseInt(req.params.id) );
    if(!course) return res.status(404).send("The course with the given id not found");
    res.send(course);
}
);

// /api/posts/year/month
app.get("/api/posts/:year/:month",(req,res)=>{
    //res.send ( req.params ); //send parameters year, month
    res.send(req.query); //send query ?abc=def
}
);


//PORT
const port=process.env.PORT || 3000

app.listen(port,()=>console.log(`Listening on port: ${port}...`));