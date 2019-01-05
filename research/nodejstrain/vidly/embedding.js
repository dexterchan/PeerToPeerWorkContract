const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/playground')
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Could not connect to MongoDB...', err));

const authorSchema = new mongoose.Schema({
  name: String,
  bio: String,
  website: String
});

const Author = mongoose.model('Author', authorSchema);

const Course = mongoose.model('Course', new mongoose.Schema({
  name: String,
  authors:[authorSchema]
}));

async function createCourse(name, authors) {
  const course = new Course({
    name, 
    authors
  }); 
  
  const result = await course.save();
  //console.log(result);
  return result;
}

async function listCourses() { 
  const courses = await Course.find();
  console.log(courses);
}

async function updateAuthor(courseid){
  const course=await Course.findById(courseid);
  //console.log(course);
  course.author.name="Mosh H.";
  const result=course.save();
  return result;
}
async function addAuthor(courseid,author){
  const course= await Course.findById(courseid);
  course.authors.push(author);
  await course.save();
  return course;
}
async function removeAuthor(courseid, authorid){
  const course= await Course.findById(courseid);
  console.log(`Remove author id : ${authorid}`);
  const author = course.authors.id(authorid);
  author.remove();
  course.save();
  return course;
}

async function testing(){
  var c=await createCourse('Node Course', 
  [new Author({ name: 'Mosh' }),
  new Author({ name: 'piglet' })
  ]
  );
  c=await addAuthor(c._id, new Author({name:"tiger"}));
  c= await removeAuthor(c._id, c.authors[0]._id);
  //console.log("id",c._id);
  //const newc= await updateAuthor(c._id);
  //console.log(newc);
}

testing();
