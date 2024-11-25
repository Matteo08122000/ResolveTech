const authorizeAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).send({
      statusCode: 403,
      message: "Access denied. Admin role required",
    });
  }

  next();
};

module.exports = authorizeAdmin;
