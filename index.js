const express = require('express')
const cors = require('cors')
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const mongoose = require("mongoose");
const multer = require('multer')
const cloudinary = require("./config/cloudinary")
// const { CloudinaryStorage } = require("multer-storage-cloudinary");

// const upload = multer({ dest: '/files' })
// const stripe = require('stripe')(process.env.PAYMENT_SK)
// const jwt = require('jsonwebtoken');
// const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

// const uploadRoutes =require("./routes/uploadRoutes")


const app = express();
const port = process.env.PORT || 5000;

// app.use(cors());

app.use(cors({
  origin: ['http://localhost:3000', 'https://zaitoonpublication.com'],  // allow your frontend domain
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));


// app.use(express.json());

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
// app.use('/uploads', express.static('uploads'));

const upload = require("./upload");
const router = express.Router();
// app.use("/api/upload", uploadRoutes)

app.use(router);




const uri = `mongodb+srv://${process.env.ZAIT_USER}:${process.env.ZAIT_PASS}@zaitoonpublication.2mrbv.mongodb.net/?retryWrites=true&w=majority&appName=zaitoonpublication`;
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

    await client.connect();
    console.log("Connected to MongoDB!");

    // client.db().admin().ping()
    // .then(() => console.log("MongoDB connection verified"))
    // .catch(err => console.error("MongoDB connection failed:", err));



    // const itemCollections = client.db("zaitProducts");
    // const collections = itemCollections.collection("addedProduct");

    // // console.log(itemsCollections)

    // app.post('/products', async (req, res) => {
    //   const addProduct = req.body;

    //   const productCollected = await collections.insertOne(addProduct);
    //   console.log(productCollected)
    //   res.send(productCollected)
    // })

    // app.get('/allProducts', async (req, res) => {
    //   const query = {}
    //   console.log(query)
    //   const goods = await collections.find(query).toArray();
    //   res.send(goods)
    // })


    const count = await collections.countDocuments();
    console.log(`Total documents: ${count}`);
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



const itemCollections = client.db("zaitProducts");
const collections = itemCollections.collection("addedProduct");
const cartCollections = itemCollections.collection("cartProduct");
const userCollect = itemCollections.collection('collectUser');
const purchageCollect = itemCollections.collection('collectedPurchages')
const reviewCollect = itemCollections.collection('review')



// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "uploads/"); // Make sure 'uploads' folder exists
//   },
//   filename: function (req, file, cb) {
//     cb(null, Date.now() + "-" + file.originalname);
//   }
// });

// const upload = multer({ storage: storage });


router.post('/profile', upload.fields([
  { name: "image", maxCount: 1 },
  { name: "pdf", maxCount: 1 }
]), async function (req, res) {
  try {
    // const db = await connectDB();
    // const collection = itemCollections.collection("addedProduct");
    // console.log("PDF File:", req.files?.pdf?.[0]);
    // console.log("Image File:", req.files?.image?.[0]);

    const pdfFile = req.files?.pdf?.[0]?.path || "";
    const imageFile = req.files?.image?.[0]?.path || "";

    if (!pdfFile || !imageFile) {
      return res.status(400).json({ status: 'error', message: 'Missing file uploads' });
    }

    const newProduct = {
      namebn: req.body.namebn,
      namearb: req.body.namearb,
      nameeng: req.body.nameeng,
      productPrice: req.body.productPrice,
      postDate: req.body.postDate,
      numberOfpage: req.body.numberOfpage,
      authorName: req.body.authorName,
      language: req.body.language,
      offerprice: req.body.offerprice,
      quantity: req.body.quantity,
      edition: req.body.edition,
      description: req.body.description,
      ProductCode: req.body.productCode,
      category: req.body.category,
      pdf: pdfFile,
      image: imageFile,
    };

    // console.log(req.body)

    const result = await collections.insertOne(newProduct);

    res.send({ status: "ok", insertedId: result.insertedId });
  } catch (error) {
    console.error("Error inserting product:", error);
    res.status(500).json({ status: "error", message: error.message });
  }
});




// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, './files')
//   },
//   filename: function (req, file, cb) {
//     const uniqueSuffix = Date.now();
//     cb(null, file.originalname + uniqueSuffix)
//   }
// })


// require("./addedProduct");
// const PdfSchema = mongoose.model("addedProduct")
// const upload = multer({ storage: storage })


// app.post('/profile', upload.fields([
//   { name: "image", maxCount: 1 },
//   { name: "pdf", maxCount: 1 }
// ]), async function (req, res, next) {

//   const filename = req.files?.pdf?.[0].filename;
//   const imagename = req.files?.image?.[0];
//   console.log(filename,imagename)

//   // const productCollected = await collections.insertOne(filename);
//   //   console.log("Product added:", productCollected);
//   //   res.send(productCollected);
//   try {
//     await PdfSchema.create({ pdf: filename });
//     console.log(pdf);
//     res.send({ status: "ok" })



//   } catch (error) {
//     res.json({ status: error })
//   }
// })


// Create user Admin
app.put('/users/admin/:id', async (req, res) => {
  // const decodedEmail = req.decoded.email;
  // const query = { email: decodedEmail };
  // const user = await userCollect.findOne(query)
  // if (user?.role !== 'superadmin') {
  //     return res.status(403).send({ massage: 'forbiden access' })
  // }


  const id = req.params.id;
  const filter = { _id: new ObjectId(id) }
  const options = { upsert: true };
  const updatedDoc = {
    $set: {
      role: 'admin'
    }
  }
  const result = await userCollect.updateOne(filter, updatedDoc, options);
  res.send(result);
});

//user delete
app.delete('/users/delete/:id', async (req, res) => {
  const id = req.params.id;
  const query = { _id: new ObjectId(id) };
  const result = await userCollect.deleteOne(query);
  res.send(result);
});

// User Collection sector

app.post('/users', async (req, res) => {
  const addUser = req.body;
  const collected = await userCollect.insertOne(addUser);
  res.send(collected)
});

// load all users
app.get('/allusers', async (req, res) => {
  const query = {}
  const getUsers = await userCollect.find(query).toArray();
  res.send(getUsers)
});

// cheack user Admin route

app.get('/users/admin/:email', async (req, res) => {
  const email = req.params.email;
  const query = { email }
  const user = await userCollect.findOne(query);
  res.send({ isAdmin: user?.role === 'admin' })
})

// cheack user SuperAdmin route

app.get('/users/superadmin/:email', async (req, res) => {
  const email = req.params.email;
  const query = { email }
  const user = await userCollect.findOne(query);
  res.send({ isSuperAdmin: user?.role === 'superadmin' })
})


//add products
app.post('/products', async (req, res) => {
  try {
    const addProduct = req.body;
    const productCollected = await collections.insertOne(addProduct);
    res.send(productCollected);
  } catch (error) {
    res.status(500).send({ message: "Error adding product", error });
  }
});


//Load products
app.get('/allProducts', async (req, res) => {
  try {
    const goods = await collections.find({}).toArray();
    res.send(goods);
  } catch (error) {
    res.status(500).send({ message: "Error fetching products", error });
  }
});

// Products updated system

app.put('/productUpdate/:id', async (req, res) => {

  const id = req.params.id;

  const {
    namebn,
    namearb,
    nameeng,
    authorName,
    edition,
    numberOfpage,
    offerprice,
    productPrice,
    description,
    quantity
  } = req.body;
  const filter = { _id: new ObjectId(id) }
  const options = { upsert: true };
  const updatedDoc = {
    $set: {
      namebn: namebn,
      namearb: namearb,
      nameeng: nameeng,
      authorName: authorName,
      edition: edition,
      numberOfpage: numberOfpage,
      offerprice: offerprice,
      productPrice: productPrice,
      description: description,
      quantity: quantity
    }
  }
  const result = await collections.updateOne(filter, updatedDoc, options);
  res.send(result);
});

//specific products load
app.get('/products/:id', async (req, res) => {

  const id = req.params.id;

  const query = { _id: new ObjectId(id) }

  const items = collections.find(query);
  const infoe = await items.toArray();
  res.send(infoe)
})


// specific products delete
app.delete('/products/delete/:id', async (req, res) => {
  const id = req.params.id;
  const query = { _id: new ObjectId(id) };
  const result = await collections.deleteOne(query);
  res.send(result);
});



// create cart item

app.post('/addedCart', async (req, res) => {
  try {
    const addCarts = req.body;
    const cartCollected = await cartCollections.insertOne(addCarts);
    // console.log("Product added:", cartCollected);
    res.send(cartCollected);
  } catch (error) {
    res.status(500).send({ message: "Error adding product", error });
  }
});

// email based cashondata load

app.get('/cashOnpurc/:email', async (req, res) => {

  const email = req.params.email;

  const query = { email }

  const items = cartCollections.find(query);
  const infoe = await items.toArray();
  // console.log(infoe)
  res.send(infoe)
});


// Cart item delete
app.delete('/cartItem/delete/:id', async (req, res) => {
  const id = req.params.id;
  // console.log(id)
  const query = { _id: new ObjectId(id) };
  const result = await cartCollections.deleteOne(query);
  res.send(result);
});


// const count = await collections.countDocuments();
//     console.log(`Total documents: ${count}`);
// app.get('/short', (req, res) => {
//     res.send('Hea is bsasfdljf')
// })


// Create ordered data

app.post('/purchage', async (req, res) => {
  const addPurchages = req.body;
  const collected = await purchageCollect.insertOne(addPurchages);
  res.send(collected)
});


// Order data load role based
app.get('/cashonpurchage/:role', async (req, res) => {

  const role = req.params.role;

  const query = { role }

  const items = purchageCollect.find(query);
  const infoe = await items.toArray();
  // console.log(infoe)
  res.send(infoe)
});

// email based load order data for my order

app.get('/ordercheck/:email', async (req, res) => {

  const email = req.params.email;

  const query = { email }

  const items = purchageCollect.find(query);
  const infoe = await items.toArray();
  // console.log(infoe)
  res.send(infoe)
});

// Order status set

app.put('/orderStatus/:id', async (req, res) => {
  // const decodedEmail = req.decoded.email;
  // const query = { email: decodedEmail };
  // const user = await userCollect.findOne(query)
  // if (user?.role !== 'superadmin') {
  //     return res.status(403).send({ massage: 'forbiden access' })
  // }


  const id = req.params.id;
  const filter = { _id: new ObjectId(id) }
  const options = { upsert: true };
  const updatedDoc = {
    $set: {
      status: 'placed'
    }
  }
  const result = await purchageCollect.updateOne(filter, updatedDoc, options);
  res.send(result);
});




// Review added
app.post('/review', async (req, res) => {
  const addReview = req.body;
  const collected = await reviewCollect.insertOne(addReview);
  res.send(collected)
});

app.get('/review/:productCode', async (req, res) => {

  const pdatacode = req.params.productCode;

  const query = { pdatacode }
  console.log(query)

  const items = reviewCollect.find(query);
  const infoe = await items.toArray();
  res.send(infoe);
});

app.get('/', (req, res) => {
  res.send('Zaitoon publication server is started')
})

app.listen(port, () => {
  console.log(`Zaitoon publication server start on: ${port}`)
})


