// Este archivo es opcional y puede ser usado si necesitas un nivel adicional de abstracción
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

exports.getAllDestinatarios = async () => {
    const { data, error } = await supabase.from('destinatario').select('*');
    if (error) throw new Error(error.message);
    return data;
};

exports.insertDestinatario = async (destinatario) => {
    const { data, error } = await supabase.from('destinatario').insert([destinatario]);
    if (error) throw new Error(error.message);
    return data;
};
