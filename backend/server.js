// Importar módulos
const express = require('express');
const cors = require('cors');
const pool = require('./db');

// Crear la aplicación
const app = express();

// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cors());

// Puerto
const PORT = 3000;

// ====== RUTAS ======

// RUTA PRINCIPAL
app.get('/', (req, res) => {
    res.send('🎉 Servidor del Calendario con PostgreSQL funcionando!');
});

// OBTENER NOTAS DEL USUARIO
app.get('/api/notas', async (req, res) => {
    const { usuario_email } = req.query;
    
    if (!usuario_email) {
        return res.status(400).json({
            exito: false,
            mensaje: 'Email de usuario requerido'
        });
    }
    
    try {
        // Obtener ID del usuario
        const usuarioResult = await pool.query(
            'SELECT id FROM usuarios WHERE email = $1',
            [usuario_email]
        );
        
        if (usuarioResult.rows.length === 0) {
            return res.status(404).json({
                exito: false,
                mensaje: 'Usuario no encontrado'
            });
        }
        
        const usuario_id = usuarioResult.rows[0].id;
        
        // Obtener notas del usuario
        const result = await pool.query(
            'SELECT * FROM notas WHERE usuario_id = $1 ORDER BY fecha DESC',
            [usuario_id]
        );
        
        res.json({
            exito: true,
            total: result.rows.length,
            notas: result.rows
        });
    } catch (error) {
        console.error('Error al obtener notas:', error);
        res.status(500).json({
            exito: false,
            mensaje: 'Error al obtener notas'
        });
    }
});

// CREAR UNA NOTA
app.post('/api/notas', async (req, res) => {
    const { fecha, texto, imagen, video, usuario_email } = req.body;
    
    if (!fecha || !texto) {
        return res.status(400).json({
            exito: false,
            mensaje: 'Faltan datos: fecha y texto son obligatorios'
        });
    }
    
    try {
        // Obtener el ID del usuario por su email
        const usuarioResult = await pool.query(
            'SELECT id FROM usuarios WHERE email = $1',
            [usuario_email]
        );
        
        if (usuarioResult.rows.length === 0) {
            return res.status(404).json({
                exito: false,
                mensaje: 'Usuario no encontrado'
            });
        }
        
        const usuario_id = usuarioResult.rows[0].id;
        
        // Insertar la nota
        const result = await pool.query(
            'INSERT INTO notas (usuario_id, fecha, texto, imagen, video) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [usuario_id, fecha, texto, imagen || null, video || null]
        );
        
        res.status(201).json({
            exito: true,
            mensaje: 'Nota creada exitosamente',
            nota: result.rows[0]
        });
    } catch (error) {
        console.error('Error al crear nota:', error);
        res.status(500).json({
            exito: false,
            mensaje: 'Error al crear nota'
        });
    }
});

// ELIMINAR UNA NOTA
app.delete('/api/notas/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    
    try {
        const result = await pool.query('DELETE FROM notas WHERE id = $1 RETURNING *', [id]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({
                exito: false,
                mensaje: 'Nota no encontrada'
            });
        }
        
        res.json({
            exito: true,
            mensaje: 'Nota eliminada exitosamente'
        });
    } catch (error) {
        console.error('Error al eliminar nota:', error);
        res.status(500).json({
            exito: false,
            mensaje: 'Error al eliminar nota'
        });
    }
});

// REGISTRO DE USUARIO
app.post('/api/usuarios/registro', async (req, res) => {
    const { nombre, email, password } = req.body;
    
    if (!nombre || !email || !password) {
        return res.status(400).json({
            exito: false,
            mensaje: 'Todos los campos son obligatorios'
        });
    }
    
    try {
        const existe = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);
        
        if (existe.rows.length > 0) {
            return res.status(400).json({
                exito: false,
                mensaje: 'Este email ya está registrado'
            });
        }
        
        const result = await pool.query(
            'INSERT INTO usuarios (nombre, email, password) VALUES ($1, $2, $3) RETURNING id, nombre, email, fecha_registro',
            [nombre, email, password]
        );
        
        res.status(201).json({
            exito: true,
            mensaje: 'Usuario registrado exitosamente',
            usuario: result.rows[0]
        });
    } catch (error) {
        console.error('Error al registrar usuario:', error);
        res.status(500).json({
            exito: false,
            mensaje: 'Error al registrar usuario'
        });
    }
});

// LOGIN DE USUARIO
app.post('/api/usuarios/login', async (req, res) => {
    const { email, password } = req.body;
    
    if (!email || !password) {
        return res.status(400).json({
            exito: false,
            mensaje: 'Email y contraseña son obligatorios'
        });
    }
    
    try {
        const result = await pool.query(
            'SELECT id, nombre, email FROM usuarios WHERE email = $1 AND password = $2',
            [email, password]
        );
        
        if (result.rows.length === 0) {
            return res.status(401).json({
                exito: false,
                mensaje: 'Email o contraseña incorrectos'
            });
        }
        
        res.json({
            exito: true,
            mensaje: 'Login exitoso',
            usuario: result.rows[0]
        });
    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({
            exito: false,
            mensaje: 'Error en el login'
        });
    }
});

// Iniciar servidor
app.listen(PORT, '0.0.0.0', () => {
    console.log('=================================');
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    console.log('=================================');
    console.log('📋 Rutas disponibles:');
    console.log('  GET    /api/notas              - Ver todas las notas');
    console.log('  POST   /api/notas              - Crear nota');
    console.log('  GET    /api/notas/:fecha       - Notas de un día');
    console.log('  DELETE /api/notas/:id          - Eliminar nota');
    console.log('  POST   /api/usuarios/registro  - Registrar usuario');
    console.log('  POST   /api/usuarios/login     - Login');
    console.log('=================================');
    console.log('✅ Presiona Ctrl+C para detener');
});