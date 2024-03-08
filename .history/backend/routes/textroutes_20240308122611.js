const textcontroller = require('../controllers/textcontroller');
const express = require('express');
const router = express.Router();

router.post('/create', textcontroller.addText);
router.get('/get', textcontroller.getText);
router.delete('/delete', textcontroller.deleteText);
router.put('/update', textcontroller.updateText);
router.get('/getall', textcontroller.getTexts);

module.exports = router;