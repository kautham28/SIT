const express = require("express");
const router = express.Router();
const db = require("../src/config/db"); // Import database connection from config/db.js

// Middleware to validate vehicle data
const validateVehicleData = (req, res, next) => {
  const { registration_number, chassis, owner_id, fuel_quota, category_id } =
    req.body;
  if (
    !registration_number ||
    !chassis ||
    !owner_id ||
    !fuel_quota ||
    !category_id
  ) {
    return res.status(400).json({ error: "All fields are required" });
  }
  next();
};

// GET all vehicles
router.get("/", async (req, res) => {
  try {
    const connection = await db.getConnection(); // Use connection pool
    const [rows] = await connection.execute("SELECT * FROM vehicles");
    connection.release(); // Release connection back to pool
    res.json(rows);
  } catch (error) {
    console.error("GET /vehicles error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET a specific vehicle by ID
router.get("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id) || id <= 0) {
      return res.status(400).json({ error: "Invalid vehicle ID" });
    }
    const connection = await db.getConnection(); // Use connection pool
    const [rows] = await connection.execute(
      "SELECT * FROM vehicles WHERE vehicle_id = ?",
      [id]
    );
    connection.release(); // Release connection back to pool
    if (rows.length === 0) {
      return res.status(404).json({ error: "Vehicle not found" });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error(`GET /vehicles/${req.params.id} error:`, error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST a new vehicle
router.post("/", validateVehicleData, async (req, res) => {
  try {
    const { registration_number, chassis, owner_id, fuel_quota, category_id } =
      req.body;
    const connection = await db.getConnection(); // Use connection pool

    const [result] = await connection.execute(
      "INSERT INTO vehicles (registration_number, chassis, owner_id, fuel_quota, category_id) VALUES (?, ?, ?, ?, ?)",
      [registration_number, chassis, owner_id, fuel_quota, category_id]
    );

    connection.release(); // Release connection back to pool
    res.status(201).json({
      vehicle_id: result.insertId,
      message: "Vehicle created successfully",
    });
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return res
        .status(400)
        .json({ error: "Registration number or chassis already exists" });
    }
    if (error.code === "ER_NO_REFERENCED_ROW_2") {
      return res.status(400).json({ error: "Invalid owner_id or category_id" });
    }
    console.error("POST /vehicles error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// PUT to update a vehicle
router.put("/:id", validateVehicleData, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id) || id <= 0) {
      return res.status(400).json({ error: "Invalid vehicle ID" });
    }
    const { registration_number, chassis, owner_id, fuel_quota, category_id } =
      req.body;
    const connection = await db.getConnection(); // Use connection pool

    const [result] = await connection.execute(
      "UPDATE vehicles SET registration_number = ?, chassis = ?, owner_id = ?, fuel_quota = ?, category_id = ? WHERE vehicle_id = ?",
      [registration_number, chassis, owner_id, fuel_quota, category_id, id]
    );

    connection.release(); // Release connection back to pool
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Vehicle not found" });
    }
    res.json({ message: "Vehicle updated successfully" });
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return res
        .status(400)
        .json({ error: "Registration number or chassis already exists" });
    }
    if (error.code === "ER_NO_REFERENCED_ROW_2") {
      return res.status(400).json({ error: "Invalid owner_id or category_id" });
    }
    console.error(`PUT /vehicles/${req.params.id} error:`, error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE a vehicle
router.delete("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id) || id <= 0) {
      return res.status(400).json({ error: "Invalid vehicle ID" });
    }
    const connection = await db.getConnection(); // Use connection pool
    const [result] = await connection.execute(
      "DELETE FROM vehicles WHERE vehicle_id = ?",
      [id]
    );

    connection.release(); // Release connection back to pool
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Vehicle not found" });
    }
    res.json({ message: "Vehicle deleted successfully" });
  } catch (error) {
    console.error(`DELETE /vehicles/${req.params.id} error:`, error);
    if (error.code === "ER_ROW_IS_REFERENCED_2") {
      return res
        .status(400)
        .json({
          error: "Cannot delete vehicle; it is referenced by another record",
        });
    }
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/number/:number", async (req, res) => {
  try {
    const registrationNumber = req.params.number;

    const connection = await db.getConnection();
    const [rows] = await connection.execute(
      "SELECT * FROM vehicles WHERE registration_number = ?",
      [registrationNumber]
    );
    connection.release();

    if (rows.length === 0) {
      return res.status(404).json({ error: "Vehicle not found" });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error(`GET /vehicles/${req.params.number} error:`, error);
    res.status(500).json({ error: "Internal server error" });
  }
});

//update quota
router.put("/quota/:vehicle_id", async (req, res) => {
  const connection = await db.getConnection(); // Use connection pool

  try {
    const vehicle_id = parseInt(req.params.vehicle_id);
    if (isNaN(vehicle_id) || vehicle_id <= 0) {
      connection.release();
      return res.status(400).json({ error: "Invalid vehicle ID" });
    }

    const { fuel_quota, fuel_amount, station_id } = req.body;

    await connection.beginTransaction();

    const [result] = await connection.execute(
      "UPDATE vehicles SET fuel_quota = ? WHERE vehicle_id = ?",
      [fuel_quota, vehicle_id]
    );

    if (result.affectedRows === 0) {
      await connection.rollback();
      connection.release();
      return res.status(404).json({ error: "Vehicle not found" });
    }

    await connection.execute(
      "INSERT INTO vehicle_fuel_transactions (vehicle_id, station_id, fuel_amount) VALUES (?, ?, ?)",
      [vehicle_id, station_id, fuel_amount]
    );

    await connection.execute(
      "INSERT INTO station_fuel_transactions (station_id, fuel_delivered) VALUES (?, ?)",
      [station_id, fuel_amount]
    );

    await connection.commit();
    res.json({ message: "Vehicle updated successfully" });
  } catch (error) {
    await connection.rollback();
    if (error.code === "ER_DUP_ENTRY") {
      res
        .status(400)
        .json({ error: "Registration number or chassis already exists" });
    } else if (error.code === "ER_NO_REFERENCED_ROW_2") {
      res.status(400).json({ error: "Invalid owner_id or category_id" });
    } else {
      console.error(`PUT /quota/${req.params.vehicle_id} error:`, error);
      res.status(500).json({ error: "Internal server error" });
    }
  } finally {
    connection.release();
  }
});

module.exports = router;
