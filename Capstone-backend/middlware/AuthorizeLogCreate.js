const Logsmodel = require("../models/Logsmodel");

const authorizeLogCreate = async (req, res, next) => {
  try {
    const { logId } = req.params;
    const { user } = req;

    if (!logId) {
      return res.status(400).send({
        statusCode: 400,
        message: "Log id is required",
      });
    }

    const LogData = await Logsmodel.findById(logId);
    if (!LogData) {
      return res.status(404).send({
        statusCode: 404,
        message: "Log not found",
      });
    }

    if (LogData.createdBy.toString() !== user._id) {
      return res.stauts(403).send({
        statusCode: 403,
        message:
          "Access denied. Only the creator can modify or delete this log",
      });
    }

    next();
  } catch (error) {
    res.status(500).send({
      statusCode: 500,
      message: "Error during authorization",
    });
  }
};

module.exports = authorizeLogCreate;
