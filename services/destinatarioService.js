const ExcelJS = require('exceljs');
require('dotenv').config();
const destinatarioRepository = require('../repositories/destinatarioRepository');

exports.getDestinatarios = async () => {
    const data = await destinatarioRepository.getAllDestinatarios();
    return data;
};

exports.addDestinatario = async (destinatario) => {
    const data = await destinatarioRepository.insertDestinatario(destinatario);
    return data;
};

exports.uploadExcelAndConvert = async (fileBuffer) => {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(fileBuffer);
    const worksheet = workbook.worksheets[0];
    return convertToJson(worksheet);
};

function convertToJson(worksheet) {
    const json = [];
    const header = {};

    worksheet.getRow(1).eachCell({ includeEmpty: true }, (cell, colNumber) => {
        header[colNumber] = cell.value;
    });

    worksheet.eachRow({ includeEmpty: true }, (row, rowNumber) => {
        if (rowNumber === 1) return;

        const rowData = {};
        let tieneData = false;

        row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
            const columnName = header[colNumber] || `col${colNumber}`;
            rowData[columnName] = String(cell.value);
            if (cell.value !== null && cell.value !== '') tieneData = true;
        });

        if (tieneData) json.push(rowData);
    });

    return json;
}
