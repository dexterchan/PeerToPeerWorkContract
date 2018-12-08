const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/mongo-exercises", { useNewUrlParser: true })
    .then(() => console.log("connected to MongoDB..."))
    .catch(err => console.error("Could not connect to MongoDB...", err));

const courseSchema = new mongoose.Schema(
    {
        name: String,
        author: String,
        tags: [String],
        date: { type: Date, default: Date.now },
        isPublished: Boolean,
        price: Number
    }
);

//Classes, Object
//Course, Node Course
const Course = mongoose.model("Course", courseSchema); //a class

async function getCourses () {
    const courses = await Course
        .find({isPublished:true })
        .or( [{price:{$gte: 15}},{name:/.*by.*/i} ] )
        .sort({price:-1})
        .select({name:1,author:1,price:1});
    
    return courses;
};

run = async()=>{
const courses = await getCourses();
console.log(courses);
}
run();
