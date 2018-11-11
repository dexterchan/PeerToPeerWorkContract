
const p1 = new Promise(
    (resolve,reject)=>{
        setTimeout(()=>{
            console.log("Async operation 1...");
            //resolve(1);
            reject(new Error("operation 1 failed"))
        },2000);
    }
);

const p2= new Promise(
    (resolve)=>{
        setTimeout(()=>{
            console.log("Async operation 2...");
            resolve(2);
        },200);
    }
);

Promise.all(
    [p1,p2]
).then( (r)=>console.log(r) )
.catch((er)=>console.log("Error",er));