const { Pool } = require('pg');

// Configuración de la conexión a PostgreSQL
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'calendario_db',
    password: 'CalendarioSeguro2024',  // Tu contraseña
    port: 5432,
});

// Probar la conexión
pool.connect((err, client, release) => {
    if (err) {
        return console.error('❌ Error al conectar con PostgreSQL:', err.stack);
    }
    console.log('✅ Conectado a PostgreSQL exitosamente');
    release();
});

module.exports = pool;