require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Transaction = require('./models/Transaction');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URL)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.log('MongoDB error:', err);
  });

app.post('/api/transaction', async (req, res) => {
  const { name, price, description, datetime } = req.body;
  console.log(name, price, description, datetime);
  const transaction = await Transaction.create({name, price, description, datetime} )
  res.json(transaction);
});

app.get('/api/transactions', async(req, res) => {
    try{
        const transactions = await Transaction.find().sort({ datetime: -1 });
        res.json(transactions);
    }catch (err) {
        res.status(500).json({ error: 'Failed to fetch transactions!' });
    }
});

app.listen(4000, () => {
  console.log('Server running on port 4000');
});
