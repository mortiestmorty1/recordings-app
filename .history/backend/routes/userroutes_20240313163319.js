const usercontroller = require('../controllers/usercontroller');
const express = require('express');
const router = express.Router();

router.post('/create', usercontroller.registerUser);
router.get('/get', usercontroller.revisitUser);
router.get('/getrecs', usercontroller.getallrecsofuser);

module.exports = router;