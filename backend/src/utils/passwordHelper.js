// Helper para generar hash de contraseñas
// Ejecutar: node src/utils/passwordHelper.js
const bcrypt = require('bcrypt');

if (require.main === module) {
    const password = process.argv[2] || 'admin123';
    
    bcrypt.hash(password, 10, (err, hash) => {
        if (err) {
            console.error('Error:', err);
            return;
        }
        console.log('Password:', password);
        console.log('Hash:', hash);
        console.log('\nCopia este hash y úsalo en el script SQL para el usuario admin.');
    });
}

module.exports = {};

