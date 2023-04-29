const { User } = require ('../models/userModel');

/*const createUser = async (req, res) =>{
    
    try {

        const { email, password } = req.body;
        const newUser = await User.createUser(email, password);

        return res.status(201).json({success: true, message:'User created successfully', newUser})
    } catch (error) {
        console.log(error)
        return res.status(400).json({ success: false, message: error.message})
    }
}*/

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

/*const deleteUser = async (req, res) => {
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
}*/


module.exports = {
    //createUser,
    getUsers,
    getUserById,
    //deleteUser
}