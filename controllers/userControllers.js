const { User } = require ('../models/userModel');

const createUser = async (req, res) =>{
    
    try {

        const { email, password } = req.body;
        const emailExists = await User.checkEmailExists(email);
        if (emailExists) {
            return res.status(409).json({ success: false, message: 'Email already in use'})

        }
        const newUser = await User.createUser(email, password);

        return res.status(201).json({success: true, message:'User created successfully', newUser})
    } catch (error) {
        console.log(error)
        return res.status(400).json({ success: false, message: error.message})
    }
}

const getUsers = async (req, res) => {

    try {
        const users = await User.getUsers();

        return res.status(200).json(users)
    } catch (error) {
        console.log(error);
        return res.status(400).json({ success: false, message: error.message})
    }
}

const getUserById = async (req, res) => {

    try {
        const id = req.params.id;
        const user = await User.getUserById(id);
        if (!user) {
            return res.status(404).json({success: false, message: 'User not found'})
        }
        
        return res.status(200).json({success: true, message:'User obtained successfully', user})

    } catch (error) {
        console.log(error);
        return res.status(400).json({ success: false, message: error.message})
    }
}

const deleteUser = async (req, res) => {
    try {
        const {id} = req.params;
        const deleted = await User.deleteUser(id);
        if (!deleted) {
            return res.status(404).json({ success: false, message: 'User not found'})
        } else {
            return res.status(200).json({success: true, message:'User deleted successfully'})
        }
    } catch (error) {
        console.log(error)
        return res.status(400).json({ success: false, message: error.message})
    }
}

const login = async (req, res) => {
    try {
        const user = await User.checkUser(req.body.email, req.body.password); 
        if (typeof user === "string") {
            return res.status(404).json({success: false, message: user})
        }
        console.log(user);
        const token = await User.generateToken(user);  
        return res.status(200).json({success: true, user, token});
     } catch (error) {
        console.log(error);
        return res.status(401).json({success: false, message: error.message});
    }
}

const logout = async (req, res) => {
    try {
        console.log(res.locals.user, res.locals.token);
        const result = await User.extractToken(res.locals.user, res.locals.token);
        if (typeof result === "string") {
            return res.status(400).json({success: false, result}) 
        }
        return res.status(200).json({success: true, message: "Success logout", result})
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
    logout
}