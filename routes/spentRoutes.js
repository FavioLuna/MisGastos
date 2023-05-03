const express = require('express');
const spentControllers = require('../controllers/spentControllers');
const auth = require('../middlewares/auth');

const router = express.Router();

router.post('/spents', auth, spentControllers.createSpent);

module.exports = router;