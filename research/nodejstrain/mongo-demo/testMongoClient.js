const mongo = require('mongodb');
const MongoClient = mongo.MongoClient;
const url = "mongodb://localhost:27017/";

let dbo;


function connectMongo(url, dbname) {
    return new Promise((resolve, reject) => {
        MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
            if (err) {
                reject(err);
            }
            dbo = db.db(dbname);
            resolve({db:db, dbo:dbo});
        });
    }
    );
}

async function demoDelete(dbname,c , myquery){
    const {dbo} = await connectMongo(url,dbname);
    dbo.collection(c).deleteOne(myquery, function(err, obj) {
        if (err) throw err;
        //console.log(obj);
    });
}

const o_id = new mongo.ObjectID("5c0c8b0d9c5c5c0684956bb5");
query={'_id': o_id};
demoDelete("playground","courses",query);
/*
MongoClient.connect(url,{ useNewUrlParser: true }, function(err, db) {
    if (err) throw err;
    dbo = db.db("playground");
    var myquery = { name: 'React course' };
    dbo.collection("courses").deleteOne(myquery, function(err, obj) {
      if (err) throw err;
      console.log("1 document deleted");
      db.close();
    });
  }); 
  */