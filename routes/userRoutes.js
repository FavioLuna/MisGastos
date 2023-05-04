const express = require('express');
const userControllers = require('../controllers/userControllers');
const auth = require('../middlewares/auth');

const router = express.Router();

router.post('/user', userControllers.createUser);
router.post('/login', userControllers.login);
router.post('/loguot', auth, userControllers.logout);
router.get('/users', userControllers.getUsers);
router.get('/user/:id', userControllers.getUserById);
router.delete('/user/me/:id', userControllers.deleteUser);


module.exports = router;