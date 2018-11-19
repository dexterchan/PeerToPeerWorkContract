const express=require("express");
const app=express();

app.use(express.json());

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
    if(!req.body.name || req.body.name.length<3){
        //400 Bad Request
        res.status(400).send("name is required and should be minimum 3 characters");
        return;
    }
    const course = {
        id: courses.length+1,
        name:req.body.name
    };
    courses.push(course);
    res.send(course);
});

// /api/courses/1
app.get("/api/courses/:id",(req,res)=>{
    //"let" allows u to re-assign var once more time
    let course=courses.find(c=> c.id === parseInt(req.params.id) );
    if(!course) res.status(404).send("The course with the given id not found");
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