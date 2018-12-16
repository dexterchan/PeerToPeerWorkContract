const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/playground"/*{ ,useNewUrlParser: true } */)
    .then(()=>{
        console.log("connected to MongoDB...");
        //removeCourse();
    })
    .catch(err => console.error("Could not connect to MongoDB...",err));


const courseSchema = new mongoose.Schema(
    {
        name:{type: String , required:true},
        author:String,
        tags:{
            type: Array,
            validate: {
                isAsync:true,
                validator: function (v,callback){
                    setTimeout( ()=>{
                        //do async work
                        const result = v && v.length>0;
                        callback(result);
                    },1000);
                    //return v && v.length>0;
                }
            }

        },
        category:{
            type: String,
            required: true,
            enum : ["web","mobile","network"],
            lowercase:true,
            trim:true
        },
        date: {type: Date, default:Date.now},
        isPublished:Boolean,
        price: {type:Number, required: function(){return this.isPublished}}
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
        category:"web",
        tags:["react","frontend"],
        isPublished:true,
        price: 10
    });

    //async, return promise
    try{
        await courseNode.validate();
        const result = await courseNode.save();

        console.log(result);
    }catch(ex){
        console.log(ex.message);
    }
    
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
/*
async function removeCourse(id){
    const course=Course.deleteOne({_id:id});
    return course;
}
*/

//getCourses();
async  function runQueryUpdate(){
const updatedCourse=await updateCourseByQueryFirst("5c0bdd1d0c7525045bab1ef7");
console.log(updatedCourse);
}
async function runUpdate(){
    const updatedCourse = await updateCourseByUpdateDirectly("5c0bdd1d0c7525045bab1ef7");
    console.log(updatedCourse);
}
async function runFindIdAndUpdate(){
    const updatedCourse = await updateCourseByFindByIdAndUpdate("5c0bdd1d0c7525045bab1ef7");
    console.log(updatedCourse);
}

/*
async function removeCoursecase(){
    try{
    const r = await removeCourse("5c0bdd1d0c7525045bab1ef7");
    //console.log(r);
    }catch(ex){
        console.log(ex);
    }
}*/
//runFindIdAndUpdate();
//removeCourse();
createCourse();