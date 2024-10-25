const express = require('express');
const multer = require('multer');
const destinatarioController = require('../controllers/destinatarioController');

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Rutas para destinatarios
router.get('/getDest', destinatarioController.getDestinatarios);
router.post('/addDest', destinatarioController.addDestinatario);
router.post('/subirExcel', upload.single('file'), destinatarioController.uploadExcel);

module.exports = router;
