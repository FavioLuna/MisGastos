const { User } = require ('../models/userModel');
const { Income } = require('../models/incomeModel');

const createUser = async (req, res) =>{
    
    try {

        const { email, password } = req.body;
        const emailExists = await User.checkEmailExists(email);
        if (emailExists) {
            return res.status(409).json({message: 'Email already in use'})

        }
        const newUser = await User.createUser(email, password);

        return res.status(201).json({message:'User created successfully', newUser})
    } catch (error) {
        console.log(error)
        return res.status(400).json({message: error.message})
    }
}

const getUsers = async (req, res) => {

    try {
        const users = await User.getUsers();

        return res.status(200).json(users)
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: error.message})
    }
}

const getUserById = async (req, res) => {

    try {
        const {id} = res.locals.user;
        const user = await User.getUserById(id);
        if (!user) {
            return res.status(404).json({message: 'User not found'})
        }
        
        return res.status(200).json({message:'User obtained successfully', user})

    } catch (error) {
        console.log(error);
        return res.status(400).json({message: error.message})
    }
}

const deleteUser = async (req, res) => {
    try {
        const {id} = res.locals.user;
        const deleted = await User.deleteUser(id);
        if (!deleted) {
            return res.status(404).json({message: 'User not found'})
        } else {
            return res.status(200).json({message:'User deleted successfully'})
        }
    } catch (error) {
        console.log(error)
        return res.status(400).json({message: error.message})
    }
}

const login = async (req, res) => {
    try {
        const user = await User.checkUser(req.body.email, req.body.password); 
        if (typeof user === "string") {
            return res.status(404).json({message: user})
        }
        console.log(user);
        const token = await User.generateToken(user);  
        return res.status(200).json({user, token});
     } catch (error) {
        console.log(error);
        return res.status(401).json({message: error.message});
    }
}

const logout = async (req, res) => {
    try {
        console.log(res.locals.user, res.locals.token);
        const result = await User.extractToken(res.locals.user, res.locals.token);
        if (typeof result === "string") {
            return res.status(400).json({result}) 
        }
        return res.status(200).json({message: "Success logout", result})
    } catch (error) {
        console.log(error);
        return res.status(400).json(error)
    }
}

const addIncome = async (req, res) => {
    try {
        const {title, description, income} = req.body;
        const {user} = res.locals;

        const newIncome = await Income.createIncome(user.id, title, description, income);

        return res.status(201).json({message: "Income created successfully", newIncome})
    } catch (error) {
        console.log(error);
        return res.status(400).json(error)
    }
}


module.exports = {
    createUser,
    getUsers,
    getUserById,
    deleteUser,
    login,
    logout,
    addIncome
}