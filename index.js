const express = require("express");
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 5000;

const app = express();
app.use(
  cors({
    origin: [
      "http://localhost:5175",
      "http://localhost:5174",
      "http://localhost:5173",

      "https://dazzle-food.web.app",
      "https://dazzle-food.firebaseapp.com",
    ],
    credentials: true,
  })
);
app.use(express.json());
app.get("/", async (req, res) => {
  res.send("how are ho");
});
/* =============================== */

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster1.phei2xm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    // Send a ping to confirm a successful connection

    /* dazzle food coollection */
    const featureFood = client.db("dazzle_food").collection("feature-food");
    const addQuariesCollection = client
      .db("dazzle_food")
      .collection("AddQuaries");
    const recomendationCollection = client
      .db("dazzle_food")
      .collection("recomendations");

    /* add Quaries */
    app.post("/addQuaries", async (req, res) => {
      const quaryData = req.body;
      const result = await addQuariesCollection.insertOne(quaryData);
     // console.log(result);

      /* inc */

      res.send(result);
    });
    /* get the data addQuaries get data */

    app.get("/addQuaries", async (req, res) => {
      //   console.log('add queries',req.query)
      //desending order by current TIMe
      const result = await addQuariesCollection
        .find()
        .sort({ currentTime: -1 })
        .toArray();

      res.send(result);
    });

    /* ==========================PAGINNATION===================== */
    app.get("/addQuariess", async (req, res) => {
      //  console.log('add queries',req.query)
      const page = parseInt(req.query.page);
      const size = parseInt(req.query.size);
      //console.log(page, size);
      const result = await addQuariesCollection
        .find()
        .skip(page * size)
        .limit(size)
        .sort({currentTime: -1})
        .toArray()

      res.send(result);
    });

    app.get("/pagination", async (req, res) => {
      //const result = await addQuariesCollection.find().toArray();
      //1.c
      console.log(req.query);
      const count = await addQuariesCollection.estimatedDocumentCount();
      res.send({ count });

      //  res.send(result);
    });

    /* =======================PAGINATION============================= */

    /* get the data by emnail from addQueriesCollestion database=================== */

    app.get("/userQuery/:email", async (req, res) => {
      const email = req.params.email;
     // console.log(email);
      const query = { userEmail: email };
      const result = await addQuariesCollection.find(query).toArray();
    //  console.log(result);
      res.send(result);
    });

    /*specifiq id get data value*/
    app.get("/myQueryDetail/:id", async (req, res) => {
      const id = req.params.id;
      const quary = { _id: new ObjectId(id) };

      const result = await addQuariesCollection.findOne(quary);
      res.send(result);
    });

    /* update add querty coolection */
    app.put("/updateQuery/:id", async (req, res) => {
      const id = req.params.id;
      const queryData = req.body;
      //  console.log(queryData)
      const query = { _id: new ObjectId(id) };
      const option = { upsert: true };
      const updateDoc = {
        $set: {
          ...queryData,
        },
      };

      const result = await addQuariesCollection.updateOne(
        query,
        updateDoc,
        option
      );
      res.send(result);
    });

    /* singel  Quary /Interrogatory */
    app.get("/QueryDetail/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await addQuariesCollection.findOne(query);
      //console.log(result);
      res.send(result);
    });

    /* delete/Uproot/deface/obliterate/pass the sponage over data from my Query Collection */
    app.delete("/myQueryDelete/:id", async (req, res) => {
      const id = req.params.id;
     // console.log("DELETE", id);
      const query = { _id: new ObjectId(id) };
      const result = await addQuariesCollection.deleteOne(query);
      res.send(result);
    });

    /* REcomendtiaon collection ======================================*/
    /* post data */
    app.post("/recomendation", async (req, res) => {
      const query = req.body;

      const result = await recomendationCollection.insertOne(query);

      /* recomendation cound */

      res.send(result);
    });
    /* get the data from recomendation api */
    app.get("/recoData", async (req, res) => {
      const result = await recomendationCollection.find().toArray();
      res.send(result);
    });
    /* get the recomendatin data specifiq,appointed,tangible,inelsatinc data  Throug /by/per/with email */
    app.get("/specifiqReco/:email", async (req, res) => {
      const email = req.params.email;
     // console.log(email);
      const query = { curren_Email: email };
      const result = await recomendationCollection.find(query).toArray();

      res.send(result);
    });
    /* delete the appointed data */
    app.delete("/specifiqRecoDelete/:id", async (req, res) => {
      // app.delete('/specifiqRecoDelete/:id',async(req,res)=>{
      const id = req.params.id;
      //const query={curren_Email:email}
      const query = { _id: new ObjectId(id) };

      const result = await recomendationCollection.deleteOne(query);
      res.send(result);
    });

    // await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
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
/*  */
// const database = client.db('your_database_name');
//     const collection = database.collection('your_collection_name');

//     // Example usage of $inc
//     const filter = { _id: 'some_document_id' };
//     const updateDoc = {
//       $inc: { yourField: 1 } // Increment yourField by 1
//     };

//     const result = await collection.updateOne(filter, updateDoc);
//     console.log(`Document updated with _id: ${result.upsertedId}`);
