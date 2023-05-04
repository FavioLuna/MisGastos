const { Spent } = require('../models/spentModel');

const createSpent = async (req, res) => {
    try {
        const { title, description, amount, category} = req.body;
        const user = res.locals.user
        
        const newSpent = await Spent.createSpent(user.id, title, description, amount, category)
        
        return res.status(201).json({success: true, message: "Spent created successfully", newSpent})
    } catch (error) {
        console.log(error)
        return res.status(400).json({ success: false, message: error.message})
    }
}

module.exports = {
    createSpent
}