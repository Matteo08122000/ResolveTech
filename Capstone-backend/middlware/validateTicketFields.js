const validateTicketFields = (req, res, next) => {
  const { title, description, priority, status } = req.body;

  if (!title || !description || !priority || !status) {
    return res.status(400).send({
      statusCode: 400,
      message: "All fields are required",
    });
  }

  next();
};

module.exports = validateTicketFields;
