const express = require("express");
const departments = express.Router();
const cloud = require("../middlware/cloudStorage");
const Departmentsmodel = require("../models/Departmentsmodel");
const validateUserId = require("../middlware/validateUserId");
const authorizeAdmin = require("../middlware/authorizeAdmin");
const assignTechnician = require("../middlware/assignTechnician");

departments.get("/departments", validateUserId, async (req, res) => {
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
  authorizeAdmin,
  cloud.single("image"),
  async (req, res) => {
    try {
      const { name, description } = req.body;

      if (!name || !description) {
        return res.status(400).send({
          statusCode: 400,
          message: "Name and description are required",
        });
      }

      const newDepartment = await Departmentsmodel({
        name,
        description,
        image: req.file.path,
      });
      await newDepartment.save();

      res.status(201).send({
        statusCode: 201,
        message: "Department created successfully",
        newDepartment,
      });
    } catch (error) {
      res.status(500).send({
        statusCode: 500,
        message: "Error creating department",
      });
    }
  }
);

departments.get("/departments/:departmentId", async (req, res) => {
  try {
    const { departmentId } = req.params;

    const department = await Departmentsmodel.findById(departmentId);

    if (!department) {
      return res.status(404).send({
        statusCode: 404,
        message: "Department not found",
      });
    }

    res.status(200).send({
      stautsCode: 200,
      message: "Department found",
      department,
    });
  } catch (error) {
    res.status(500).send({
      statusCode: 500,
      message: "Error fetching department",
    });
  }
});

departments.patch(
  "/departments/update/:departmentId",
  assignTechnician,
  async (req, res) => {
    try {
      const { departmentId } = req.params;
      const updates = req.body;

      const updatedDepartment = await Departmentsmodel.findByIdAndUpdate(
        departmentId,
        updates,
        {
          new: true,
        }
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
      res.status(500).send({
        statusCode: 500,
        message: "Error updating department",
      });
    }
  }
);

departments.delete("/departments/delete/:departmentId", async (req, res) => {
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
    res.stauts(500).send({
      statusCode: 500,
      message: "Internal server error",
    });
  }
});

module.exports = departments;
