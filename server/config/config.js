// =====================
// Puerto
// =====================

process.env.PORT = process.env.PORT || 3000;

// =====================
// Entorno
// =====================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';


// =====================
// Vencimiento del token
// =====================
// 60 segundos 
// 60 minutos 
// 24 horas 
// 30 días
	
process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30 ;


// =====================
// Seed de atenticación
// =====================

process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';


// =====================
// Base de datos
// =====================

process.env.URLDB = (process.env.NODE_ENV == 'dev') ? 'mongodb://localhost:27017/cafe' : process.env.MONGO_URI;

// =====================
// Google Client Id
// =====================

process.env.CLIENT_ID = process.env.CLIENT_ID || '291878801449-qtd64lukr15nctq7r9qn2or5b97m6qrj.apps.googleusercontent.com';