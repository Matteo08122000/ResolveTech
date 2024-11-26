const express = require("express");
const comments = express.Router();
const Commentsmodel = require("../models/Commentsmodel");
const Ticketsmodel = require("../models/Ticketsmodel");
const Usersmodel = require("../models/Usersmodel");
const VerifyToken = require("../middlware/VerifyToken");
const validateUserId = require("../middlware/validateUserId");
const authorizeCommentsAccess = require("../middlware/authorizeCommentAccess");
const validateCommentFields = require("../middlware/validateCommentFields");

comments.get(
  "/comments/tickets/:ticketId",
  VerifyToken,
  validateUserId,
  authorizeCommentsAccess,
  async (req, res) => {
    try {
      const { ticketId } = req.params;
      const commentList = await Commentsmodel.find({ ticket: ticketId })
        .populate("user", "name email role")
        .populate("ticket", "title description status priority");

      if (!commentList.length) {
        return res.status(404).send({
          statusCode: 404,
          message: "No comments found for this ticket",
        });
      }

      res.status(200).send({
        statusCode: 200,
        message: "comments found for this ticket",
        commentList,
      });
    } catch (error) {
      res.status(500).send({
        statusCode: 500,
        message: "Error retrieving comments",
      });
    }
  }
);

comments.post(
  "/comments/create",
  VerifyToken,
  validateUserId,
  validateCommentFields,
  async (req, res) => {
    try {
      const { ticket, user, content } = req.body;

      if (!ticket || !user || !content) {
        return res.status(400).send({
          statusCode: 400,
          message: "Ticket, user, and content are required",
        });
      }

      const ticketExist = await Ticketsmodel.findById(ticket);
      const userExist = await Usersmodel.findById(user);

      if (!ticketExist) {
        return res.status(404).send({
          statusCode: 404,
          message: "Ticket not found",
        });
      }

      if (!userExist) {
        return res.status(404).send({
          statusCode: 404,
          message: "User not found",
        });
      }

      const newComment = new Commentsmodel({ ticket, user, content });
      const saveComment = await newComment.save();

      res.status(201).send({
        statusCode: 201,
        message: "Comment added successfully",
        saveComment,
      });
    } catch (error) {
      res.status(500).send({
        statusCode: 500,
        message: "Error adding comment",
      });
    }
  }
);

comments.patch(
  "/comments/update/:commentId",
  VerifyToken,
  validateUserId,
  authorizeCommentsAccess,
  validateCommentFields,
  async (req, res) => {
    try {
      const { commentId } = req.params;
      const { content } = req.body;

      if (!content) {
        return res.status(400).send({
          statusCode: 400,
          message: "Content is required to update a comment",
        });
      }
      const updateComment = await Commentsmodel.findByIdAndUpdate(
        commentId,
        { content },
        { new: true }
      )

        .populate("user", "name email role")
        .populate("ticket", "title description");

      if (!updateComment) {
        return res.status(404).send({
          statusCode: 404,
          message: "Comment not found",
        });
      }

      res.status(200).send({
        statusCode: 200,
        message: "Comment updated successfully",
        updateComment,
      });
    } catch (error) {
      res.status(500).send({
        statusCode: 500,
        message: "Error updating comment",
      });
    }
  }
);

comments.delete(
  "/comments/delete/:commentId",
  VerifyToken,
  validateUserId,
  authorizeCommentsAccess,
  async (req, res) => {
    try {
      const { commentId } = req.params;

      const deleteComment = await Commentsmodel.findByIdAndDelete(commentId);

      if (!deleteComment) {
        return res.status(404).send({
          statusCode: 404,
          message: "Comment not found",
        });
      }

      res.status(200).send({
        statusCode: 200,
        message: "Comment deleted successfully",
      });
    } catch (error) {
      res.status(500).send({
        statusCode: 500,
        message: "Error deleting comment",
      });
    }
  }
);

module.exports = comments;
