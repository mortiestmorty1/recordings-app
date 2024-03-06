const usercontroller = require('../controllers/usercontroller');
const express = require('express');
const router = express.Router();

router.post('/create', usercontroller.createUser);
router.get('/get', usercontroller.revisitUser);

module.exports = router;