const express = require('express');
const spentControllers = require('../controllers/spentControllers');
const auth = require('../middlewares/auth');

const router = express.Router();

router.post('/spent', auth, spentControllers.createSpent);
router.get('/spents', auth, spentControllers.getSpents);
router.get('/spent/:id', auth, spentControllers.getSpentById);
router.put('/spent/:id', auth, spentControllers.putSpent);
router.delete('/spent/:id', auth, spentControllers.deleteSpent);


module.exports = router;