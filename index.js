const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const userRoutes = require('./routes/userRoutes');
const pantryRoutes = require("./routes/pantryRoutes");
const patientRoutes= require("./routes/patientRoutes");
const menuRoutes=require("./routes/mealRoutes");
const orderRoutes=require("./routes/orderRoutes")
const deliveryRoutes=require("./routes/deliveryRoutes")
const cors = require('cors');
dotenv.config();

const app = express();

// Middleware
app.use(cors()); // Enable CORS and allow all origins

app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    
  })
  .then(() => console.log('MongoDB connected'))
  .catch((error) => console.log('Error connecting to MongoDB:', error));

// Routes
app.use('/api/users', userRoutes);
app.use("/api/staff",pantryRoutes);
app.use("/api/staffd",deliveryRoutes);

app.use("/api/patient",patientRoutes);
app.use("/api/menu",menuRoutes);
app.use("/api/orders",orderRoutes)

// Default route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
