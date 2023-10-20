const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
require('dotenv').config()
const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());

// console.log(process.env.BD_USER);

// console.log(process.env.BD_PASS );

const uri = `mongodb+srv://${process.env.BD_USER}:${process.env.BD_PASS}@cluster0.ihxtrhm.mongodb.net/?retryWrites=true&w=majority`;

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
        const cartCollection=client.db("productShopDB").collection('cartProduct');
        const productCollection = client.db("productShopDB").collection('product');

        app.post('/product', async (req, res) => {
            const newProduct = req.body;
            console.log(newProduct);
            const result = await productCollection.insertOne(newProduct);
            res.send(result);
        });

        app.get('/product', async (req, res) => {
            const cursor = productCollection.find();
            const result = await cursor.toArray();
            res.send(result);

        })

// update 

app.get('/product/:id',async(req,res)=>{
    const id =req.params.id;
    const query={_id:new ObjectId(id)}
    const result=await productCollection.findOne(query);
    res.send(result);
})
// cart products
        // app.post('/cartProduct', async (req, res) => {
        //     const selectedItem = req.body;
        //     console.log(selectedItem);
        //     const result = await productCollection.insertOne(selectedItem);
        //     res.send(result);
        // });
        app.post('/cartProduct', async (req, res) => {
            const selectedItem = req.body;
            console.log(selectedItem);
            const result = await cartCollection.insertOne(selectedItem);
            res.send(result);
        });
        


        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);




app.get('/', (req, res) => {
    res.send('Brand shop server is running')
});

app.listen(port, () => {
    console.log(`Brand shop server is running on port:${port}`)
});