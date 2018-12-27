const express=require("express");
const router=express.Router();
const web3 = require("../ethereum/web3_transact");
router.get("/",(req,res)=>{
    res.send({msg:"Hello"});
    }
);

module.exports=router;

