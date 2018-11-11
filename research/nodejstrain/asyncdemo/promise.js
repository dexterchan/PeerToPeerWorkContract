const p = new Promise(
    (resolve,reject)=>{
        //Kick off async work
        console.log("reading a user from db...");
        setTimeout(()=>{
            try{
                //resolve (1); //pending state -> resolved, fulfilled state
                throw new Error("Fail retrieval");
            }catch(err){
                reject(err); //pending state->rejected state
            }finally{}
            
        },2000);
    }
);

p.then(result => console.log('Result',result))
.catch(err=>console.log('Error:',err.message));