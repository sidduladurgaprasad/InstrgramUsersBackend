
require("dotenv").config();
const cors = require('cors');
const express = require("express"); // Changed "exp" to "express" for clarity
const { ObjectId } = require("mongodb");
const app = express();

app.use(express.json()); // Used "express" instead of "exp" for better readability
app.use(cors(
    {
        origin: '*'
    }
));

const PORT = process.env.PORT || 4000;
let mclient = require("mongodb").MongoClient;

let DBurl = process.env.DBurl;

mclient.connect(DBurl)
  .then((client) => {
    let dbobj = client.db("Kofluence");
    let userCollectionObj = dbobj.collection("InstagramUsersData");
    app.set("userCollectionObj", userCollectionObj);
    console.log("DB connection success");
  })
  .catch((error) => {
    console.log("Error in DB connection:", error); // Added the error message for better debugging
  });

app.get("/get-user", async (request, response) => {
  let userCollectionObj = app.get("userCollectionObj");
  try {
    let users = await userCollectionObj.find().toArray();
    response.send({ message: "All users", payload: users });
  } catch (error) {
    response.status(500).send({ message: "Error retrieving users", error: error.message });
  }
});


app.post("/post-user", async (request, response) => {
  let obj = request.body;
  console.log(obj);
  let userCollectionObj = app.get("userCollectionObj");
  try {
    await userCollectionObj.insertOne(obj);
    response.send({ message: "User created successfully" });
  } catch (error) {
    response.status(500).send({ message: "Error creating user", error: error.message });
  }
});
const { ObjectID } = require('mongodb'); // Import ObjectID from the MongoDB driver

app.get("/get-user/:handle", async (request, response) => {
  const handleParam = request.params.handle; // Extract handle from request parameters
  let userCollectionObj = app.get("userCollectionObj");
  try{
    let users = await userCollectionObj.find().toArray();
    for(let user in users){
      if(users[user].profiles[0].handle === handleParam){
        response.send({ message: "User Found", payload: users[user] });
      };
    }
  }catch (error) {
    response.status(500).send({ message: "Error retrieving users", error: error.message });
  }

});








app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
