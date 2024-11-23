const Usermodel = require("../models/Usersmodel");


const validateUserId = async (req, res, next) => {
    const {userId} = req.params;
    if(!userId) {
        return res.status(400) 
        .send ({
            statusCode: 400,
            message: "User id is required",
        });
    }

    try{
        const user = await Usermodel.findById(userId);
        if(!user) {
            return res .status(400)
            .send({
                statusCode: 400,
                message: "User not found"
            });
        }

        req.user = user;
        next();
    }catch(error) {
        res.status(500)
        .send({
            statusCode: 500,
            message: "Invalid User ID Format",
        });
    }
};

module.exports = validateUserId;