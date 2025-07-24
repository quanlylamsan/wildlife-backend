
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/wildlife', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Mongoose models
const User = mongoose.model('User', {
  email: String,
  password: String,
  role: String, // admin or staff
});

const Farm = mongoose.model('Farm', {
  name: String,
  province: String,
  district: String,
  ward: String,
  address: String,
  phone: String,
  lat: Number,
  lng: Number
});

// Auth
app.post('/api/login', async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(401).send({ error: 'User not found' });

  const valid = await bcrypt.compare(req.body.password, user.password);
  if (!valid) return res.status(401).send({ error: 'Invalid password' });

  const token = jwt.sign({ id: user._id, role: user.role }, 'secret123');
  res.send({ token, role: user.role });
});

// Middleware
function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.sendStatus(401);
  try {
    const user = jwt.verify(token, 'secret123');
    req.user = user;
    next();
  } catch {
    res.sendStatus(403);
  }
}

// Farm APIs
app.post('/api/farms', authMiddleware, async (req, res) => {
  if (req.user.role !== 'admin') return res.sendStatus(403);
  const farm = new Farm(req.body);
  await farm.save();
  res.send({ success: true });
});

app.get('/api/farms', authMiddleware, async (req, res) => {
  const farms = await Farm.find();
  res.send(farms);
});

app.listen(4000, () => console.log('Backend running on port 4000'));
