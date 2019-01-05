const bcrypt=require("bcrypt");

async function run(){
    const salt=await bcrypt.genSalt(10);
    console.log(salt);
    const hashpwd=await bcrypt.hash("1234",salt);
    console.log(hashpwd);
}

run();