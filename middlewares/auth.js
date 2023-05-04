const config = require('../config/config');
const jwt = require('jsonwebtoken');
const { User } = require('../models/userModel')

const auth = async (req, res, next) => {
    try {
        let token = req.headers.authorization;
        if (!token) {
            return res.status(401).json({message: 'Unauthorized'});
        } else {
            token = token.replace('Bearer ', '');
            const payload = jwt.verify(token, config.JWTSecret)

            const user = await User.getUserById(payload.id);

            if (!user) {
                return res.status(404).json({message: 'User not found'})
            }

            res.locals.user = user;
            res.locals.token = token;
            next();
        }
        
    } catch (error) {
        console.log(error);
        return res.status(401).json({success: false, message: error.message})
    }
}

module.exports = auth;