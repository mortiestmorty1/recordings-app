const textcontroller = require('../controllers/textcontroller');
const express = require('express');
const router = express.Router();

router.post('/create', textcontroller.addText);
router.get('/get', textcontroller.getText);
router.delete('/delete', textcontroller.deleteText);
router.put('/update', textcontroller.updateText);

module.exports = router;