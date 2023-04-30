const { Spent } = require('../models/spentModel');

const createSpent = async (req, res) => {
    try {
        const { title, description, amount, category} = req.body;
        const { id } = req.body
        Spent.createSpent()
    } catch (error) {
        
    }
}
