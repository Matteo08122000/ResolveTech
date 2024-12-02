module.exports = (req, res, next) => {
  const openRoutes = ["/login", "/logout", "/register", "/users/create"];
  if (openRoutes.includes(req.path)) {
    return next();
  }

  const authHeader = req.header("authorization");
  const token = authHeader?.replace("Bearer ", "");
  if (!token) {
    return res.status(401).send({
      statusCode: 401,
      message: "Token not valid",
    });
  }

  try {
    const verify = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verify;
    next();
  } catch (error) {
    return res.status(403).send({
      statusCode: 403,
      message: "Token not valid",
    });
  }
};
