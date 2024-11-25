const validateCommentFields = async (req, res, next) => {
  const { content, ticketId } = req.body;

  if (!content || content.trim() === "") {
    return res.status(400).send({
      statusCode: 400,
      message: "Content is required and cannot be empty",
    });
  }

  const ticket = await Ticketsmodel.findById(ticketId);
  if (!ticket) {
    return res.status(404).send({
      statusCode: 404,
      message: "Ticket not found",
    });
  }

  next();
};

module.exports = validateCommentFields;
