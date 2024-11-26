const Usersmodel = require("../models/Usersmodel");

const authorizeLogAccess = async (req, res, next) => {
  try {
    const { ticket } = req.body || req.query;
    const { user } = req;

    if (!ticket) {
      return res.status(400).send({
        statusCode: 400,
        message: "Ticket id is required",
      });
    }

    const ticketData = await Ticketsmodel.findById(ticket);
    if (!ticketData) {
      return res.status(404).send({
        statusCode: 404,
        message: "Ticket not found",
      });
    }

    if (
      user.role !== "admin" &&
      ticketData.assignedTo.toString() !== user._id
    ) {
        return res.status(403)
        .send({
           statusCode:403,
           message:"Access denied. You are not authorized to access this log" 
        })
    }

    next();

  } catch (error) {
    res.status(500)
    .send({
        statusCode:500,
        message:"Error during authorization"
    });
  }
};

module.exports = authorizeLogAccess;