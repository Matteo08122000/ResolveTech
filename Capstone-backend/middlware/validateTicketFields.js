const validateTicketFields = (req, res, next) => {
  const { title, description } = req.body;

  if (!title || !description) {
    return res.status(400).send({
      statusCode: 400,
      message: "Title and description are required",
    });
  }

  next();
};

module.exports = validateTicketFields;
