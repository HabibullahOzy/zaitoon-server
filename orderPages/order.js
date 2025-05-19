const express = require('express')
const app = express();
require("../index")


app.post('/purchage', async (req, res) => {
  const addPurchages = req.body;
  const collected = await purchageCollect.insertOne(addPurchages);
  res.send(collected)
});


app.get('/productpurchages/:role', async (req, res) => {

  const role = req.params.role;

  const query = { role }

  const items = purchageCollect.find(query);
  const infoe = await items.toArray();
  // console.log(infoe)
  res.send(infoe)
});