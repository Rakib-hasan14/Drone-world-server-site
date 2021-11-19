const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const port = process.env.PORT || 5000;

app.use(cors())
app.use(express.json())

//Connectiong with DB
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.axiuk.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
    try {
      await client.connect();

      //First DB
      const database = client.db("Drones");
      const dataConnection = database.collection("DroneData");

      //Second DB
      const secndDatabase = client.db("droneorder")
      const secondDataConnection = secndDatabase.collection("order");



      //Third DB
      const thirdDatabase = client.db("reviews")
      const thirdDataConnection = thirdDatabase.collection("reviewData");
      
      //User DB
      const fourthDb = client.db("user")
      const userCollection = fourthDb.collection("userData");
      
      //Get Data from Server
        app.get('/drones' , async(req , res)=> {
            const cursor = dataConnection.find({})
            const result = await cursor.toArray()
            res.send(result)
        })
        //Get single Data
        app.get('/drones/:id', async(req , res)=> {
          const id = req.params.id;
          const query = {_id : ObjectId(id)}
          const result = await dataConnection.findOne(query)
          res.json(result);
        })
        
        app.get('/users' , async(req , res)=> {
          const cursor = userCollection.find({})
          const result = await cursor.toArray()
          res.send(result)
      })

        app.get('/orders/:id', async(req , res)=> {
          const id = req.params.id;
          const query = {_id : ObjectId(id)}
          const result = await secondDataConnection.findOne(query)
          res.json(result);
        })


        app.get('/users/:id', async(req , res)=> {
          const id = req.params.id;
          const query = {_id : ObjectId(id)}
          const result = await userCollection.findOne(query)
          res.json(result);
        })

        
        //Post Orders
        app.post('/orders', async (req, res) => {
          const orders = req.body;
          const result = await secondDataConnection.insertOne(orders);
          res.json(result)
        });



        //Post users
        app.post('/users', async (req, res) => {
          const user = req.body;
          const result = await userCollection.insertOne(user);
          res.json(result)
        });



        //Post Orders
        app.post('/drones', async (req, res) => {
          const orders = req.body;
          const result = await dataConnection.insertOne(orders);
          console.log(orders)
          res.json(result)
        });

        
        //POST Review
        app.post('/reviews', async (req, res) => {
          const bookings = req.body;
          const result = await thirdDataConnection.insertOne(bookings);
          res.json(result)
        });



        // GET Orders 
        app.get('/orders' , async(req , res)=> {
          const cursor = secondDataConnection.find({})
          const result = await cursor.toArray()
          res.send(result)
        })


        // GET Reviews 
        app.get('/reviews' , async(req , res)=> {
          const cursor = thirdDataConnection.find({})
          const result = await cursor.toArray()
          res.send(result)
        })

    //   //Update data
          app.put('/users', async(req , res)=> {
            const user = req.body;

            const filter = {email : user.email}
            const updateDoc ={
              $set: {role: 'admin'}
            }
            const result = await userCollection.updateOne(filter , updateDoc);
            res.json(result)
          })    


      app.put('/orders/:id', async (req, res) => {
        const id = req.params.id;
        const changeData = req.body;
        const find = { _id: ObjectId(id) };
        const options = { upsert: true };
        const updateDoc = {
            $set: {
                status: changeData.status,
            },
        };
        const result = await secondDataConnection.updateOne(find, updateDoc, options)
        res.json(result)
    })

    //   // DELETE Order data
      app.delete('/orders/:id', async (req, res) => {
        const id = req.params.id;
        const query = { _id: ObjectId(id) };
        const result = await secondDataConnection.deleteOne(query);
        res.json(result);
    })

      app.delete('/drones/:id', async (req, res) => {
        const id = req.params.id;
        const query = { _id: ObjectId(id) };
        const result = await dataConnection.deleteOne(query);
        res.json(result);
    })


    } finally {
    //   await client.close();
    }
  }
run().catch(console.dir);

app.get('/', (req , res) =>{
    res.send('This is now connected')
})
app.listen(port , (req , res)=>{
    console.log('Yeasss!!!')
})