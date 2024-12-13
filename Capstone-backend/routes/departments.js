const express = require("express");
const departments = express.Router();
const multer = require("multer");
const upload = multer();
const cloud = require("../middlware/cloudStorage");
const Departmentsmodel = require("../models/Departmentsmodel");
const validateUserId = require("../middlware/validateUserId");
const authorizeAdmin = require("../middlware/authorizeAdmin");
const assignTechnician = require("../middlware/assignTechnician");
const VerifyToken = require("../middlware/VerifyToken");

departments.get("/departments", VerifyToken, async (req, res) => {
  try {
    const departments = await Departmentsmodel.find();
    res.status(200).send({
      statusCode: 200,
      message: "Departments found",
      departments,
    });
  } catch (error) {
    res.status(500).send({
      statusCode: 500,
      message: "Error fetching departments",
    });
  }
});

departments.post(
  "/departments/create",
  VerifyToken,
  authorizeAdmin,
  cloud.single("image"),
  async (req, res) => {
    try {
      const { name, description, technicians } = req.body;

      if (!name || !description) {
        return res.status(400).send({
          statusCode: 400,
          message: "Name and description are required",
        });
      }

      const newDepartment = new Departmentsmodel({
        name,
        description,
        image: req.file ? req.file.path : null,
        technicians: technicians ? JSON.parse(technicians) : [],
      });

      await newDepartment.save();

      res.status(201).send({
        statusCode: 201,
        message: "Department created successfully",
        newDepartment,
      });
    } catch (error) {
      console.error("Error creating department:", error.message);
      res.status(500).send({
        statusCode: 500,
        message: "Error creating department",
        error: error.message,
      });
    }
  }
);

departments.patch(
  "/departments/update/:departmentId",
  VerifyToken,
  authorizeAdmin,
  upload.none(), 
  async (req, res) => {
    try {
      const { departmentId } = req.params;
      const updates = { ...req.body };

      if (updates.technicians) {
        try {
          updates.technicians = JSON.parse(updates.technicians);
        } catch (error) {
          return res.status(400).send({
            statusCode: 400,
            message: "Invalid technicians format. Expected an array.",
          });
        }
      }

      const updatedDepartment = await Departmentsmodel.findByIdAndUpdate(
        departmentId,
        updates,
        { new: true }
      );

      if (!updatedDepartment) {
        return res.status(404).send({
          statusCode: 404,
          message: "Department not found",
        });
      }

      res.status(200).send({
        statusCode: 200,
        message: "Department updated successfully",
        updatedDepartment,
      });
    } catch (error) {
      console.error("Error updating department:", error.message);
      res.status(500).send({
        statusCode: 500,
        message: "Error updating department",
        error: error.message,
      });
    }
  }
);

departments.delete(
  "/departments/delete/:departmentId",
  VerifyToken,
  async (req, res) => {
    try {
      const { departmentId } = req.params;

      const deleteDepartment = await Departmentsmodel.findByIdAndDelete(
        departmentId
      );

      if (!deleteDepartment) {
        return res.status(404).send({
          statusCode: 404,
          message: "Department not Found",
        });
      }

      res.status(200).send({
        statusCode: 200,
        message: "Department deleted successfully",
        deleteDepartment,
      });
    } catch (error) {
      res.status(500).send({
        statusCode: 500,
        message: "Internal server error",
      });
    }
  }
);

module.exports = departments;
