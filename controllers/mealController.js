const Meals = require("../models/Menu");

// Add or Update Meals for a Patient
exports.addOrUpdateMeals = async (req, res) => {
  try {
    const { patientId, morning, afternoon, night } = req.body;

    // Check if meals already exist for the patient
    let mealRecord = await Meals.findOne({ patientId });

    if (!mealRecord) {
      // Create new meal record
      mealRecord = new Meals({ patientId, morning, afternoon, night });
      await mealRecord.save();
      return res.status(201).json({ message: "Meals created successfully", data: mealRecord });
    } else {
      // Update existing meal record
      if (morning) mealRecord.morning = morning;
      if (afternoon) mealRecord.afternoon = afternoon;
      if (night) mealRecord.night = night;

      await mealRecord.save();
      return res.status(200).json({ message: "Meals updated successfully", data: mealRecord });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get Meals by Patient ID
exports.getMealsByPatient = async (req, res) => {
  try {
    const { patientId } = req.params;

    const mealRecord = await Meals.findOne({ patientId }).populate("patientId", "name roomNumber");
    if (!mealRecord) {
      return res.status(404).json({ message: "Meals not found for the patient" });
    }

    res.status(200).json({ data: mealRecord });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete Meal Record
exports.deleteMeal = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedMeal = await Meals.findByIdAndDelete(id);
    if (!deletedMeal) {
      return res.status(404).json({ message: "Meal record not found" });
    }

    res.status(200).json({ message: "Meal record deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
// Get Patients with Specific Meal (morning, afternoon, or night)
exports.getPatientsWithMeal = async (req, res) => {
    try {
      const { mealTime } = req.body; // mealTime can be 'morning', 'afternoon', or 'night'
  
      if (!mealTime) {
        return res.status(400).json({ message: "mealTime field is required" });
      }
  
      // Check if the mealTime passed is valid
      if (!['morning', 'afternoon', 'night'].includes(mealTime)) {
        return res.status(400).json({ message: "Invalid mealTime. It should be 'morning', 'afternoon', or 'night'" });
      }
  
      // Dynamically build the query based on the mealTime
      const query = {};
      query[mealTime] = { $ne: [] }; // Find records where the specified meal time is not empty
  
      // Fetch meal records with a non-empty meal array for the specified time
      const mealRecords = await Meals.find(query).populate("patientId");
  
      if (mealRecords.length === 0) {
        return res.status(404).json({ message: `No patients found with ${mealTime} meal` });
      }
  
      // Return the patient details
      const patientDetails = mealRecords.map(record => ({
        patient: record.patientId,
        mealDetails: record[mealTime], // Meal details for the selected meal time
      }));
      res.status(200).json({ data: patientDetails });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  };
  