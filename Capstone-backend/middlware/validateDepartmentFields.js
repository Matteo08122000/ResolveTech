const Departmentsmodel = require("../models/Departmentsmodel");

const validateDepartmentFields = async (req, res, next) => {
  const { name } = req.body;

  if (!name || name.trim() === "") {
    return res.status(400).send({
      statusCode: 400,
      message: "Department name is required",
    });
  }

  const existingDepartment = await Departmentsmodel.findOne({ name });
  if (existingDepartment) {
    return res.status(400).send({
      statusCode: 400,
      message: "A department with this name already exists",
    });
  }

  next();
};

module.exports = validateDepartmentFields;
