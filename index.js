const express = require('express')
const cors = require('cors')
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000

const app = express()

app.use(cors())
app.use(express.json())

//mongodb
const uri = `mongodb+srv://service-review:oRZSZSVOyhOX8bNn@cluster0.pbaqirc.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function  run(){

    const servicesCollection = client.db('service-review').collection('services');
    const reviewsCollection = client.db('service-review').collection('reviews');

    try{

    app.get('/', async(req,res)=>{
        
        res.send('server is ok')
    })

    app.get('/allservices', async(req,res)=>{
        const query = {}
        const result = await servicesCollection.find(query).toArray()
        res.send(result)
    })

    app.get('/services', async(req,res)=>{
        const query = {}
        const result = await servicesCollection.find(query).limit(3).toArray()
        res.send(result)
        //console.log(req.body._id);
    })

    app.get('/services/:id', async(req,res)=>{
        const ids = req.params.id
        const query= {_id: new ObjectId(ids)}
        const result = await servicesCollection.findOne(query)
        res.send(result)
    })

    app.post('/allservices', async(req,res)=>{
        const query = req.body
        const result = await servicesCollection.insertOne(query)
        res.send(result)
    })

    //review
    app.post('/reviews',async(req,res)=>{
        const query = req.body;
        const result = await reviewsCollection.insertOne(query)
        res.send(result)
    })

    // app.get('/reviews',async(req,res)=>{
    //     let query = {};
    //     const result = await reviewsCollection.find(query).toArray()
    //     res.send(result)
    //     //console.log(query);
    // })

    app.get('/reviews',async(req,res)=>{
        let query = {}
        if(req.query.email){
            query = {
                email : req.query.email
            }
        }
        const result = await reviewsCollection.find(query).toArray()
        res.send(result)
    })

    app.get('/reviews/:id',async(req,res)=>{
        const ids = req.params.id
        const query = {_id: new ObjectId(ids)}
        const result = await reviewsCollection.findOne(query)
        res.send(result)
    })

    app.delete('/reviews/:id',async(req,res)=>{
        const ids = req.params.id
        const query = {_id: new ObjectId(ids)}
        const result = await reviewsCollection.deleteOne(query)
        res.send(result)
    })

    app.put('reviews/:id', async(req,res)=>{
        const ids = req.params.id;
        const query = {_id: new ObjectId(ids)}
        const user = req.body
        const option = {upsert: true}
        const upDatedoc ={
            $set : {
                message: user.message
            }
        }
        const result = await reviewsCollection.findBy(query, upDatedoc, option)
        res.send(result)
        //console.log(user);
    })




    }
    finally{}
}

run().catch(err=> console.log(err))



app.listen(port,() =>{
    console.log(`server is running ${port}`);
})

//  service-review
//     oRZSZSVOyhOX8bNn