const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/playground",{ useNewUrlParser: true } )
    .then(()=>console.log("connected to MongoDB..."))
    .catch(err => console.error("Could not connect to MongoDB...",err));


const courseSchema = new mongoose.Schema(
    {
        name:String,
        author:String,
        tags:[String],
        date: {type: Date, default:Date.now},
        isPublished:Boolean,
        price: Number
    }
);

//Classes, Object
//Course, Node Course
const Course=mongoose.model("Course", courseSchema); //a class

console.log("Next Create schema");
async function createCourse(){


    const courseNode = new Course({
        name:"React course",
        author:"abc",
        tags:["react","frontend"],
        isPublished:true,
        price: 10
    });

    //async, return promise
    const result = await courseNode.save();
    console.log(result);
}

//createCourse();
async function getCourses(){
/*
    eq (equal)
    ne (not equal)
    gt(greater than)
    get (greater than equal)
    lt (less than)
    let (less than equal)
    in 
    non (not in)*/
    pageNumber=2;
    pageSize=10;
    //Simple query
    const courses = await Course
        //.find({author:"abc",isPublished:true})
        //.find({price : {$gte:10, $lte: 20 } } )
        //.find ({price: { $in : [10,20] } })
        .find( {name: /^react/i}) //start with react
        .find( {name: /course$/i}) //end with course
        .find({name: /.*ac/i}) //contain text "ac"
        .skip((pageNumber-1)*pageSize)
        .or( [{name: "node"},{ isPublished:true}])
        .and( [{author:"abc"}, {price: {$gte: 10}}])
        .limit(pageSize)
        .sort({name:-1})
        .select ({name:1, tags:1,price:1})
        .countDocuments();
    console.log(courses);
}

async function updateCourseByQueryFirst(id){
    const course = await Course.findById(id);
    if(!course){
        throw new Error(`No course of ${id}`);
    }
    course.isPublished=true;
    course.author = "Another author";
    course.set({
        isPublished:true,
        author:"Another author"}
    );
    return await course.save();    
}

async function updateCourseByUpdateDirectly(id){
    const result = await Course.updateOne({_id:id},{
        $set:{
            author:"pp",
            isPublished:false
        }
    });
    return result;
}

async function updateCourseByFindByIdAndUpdate(id){
    const course= await Course.findOneAndUpdate({_id:id},
        {
        $set:{
            author:"king Corba 2",
            isPublished:true
            }
        },{new:true}
    );
}

async function removeCourse(id){
    const course=Course.remove({_id:id});
    return course;
}


//getCourses();
async  function runQueryUpdate(){
const updatedCourse=await updateCourseByQueryFirst("5c0bd8b005b7290e1b4dd618");
console.log(updatedCourse);
}
async function runUpdate(){
    const updatedCourse = await updateCourseByUpdateDirectly("5c0bd8b005b7290e1b4dd618");
    console.log(updatedCourse);
}
async function runFindIdAndUpdate(){
    const updatedCourse = await updateCourseByFindByIdAndUpdate("5c0bd8b005b7290e1b4dd618");
    console.log(updatedCourse);
}
async function removeCourse(){
    try{
    const r = await removeCourse("5c0bd8b005b7290e1b4dd618");
    console.log(r);
    }catch(ex){
        console.log(ex.message);
    }
}
//runFindIdAndUpdate();
//removeCourse();
//createCourse();