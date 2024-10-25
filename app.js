const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
const multer = require('multer');
const ExcelJS = require('exceljs');
require('dotenv').config();

const app = express();
const port = 3000;

// Habilitar CORS
app.use(cors());
// Middleware para parsear JSON
app.use(express.json());

// Configura Supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Ruta para obtener datos destinatarios
app.get('/getDestinatarios', async (req, res) => {
    const { data, error } = await supabase
        .from('destinatario')
        .select('*');

    if (error) {
        res.status(500).json({ error: error.message });
    } else {
        res.status(200).json(data);
    }
});

// Configuración de multer para almacenar archivos en memoria
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Ruta para subir el archivo y convertirlo a JSON
app.post('/subirExcel', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).send('No se ha subido ningún archivo.');
        }

        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.load(req.file.buffer); // Cargar el archivo Excel desde el buffer

        const worksheet = workbook.worksheets[0]; // Obtener la primera hoja
        const jsonData = convertToJson(worksheet);

        res.json(jsonData); // Devolver el JSON como respuesta
    } catch (error) {
        console.error('Error al procesar el archivo:', error);
        res.status(500).send('Error al procesar el archivo.');
    }
});

// Función para convertir la hoja de Excel a JSON
function convertToJson(worksheet) {
    const json = [];
    const header = {};

    // la primera fila contiene los encabezados
    worksheet.getRow(1).eachCell({ includeEmpty: true }, (cell, colNumber) => {
        header[colNumber] = cell.value; // Guarda los encabezados
    });

    // Recorre cada fila después de la primera (que son los datos)
    worksheet.eachRow({ includeEmpty: true }, (row, rowNumber) => {
        if (rowNumber === 1) return; // Salta la primera fila (encabezados)

        const rowData = {};
        let tieneData = false; // Variable para verificar si hay datos en la fila

        row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
            const columnName = header[colNumber] || `col${colNumber}`; // Usa el encabezado como clave

            // Si la columna es 'email', verifica si es un objeto y extrae la propiedad 'text'
            if (columnName === 'email' && typeof cell.value === 'object' && cell.value.text) {
                rowData[columnName] = cell.value.text; // Asigna solo el texto del email
            } else {
                rowData[columnName] = String(cell.value); // Asigna el valor de la celda
            }

            // Verifica si hay algún valor no nulo
            if (cell.value !== null && cell.value !== '') {
                tieneData = true; // La fila tiene datos
            }
        });

        // Solo agregar filas que contengan al menos un valor no nulo
        if (tieneData) {
            json.push(rowData);
        }
    });

    return json;
}

// Ruta para subir destinatarios
app.post('/addDest', async (req, res) => {
    const { rut, dvrut, nombre, snombre, appaterno, apmaterno, email, telefono } = req.body; // Obtener datos del cuerpo de la petición

    try {
        // Insertar destinatario en la tabla 'destinatarios'
        const { data, error } = await supabase
            .from('destinatario')
            .insert([
                {
                    rut: rut,
                    dvrut: dvrut,
                    nombre: nombre,
                    snombre: snombre,
                    appaterno: appaterno,
                    apmaterno: apmaterno,
                    email: email,
                    telefono: telefono
                }
            ]);

        if (error) throw error; // Si hay un error, lanzarlo para ser atrapado

        res.status(200).send({ message: 'Destinatario agregado exitosamente', data });
    } catch (error) {
        res.status(400).send({ message: 'Error al agregar destinatario', error: error.message });
    }
});

app.listen(port, () => {
    console.log(`API running on port ${port}`);
});