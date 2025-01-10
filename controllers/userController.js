const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Register User
exports.registerUser = async (req, res) => {
  const { name, email, password, role, contactInfo, location } = req.body;
  console.log(req.body)

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'Email already exists' });

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
      contactInfo,
      location,
    });

    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Login User
exports.loginUser = async (req, res) => {
  console.log("login")
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Validate the password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log(isPasswordValid)
    if (!isPasswordValid) return res.status(401).json({ message: 'Invalid credentials' });

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, name: user.name, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(200).json({success:true, message: 'Login successful', token ,  logined: {
      ...user.toObject(), // Convert Mongoose document to plain JavaScript object
      password: undefined, // Remove the password field
    },});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get User Profile (Protected Route Example)
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password'); // Exclude the password
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// Get all unique locations based on role
exports.getUniqueLocationsByRole = async (req, res) => {
  const { role } = req.body; // Role from URL parameter, e.g., "manager"
  
  try {
    // Find all users with the given role
    const users = await User.find({ role });

    // If no users found for the role, return an error
    if (users.length === 0) {
      return res.status(404).json({ message: `No users found with the role of ${role}` });
    }

    // Extract all locations from the users
    const locations = users.map(user => user.location);

    // Get unique locations using a Set
    const uniqueLocations = [...new Set(locations)];

    // Return the unique locations
    res.status(200).json({ uniqueLocations });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// Get all users based on location and role
exports.getUsersByLocationAndRole = async (req, res) => {
  const { location, role } = req.body; // location and role from URL parameters
  console.log(location ,role)
  try {
    // Find all users with the given location and role
    const users = await User.find({ location, role });

    // If no users are found, return an error
    if (users.length === 0) {
      return res.status(404).json({ message: `No users found with the location: ${location} and role: ${role}` });
    }

    // Return the users that match the location and role
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

