const p = new Promise(
    (resolve,reject)=>{
        //Kick off async work
        console.log("reading a user from db...");
        setTimeout(()=>{
            //resolve (1); //pending state -> resolved, fulfilled state
            reject(new Error("Fail retrieval")); //pending state->rejected state
        },2000);
       
        //reject(new Error("message"));
    }
);

p.then(result => console.log('Result',result))
.catch(err=>console.log('Error:',err.message));