const express = require("express");
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 5000;

const app = express();
app.use(
  cors({
    origin: ["http://localhost:5175","http://localhost:5174","http://localhost:5173"],
    credentials: true,
  })
); 
app.use(express.json());
app.get("/", async (req, res) => {
  res.send("how are ho");
});
/* =============================== */

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster1.phei2xm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
   // await client.connect();
    // Send a ping to confirm a successful connection

/* dazzle food coollection */
const featureFood=client.db('dazzle_food').collection('feature-food')
const addQuariesCollection=client.db('dazzle_food').collection('AddQuaries')
const recomendationCollection=client.db('dazzle_food').collection('recomendations')


/* feature-sectin get the data */
// app.get('/feature',async(req,res)=>{

//     const result=await featureFood.find().toArray()
//     res.send(result)


// })



/* get single feature data */

// app.get('/singleFeature/:id',async (req,res)=>{

//     const id=req.params.id;
//     const query={_id: new ObjectId(id)}

//     const result=await featureFood.findOne(query)
//     res.send(result)


// })



/* add Quaries */
app.post('/addQuaries',async(req,res)=>{

    console.log(req.body)
const quaryData=req.body;
const result=await addQuariesCollection.insertOne(quaryData)
console.log(result)
res.send(result)


})
/* get the data addQuaries get data */

app.get('/addQuaries',async (req,res)=>{

    const result=await addQuariesCollection.find().toArray()
    res.send(result)
})
/* singel  Quary /Interrogatory */
app.get('/QueryDetail/:id',async(req,res)=>{
const id=req.params.id;
const query={_id:  new ObjectId(id)}
const result=await addQuariesCollection.findOne(query)
console.log(result)
res.send(result)
})

/* REcomendtiaon collection */
/* post data */
app.post('/recomendation',async(req,res)=>{

const query=req.body;
console.log(res)
const result=await recomendationCollection.insertOne(query)
res.send(result)

    
})
/* get the data from recomendation api */
app.get('/recoData',async(req,res)=>{
const result=await recomendationCollection.find().toArray()
res.send(result)

})



    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
 //   await client.close();
  }
}
run().catch(console.dir);













/* ========================================== */
app.listen(port, () => {
  console.log("litenting ");
});
