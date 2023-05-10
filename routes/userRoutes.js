const express = require('express');
const userControllers = require('../controllers/userControllers');
const auth = require('../middlewares/auth');

const router = express.Router();

router.post('/user', userControllers.createUser);
router.post('/login', userControllers.login);
router.post('/logout', auth, userControllers.logout);
router.post('/income', auth, userControllers.addIncome)
router.get('/users', userControllers.getUsers);
router.get('/user/me', auth, userControllers.getUserById);
router.delete('/user/me', auth, userControllers.deleteUser);


module.exports = router;