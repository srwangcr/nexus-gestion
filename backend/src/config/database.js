/**
 * Configuración de conexión a PostgreSQL
 * Usa el módulo 'pg' para conectarse a la base de datos
 */
const { Pool } = require('pg');
const env = require('./env');

// Usar connection string o configuración individual
let poolConfig;

if (env.DATABASE_URL) {
  // Si hay DATABASE_URL, usarla
  poolConfig = {
    connectionString: env.DATABASE_URL,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
    ssl: env.NODE_ENV === 'production' ? {
      rejectUnauthorized: false
    } : false
  };
} else {
  // Configuración individual
  poolConfig = {
    host: env.DB_HOST || '/var/run/postgresql',
    port: env.DB_PORT,
    database: env.DB_NAME,
    user: env.DB_USER,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
    ssl: false
  };
  
  // Solo agregar password si está definida
  if (env.DB_PASSWORD && env.DB_PASSWORD.length > 0) {
    poolConfig.password = env.DB_PASSWORD;
  }
}

// Crear pool de conexiones
const pool = new Pool(poolConfig);

// Evento de conexión
pool.on('connect', () => {
  console.log('📦 Conectado a PostgreSQL');
});

// Evento de error
pool.on('error', (err) => {
  console.error('❌ Error en conexión PostgreSQL:', err);
  process.exit(-1);
});

/**
 * Ejecutar una consulta SQL
 * @param {string} text - Query SQL
 * @param {Array} params - Parámetros de la query
 * @returns {Promise} Resultado de la query
 */
const query = async (text, params) => {
  const start = Date.now();
  try {
    const result = await pool.query(text, params);
    const duration = Date.now() - start;
    if (env.NODE_ENV === 'development') {
      console.log('📝 Query ejecutada:', { text, duration: `${duration}ms`, rows: result.rowCount });
    }
    return result;
  } catch (error) {
    console.error('❌ Error en query:', error.message);
    throw error;
  }
};

/**
 * Obtener un cliente del pool para transacciones
 * @returns {Promise} Cliente de conexión
 */
const getClient = async () => {
  const client = await pool.connect();
  return client;
};

/**
 * Probar la conexión a la base de datos
 * @returns {Promise<boolean>} true si la conexión es exitosa
 */
const testConnection = async () => {
  try {
    const result = await query('SELECT NOW()');
    console.log('✅ Conexión a base de datos exitosa:', result.rows[0].now);
    return true;
  } catch (error) {
    console.error('❌ Error al conectar a la base de datos:', error.message);
    return false;
  }
};
module.exports = {
  pool,
  query,
  getClient,
  testConnection
};