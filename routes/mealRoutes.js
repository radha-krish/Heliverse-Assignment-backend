const express = require("express");
const router = express.Router();
const mealsController = require("../controllers/mealController");

// Add or Update Meals
router.post("/", mealsController.addOrUpdateMeals);

// Get Meals by Patient ID
router.get("/:patientId", mealsController.getMealsByPatient);

// Delete Meal Record
router.delete("/get/:id", mealsController.deleteMeal);
router.post("/get-pids",mealsController.getPatientsWithMeal);
module.exports = router;
