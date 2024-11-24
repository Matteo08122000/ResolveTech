const validateLogFields = (req, res, next) => {
    const {ticket, action} = req.body;
    if(!ticket || !action) {
        return res.status(400)
        .send({
            statusCode: 400,
            message: "Ticket ID and action are required"
        });
    }
    next();
};

module.exports = validateLogFields;