const express=require("express")
const cors=require("cors")
require('dotenv').config()
const app =express()
const port=process.env.PORT ||5000
const { ObjectId } = require('mongodb');

app.use(cors())
app.use(express.json())


const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fjhyf9f.mongodb.net/?retryWrites=true&w=majority`;

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
    await client.connect();
    
    const foodCollection= client.db("donateFood").collection('foods')
    const requestfoodCollection=client.db('donateFood').collection('request')

    app.post('/addfood',async(req,res)=>{
         const food=req.body
         const result=await foodCollection.insertOne(food)
         res.send(result)
    })
    
    app.get('/availablefoods',async(req,res)=>{
        const result=await foodCollection.find().toArray()
        res.send(result)
    })

    app.get('/availablefoods/sorted',async(req,res)=>{
        const query={}
        const options={sort:{expireDate:1 }}
        const result=await foodCollection.find(query,options).toArray()
        res.send(result)
    })
    app.get('/availablefoods/sorted2',async(req,res)=>{
        const query={}
        const options={sort:{quantity:-1 }}
        const result=await foodCollection.find(query,options).toArray()
        res.send(result)
    })
    
    app.get("/managefoods",async(req,res)=>{
      const userEmail=req.query.email
      let query={}
      console.log(userEmail);
      if(req.query?.email){
         query={email:userEmail}
        
      }
   
      const result=await foodCollection.find(query).toArray()
      res.send(result)
    })

    app.get("/singleFoodDetail/:id",async(req,res)=>{
        const id=req.params.id 
        const query={_id: new ObjectId(id)}
        const result=await foodCollection.findOne(query)
        res.send(result)
    })


    app.post('/requestfood',async(req,res)=>{
      const food=req.body;
      const result=await requestfoodCollection.insertOne(food)
      res.send(result)
    })


    app.get('/requestfood',async(req,res)=>{
      const result=await requestfoodCollection.find().toArray()
      res.send(result)
    })
    
    app.put('/updatefood/:id',async(req,res)=>{
      const id=req.params.id;
      const food=req.body
      const updateFood={
        $set:{
         name:food.name,
         image:food.image,
         quantity:food.quantity,
         location:food.location,
         expireDate:food.expireDate,
         note:food.note
        }
      }
      const query={_id:new ObjectId(id)}
      const result=await foodCollection.updateOne(query,updateFood)
      res.send(result)
    })


    app.delete('/delete/:id',async(req,res)=>{
      const id=req.params.id;
      const query={_id:new ObjectId(id)}
      const result=await foodCollection.deleteOne(query)
      res.send(result)
    })
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);












app.get("/",(req,res)=>{
    res.send("server is running")
})

app.listen(port,()=>{
    console.log(`listening from ${port}`);
})