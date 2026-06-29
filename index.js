const express = require('express')
const dotenv = require('dotenv')
const app = express();
dotenv.config();
const cors = require('cors')

const PORT = process.env.PORT;
const uri = process.env.MONGODB_URI;

app.use(cors());
app.use(express.json())

const { MongoClient, ServerApiVersion } = require("mongodb");

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
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!",
    );

    const db = client.db('wander_fast')
    const destinationCollection = db.collection('destinations')

    app.get('/destination', async(req,res) => {
      const result = await destinationCollection.find().toArray()
      res.send(result);
    })


    app.post('/destination', async(req,res) => {
      const destinationData = req.body
      const result = await destinationCollection.insertOne(destinationData);
      res.send(result);
    })

  } 
  catch(err){
    console.log(err);
  }
}
run().catch(console.dir);


app.get('/', (req,res) => {
    res.send('Server is running fine!')
})

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})

// uri = mongodb+srv://wander_fast:4QBEfe7swRteL1sR@cluster0.mltnagh.mongodb.net/?appName=Cluster0