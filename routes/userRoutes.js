const express = require('express');
const userControllers = require('../controllers/userControllers');

const router = express.Router();

router.post('/user', userControllers.createUser);
router.post('/login', userControllers.login)
router.get('/users', userControllers.getUsers);
router.get('/user/:id', userControllers.getUserById);
router.delete('/user/me/:id', userControllers.deleteUser);


module.exports = router;