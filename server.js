const express = require('express');
const cors = require('cors');
const usuarioRoutes = require('./routes/destinatarioRoutes');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Usar las rutas
app.use('/', usuarioRoutes);

app.listen(port, () => {
    console.log(`service running on port ${port}`);
});
