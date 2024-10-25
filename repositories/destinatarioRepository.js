const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

exports.getDestinatariosActivos = async () => {
    const { data, error } = await supabase
        .from('destinatario')
        .select('*')
        .eq('activo', true);
    if (error) throw new Error(error.message);
    return data;
};

exports.insertDestinatario = async (destinatario) => {
    const { data, error } = await supabase
        .from('destinatario')
        .insert([destinatario]);
    if (error) throw new Error(error.message);
    return data;
};

exports.getDestinatariosSernac = async () => {
    const listaSernac = [{
        rut: 22222222
    }];
    return listaSernac;
};

exports.updateEstadoDestinatario = async (rut) => {
    const { data, error } = await supabase
        .from('destinatario')
        .update({ 'activo': false })
        .eq('rut', rut);
    if (error) throw new Error(error.message);
    return data;
};

exports.updateInfoDestinatario = async (rut, destinatarioData) => {
    const { data, error } = await supabase
        .from('destinatario')
        .update(destinatarioData)
        .eq('rut', rut);
    if (error) throw new Error(error.message);
    return data;
};