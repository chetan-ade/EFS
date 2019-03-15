var MongoClient = require('mongodb').MongoClient;
const url = "mongodb+srv://chetanade:improve619619@efs-zym9f.azure.mongodb.net/test?retryWrites=true";

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db("EFSDB");
  dbo.createCollection("users", function(err, res) {
    if (err) throw err;
    console.log("Collection created!");
    db.close();
  });
}); 