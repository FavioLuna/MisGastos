const express = require('express');
const userControllers = require('../controllers/userControllers');

const router = express.Router();

//router.post('/', userControllers.createUser);
router.get('/users', userControllers.getUsers);
router.get('/user/:id', userControllers.getUserById);
//router.delete('/:id', userControllers.deleteUser);

module.exports = router;