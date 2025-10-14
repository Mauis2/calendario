// Importar Express
const express = require('express');

// Crear la aplicación
const app = express();

// Middleware para poder recibir JSON
app.use(express.json());

// Definir el puerto
const PORT = 3000;

// Base de datos temporal (en memoria)
// Después esto será PostgreSQL
let notasDB = [];
let idCounter = 1;

// ====== RUTAS ======

// RUTA PRINCIPAL
app.get('/', (req, res) => {
    res.send('🎉 ¡Servidor del Calendario funcionando!');
});

// OBTENER TODAS LAS NOTAS
app.get('/api/notas', (req, res) => {
    res.json({
        exito: true,
        total: notasDB.length,
        notas: notasDB
    });
});

// CREAR UNA NOTA
app.post('/api/notas', (req, res) => {
    const { fecha, texto, usuario } = req.body;
    
    // Validar que envíen los datos necesarios
    if (!fecha || !texto) {
        return res.status(400).json({
            exito: false,
            mensaje: 'Faltan datos: fecha y texto son obligatorios'
        });
    }
    
    // Crear la nota
    const nuevaNota = {
        id: idCounter++,
        fecha: fecha,
        texto: texto,
        usuario: usuario || 'Anónimo',
        fechaCreacion: new Date().toISOString()
    };
    
    notasDB.push(nuevaNota);
    
    res.status(201).json({
        exito: true,
        mensaje: 'Nota creada exitosamente',
        nota: nuevaNota
    });
});

// OBTENER NOTAS DE UN DÍA ESPECÍFICO
app.get('/api/notas/:fecha', (req, res) => {
    const fecha = req.params.fecha;
    const notasDelDia = notasDB.filter(nota => nota.fecha === fecha);
    
    res.json({
        exito: true,
        fecha: fecha,
        total: notasDelDia.length,
        notas: notasDelDia
    });
});

// ELIMINAR UNA NOTA
app.delete('/api/notas/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = notasDB.findIndex(nota => nota.id === id);
    
    if (index === -1) {
        return res.status(404).json({
            exito: false,
            mensaje: 'Nota no encontrada'
        });
    }
    
    notasDB.splice(index, 1);
    
    res.json({
        exito: true,
        mensaje: 'Nota eliminada exitosamente'
    });
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log('=================================');
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    console.log('=================================');
    console.log('📋 Rutas disponibles:');
    console.log('  GET    /api/notas          - Ver todas las notas');
    console.log('  POST   /api/notas          - Crear nota');
    console.log('  GET    /api/notas/:fecha   - Notas de un día');
    console.log('  DELETE /api/notas/:id      - Eliminar nota');
    console.log('=================================');
    console.log('✅ Presiona Ctrl+C para detener');
});