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
        // await client.connect();
        const cartCollection = client.db("productShopDB").collection('cart');
        const productCollection = client.db("productShopDB").collection('product');
        // create product
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

        // update product

        app.get('/product/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await productCollection.findOne(query);
            res.send(result);
        })

        app.put('/product/:id', async (req, res) => {

            const id = req.params.id;
            const filter = { _id: new ObjectId(id) }
            const options = { upsert: true };
            const updateProduct = req.body;
            const product = {
                $set: {

                    name: updateProduct.name,
                    photo: updateProduct.photo,
                    brand: updateProduct.brand,
                    price: updateProduct.price,
                    category: updateProduct.category,
                    ratings: updateProduct.ratings,
                    description: updateProduct.description,
                },
            }
            const result = await productCollection.updateOne(filter, product, options);
            res.send(result);
        });


        // cart products

        app.post('/cart', async (req, res) => {
            const cart = req.body;
            console.log(cart);
            delete cart['_id']
            const result = await cartCollection.insertOne(cart);
            res.send(result);
        });

        app.get('/carts', async (req, res) => {
            const cursor = cartCollection.find();
            const cart = await cursor.toArray();
            res.send(cart);
        })

        app.delete('/carts/:id',async(req,res)=>{
            const id=req.params.id;
            console.log(id,'delete')
            const query={_id:new ObjectId(id)}
            const result=await cartCollection.deleteOne(query);
            res.send(result);
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




app.get('/', (req, res) => {
    res.send('Brand shop server is running')
});

app.listen(port, () => {
    console.log(`Brand shop server is running on port:${port}`)
});