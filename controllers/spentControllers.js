const { Spent } = require('../models/spentModel');

const createSpent = async (req, res) => {
    try {
        const { title, description, spent, category} = req.body;
        const user = res.locals.user
        
        const newSpent = await Spent.createSpent(user.id, title, description, spent, category)
        
        return res.status(201).json({message: "Spent created successfully", newSpent})
    } catch (error) {
        console.log(error)
        return res.status(400).json({ message: error.message})
    }
}

const getSpents = async (req, res) => {
    try {
        const {spents} = res.locals.user;
        return res.status(200).json({spents});
    } catch (error) {
        console.log(error);
        return res.status(400).json({message: error.message, error});
    }
}

const getSpentById = async (req, res) => {
    try {
        const user = res.locals.user;
        const spent = user.spents.find(s => s.id === req.params.id);
        if (!spent) {
            return res.status(404).json({ message: 'Spent not found' });
        }
        return res.status(200).json(spent);
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: error.message, error})
    }
}

const putSpent = async (req, res) => {
    try {

        const spent = await Spent.putSpent(req.params.id, res.locals.user, req.body);
        if (!spent || typeof spent === "string") {
            return res.status(404).json({spent});
        }
        return res.status(200).json({message: "Spent actualized succefully"})
    } catch (error) {
        console.log(error);
        return res.status(500).json({error, message: error.message});
    }
}

const deleteSpent = async (req, res) => {
    try {
        const {id} = req.params;
        const {user} = res.locals;
        const result = await Spent.deleteSpent(id, user);
        if (typeof result === "string") {
            return res.status(400).json({result});
        }
        return res.status(200).json({message: "Deleted successfuly", result})
    } catch (error) {
        console.log(error);
        return res.status(400).json(error);
    }
}

module.exports = {
    createSpent,
    getSpents,
    getSpentById,
    putSpent,
    deleteSpent
}