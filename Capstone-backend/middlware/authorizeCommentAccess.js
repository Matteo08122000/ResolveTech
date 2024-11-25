const authorizeCommentAccess = async (req, res, next) => {
  const { commentId } = req.params;
  const user = req.user;

  const comment = await Commentsmodel.findById(commentId);

  if (!comment) {
    return res.status(404).send({
      statusCode: 404,
      message: "Comment not found",
    });
  }

  if (
    comment.createdBy.toString() !== user._id.toString() &&
    user.role !== "admin"
  ) {
    return res.status(403).send({
      statusCode: 403,
      message: "You don't have a permission to modify this comment",
    });
  }

  next();
};

module.exports = authorizeCommentAccess;
