const destinatarioService = require('../services/destinatarioService');

exports.getDestinatarios = async (req, res) => {
    try {
        const data = await destinatarioService.getDestinatarios();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.addDestinatario = async (req, res) => {
    const { rut, dvrut, nombre, snombre, appaterno, apmaterno, email, telefono } = req.body;
    try {
        const data = await destinatarioService.addDestinatario({ rut, dvrut, nombre, snombre, appaterno, apmaterno, email, telefono });
        res.status(200).send({ message: 'Destinatario agregado exitosamente', data });
    } catch (error) {
        res.status(400).send({ message: 'Error al agregar destinatario', error: error.message });
    }
};

exports.uploadExcel = async (req, res) => {
    const jsonData = await destinatarioService.uploadExcelAndConvert(req.file.buffer);
    res.json(jsonData);
};
