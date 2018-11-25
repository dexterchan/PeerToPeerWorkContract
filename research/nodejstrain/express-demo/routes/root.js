const express=require("express");
const router=express.Router();

router.get("/",(req,res)=>{
    res.render('index',{title:"My express app",message:"Hello world!"});
});

// /api/posts/year/month
router.get("/api/posts/:year/:month",(req,res)=>{
    //res.send ( req.params ); //send parameters year, month
    res.send(req.query); //send query ?abc=def
}
);

module.exports=router;