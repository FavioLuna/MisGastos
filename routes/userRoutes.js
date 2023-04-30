const express = require('express');
const userControllers = require('../controllers/userControllers');

const router = express.Router();

router.post('/signup', userControllers.createUser);
//router.post('/signin')
router.get('/users', userControllers.getUsers);
router.get('/user/:id', userControllers.getUserById);
router.delete('/user/me/:id', userControllers.deleteUser);

module.exports = router;