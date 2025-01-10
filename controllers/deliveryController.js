const User = require('../models/User');

// Get Pantry Staff Details (Only accessible by Manager)
const getDeliveryStaffDetails = async (req, res) => {
  try { console.log("hi")
    const { role } = req.user; // Extract role from the authenticated user

    // Check if the user has the role "Manager"
    if (role !== 'PantryStaff') {
      return res.status(403).json({ message: 'Access denied. Only  pnatry staff can view' });
    }

    // Fetch users with the role 'PantryStaff'
    const pantryStaff = await User.find({ role: 'Delivery' }).select('-password');


    if (!pantryStaff || pantryStaff.length === 0) {
      return res.status(404).json({ message: 'No pantry staff found.' });
    }

    res.status(200).json(pantryStaff);
  } catch (error) {
    console.error('Error fetching pantry staff:', error);
    res.status(500).json({ message: 'Error fetching pantry staff details.', error });
  }
};

module.exports = {getDeliveryStaffDetails };
